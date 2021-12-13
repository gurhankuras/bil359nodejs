
import {Request, Response} from 'express'
import db from '../db/db'

export default async function addHospital(req: Request, res: Response) {
    console.log("ADD OFFER RUN")
    const hospitalName = req.body.hospitalName
    const companyIds = req.body.companyIds

    console.log(req.body)
    
    if (!hospitalName) {
        return res.status(400).send({message: "Gerekli bilgiler eksik!"})
    }

    let companiesQueryStr = `(@insertedHospitalId, ${companyIds[0]})`
    for(let i = 1; i < companyIds.length; ++i) {
        companiesQueryStr = companiesQueryStr.concat(`,
        `)
        companiesQueryStr = companiesQueryStr.concat(`(@insertedHospitalId, ${companyIds[i]})`)
    }

    if (companyIds.length == 0) {
        return res.send({message:  "Hastane basarili bir sekilde eklendi"})
    }

    
    const sqlStr = `
                START TRANSACTION;
                INSERT INTO Hospitals (\`hospital_name\`) VALUES ('${hospitalName}');
                SET @insertedHospitalId = LAST_INSERT_ID();
                INSERT INTO CompanyHospital (hospital_id, company_id) VALUES 
                ${companiesQueryStr};
                COMMIT;
    `
            
    console.log(sqlStr)
    
    db.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).send({message: "Bir hata oldu"})
        }
        console.log(result)
        // @ts-ignore
        if (result[1].affectedRows == 1 && result[3].affectedRows == companyIds.length) {
            return res.status(200).send({message: "Hastane basarili bir sekilde eklendi"})
        }
        return res.status(400).send({message: "Bir hata oldu"})
    })                                                     
}