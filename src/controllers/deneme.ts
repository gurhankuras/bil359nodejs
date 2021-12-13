import {Request, Response} from 'express'
import { omit } from 'lodash';
import db from '../db/db'
import { processHospital } from '../db/util';


export default async function deneme(req: Request, res: Response) {
    console.log(req.body)
    const age = Number.parseInt(req.body.age);
    const hospitalName = req.body.hospitalName;
    const queryString = `SELECT *, (SELECT id
        FROM Hospitals
        WHERE hospital_name='${hospitalName}') AS hospital_id 
    FROM Offer 
    JOIN Companies 
    ON Companies.id = company_id 
    WHERE age_start <= ${age} 
    AND age_end >= ${age} 
    AND company_id IN 
        (SELECT company_id
            FROM CompanyHospital
            WHERE hospital_id = (SELECT id
                FROM Hospitals
                WHERE hospital_name='${hospitalName}'))`;

    console.log(queryString)
    db.query(queryString, (err, result) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }

        // @ts-ignore
        if (result.length == 0) {
            console.log("buraya gırdı ")
            return res.status(400).send({message: "Teklif Bulunamadi!"})
        }

        // @ts-ignore
        //let firstOffer = result[0]


        // @ts-ignore
        const final = result.map((rawOffer) => {
            let processedOffer = {...rawOffer, price: Number.parseFloat(rawOffer.price)}
            console.log(rawOffer)

            let company = {company_name: processedOffer.company_name, id: processedOffer.company_id, image: processedOffer.image}
            let offer = omit(processedOffer, ['company_id','company_name', 'image'])
            offer.company = company
            return offer
            /*
            return db.query(`SELECT * FROM Hospitals WHERE hospital_name = '${hospitalName}'`, (err, hospitals) => {
                if (err) {
                    return res.sendStatus(400)
                }
                // @ts-ignore
                if (hospitals.length == 0) {
                    return res.sendStatus(400)
                }

                // @ts-ignore
                let hospital = hospitals[0]
               
                offer.hospital = processHospital(hospital)
                

                //console.log(offer)
                return res.send(offer)
            })
            */
        })
        
        return res.send(final)
    
        
    })
}