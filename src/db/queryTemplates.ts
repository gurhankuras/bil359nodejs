import db from "./db"


enum QueryTemplates {
    // companies
    createCompany = `INSERT INTO Companies (company_name, image) VALUES (?, ?)`,
    deleteCompany = `DELETE FROM Companies WHERE id = ?`,
    getCompaniesPaginated = `SELECT * FROM Companies ORDER BY company_name LIMIT ? OFFSET ?`,
    getCompaniesByNamePaginated = `SELECT * FROM Companies WHERE company_name = ? ORDER BY company_name LIMIT ? OFFSET ?`,
    
    
    // hospitals
    getHospitalById = `SELECT * FROM Hospitals WHERE id = ?`,
    deleteHospital = `DELETE FROM Hospitals WHERE id = ?`,
    addHospitalWithAffiliatedCompanies = "",
    getCompanyHospitals = "",

    // discount
    addDiscount = `UPDATE Offer SET price = ? WHERE id = ? AND price = ?`,
    getAllCompanyDiscounts = `SELECT * FROM Offer 
    JOIN Companies 
    ON Offer.company_id = Companies.id
    WHERE Offer.price < Offer.previous_value`,
    dropCompanyDiscounts = `UPDATE Offer SET previous_value = NULL WHERE company_id = ?`,

    // offers
    getOffer = `SELECT * FROM Offer WHERE company_id = (SELECT id FROM Companies WHERE company_name = ? LIMIT 1) AND age_start = ? AND age_end = ? LIMIT 1`,
    addOffer = `INSERT INTO Offer (age_start, age_end, price, company_id) VALUES (?, ?, ?, 
                (SELECT id
                FROM Companies
                WHERE company_name = ? LIMIT 1))`,
    getAllCompanyOffers = `SELECT * FROM Offer JOIN Companies ON Offer.company_id = Companies.id`,
    getOffersByAgeAndHospitalName = `SELECT *, (SELECT id FROM Hospitals WHERE hospital_name = ?) AS hospital_id 
                                    FROM Offer 
                                    JOIN Companies 
                                    ON Companies.id = company_id 
                                    WHERE age_start <= ? 
                                    AND age_end >= ? 
                                    AND company_id IN (SELECT company_id
                                                       FROM CompanyHospital
                                                       WHERE hospital_id = (SELECT id
                                                                            FROM Hospitals
                                                                            WHERE hospital_name = ?))`,
}
/*
 // discount
 addDiscount = `UPDATE Offer SET price = ? WHERE id = ? AND price = ?`,
 getAllCompanyDiscounts = `SELECT * FROM Offer 
 JOIN Companies 
 ON Offer.company_id = Companies.id
 WHERE Offer.price < Offer.previous_value`,
*/

function dropCompanyDiscounts(id: number) {
    return db.format(QueryTemplates.dropCompanyDiscounts, [id]);
}

function getOffer({companyName, ageStart, ageEnd}: {companyName: string, ageStart: number, ageEnd: number}) {
    return db.format(QueryTemplates.getOffer, [companyName, ageStart, ageEnd]);
}

function addDiscount({discountedPrice, id, currentPrice}: {discountedPrice: number, id: number, currentPrice: number}) {
    return db.format(QueryTemplates.addDiscount, [discountedPrice, id, currentPrice]);
}


function getAllCompanyDiscounts() {
    return db.format(QueryTemplates.getAllCompanyDiscounts);
}


function createCompany({companyName, image}:  {companyName: string, image: string}): string {
    return db.format(QueryTemplates.createCompany, [companyName, image]);
}

function deleteCompanyById(id: number): string {
    return db.format(QueryTemplates.deleteCompany, [id]);
}

function deleteHospitalById(id: number): string {
    return db.format(QueryTemplates.deleteHospital, [id]);
}

function addOffer({ageStart, ageEnd, price, companyName}: {ageStart: number, ageEnd: number, price: number, companyName: string}) {
    return db.format(QueryTemplates.addOffer, [ageStart, ageEnd, price, companyName]);
}

function getCompaniesPaginated({limit, offset}: {limit: number, offset: number}): string {
    return db.format(QueryTemplates.getCompaniesPaginated, [limit, offset]);
}

function getCompaniesByNamePaginated({name, limit, offset}: {name: string, limit: number, offset: number}): string {
    return db.format(QueryTemplates.getCompaniesByNamePaginated, [name, limit, offset]);
}

function getHospitalsByCompany({companyId, hospitalName, limit, offset }: {companyId: number, hospitalName: string | null, limit: number, offset: number}) {
   const str = `SELECT * 
   FROM Hospitals
   WHERE id IN 
   (SELECT hospital_id
   FROM CompanyHospital
   WHERE company_id = ?)
   ${hospitalName != null ? `AND hospital_name= ?` : ''}
   LIMIT ?
   OFFSET ?
   `;
   
   return hospitalName != null ? db.format(str, [companyId, hospitalName, limit, offset]) : db.format(str, [companyId, limit, offset])
}


function getHospitalById(id: number): string {
    return db.format(QueryTemplates.getHospitalById, [id]);
}

const getAllCompanyOffers = () => QueryTemplates.getAllCompanyOffers

function getOffersByAgeAndHospitalName({age, hospitalName}: {age: number, hospitalName: string}) {
    return db.format(QueryTemplates.getOffersByAgeAndHospitalName, [hospitalName, age, age, hospitalName]);
}

function addHospital({companyIds, hospitalName}: {companyIds: [number], hospitalName: string}) {

    let companiesQueryStr = `(@insertedHospitalId, ?)`
    // @ts-ignore
    if (companyIds.length == 0) {
        companiesQueryStr = "INSERT INTO Hospitals (hospital_name) VALUES (?)"
        return db.format(companiesQueryStr, [hospitalName]);
    }

    for(let i = 1; i < companyIds.length; ++i) {
        companiesQueryStr = companiesQueryStr.concat(`,(@insertedHospitalId, ?)`)
    }
    
    const sqlStr = `
                START TRANSACTION;
                INSERT INTO Hospitals (hospital_name) VALUES (?);
                SET @insertedHospitalId = LAST_INSERT_ID();
                INSERT INTO CompanyHospital (hospital_id, company_id) VALUES 
                ${companiesQueryStr};
                COMMIT;
    `
    return db.format(sqlStr, [hospitalName, ...companyIds])
}

export const queries = {
    createCompany: createCompany,
    deleteCompanyById: deleteCompanyById,
    getCompaniesPaginated: getCompaniesPaginated,
    getCompaniesByNamePaginated: getCompaniesByNamePaginated,

    getHospitalById: getHospitalById,
    deleteHospitalById: deleteHospitalById,
    getHospitalsByCompany: getHospitalsByCompany,
    addHospital: addHospital,

    getAllCompanyDiscounts: getAllCompanyDiscounts,
    addDiscount: addDiscount,
    dropCompanyDiscounts: dropCompanyDiscounts,

    getOffer: getOffer,
    addOffer: addOffer,
    getAllCompanyOffers: getAllCompanyOffers,
    getOffersByAgeAndHospitalName: getOffersByAgeAndHospitalName
}

