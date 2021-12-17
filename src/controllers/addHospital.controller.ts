
import {Request, Response} from 'express'
import db from '../db/db'
import { queries } from '../db/queryTemplates'
import requestValidators from '../validators/requestValidators';

export default async function addHospital(req: Request, res: Response) {
    console.log("ADD OFFER RUN")

    const {error, value} = requestValidators.addHospital.validate(req.body);

    if (error) {
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }

    const hospitalName = <string> req.body.hospitalName
    const companyIds = <[number]> req.body.companyIds

    console.log(req.body)
   
    const formattedQuery = queries.addHospital({hospitalName, companyIds})
            
    console.log(formattedQuery)
    
    
    db.query(formattedQuery, (err, result) => {
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