

import {Request, Response} from 'express'
import db from '../db/db'

export default async function addOffer(req: Request, res: Response) {
    console.log("ADD OFFER RUN")
    const name = req.body.name
    const ageStart = req.body.ageStart
    const ageEnd = req.body.ageEnd
    const price = req.body.price

    console.log(req.body)
    
    if (!name || !ageStart || !ageEnd || !price) {
        return res.status(400).send({message: "Gerekli bilgiler eksik!"})
    }

    const sqlStr = `INSERT INTO Offer 
                    (age_start, age_end, price, company_id) 
                    VALUES
                    (${ageStart}, ${ageEnd}, ${price}, 
                                                        (SELECT id
                                                        FROM Companies
                                                        WHERE company_name = '${name}' LIMIT 1))`
    db.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).send({message: "Bir hata oldu"})
        }

        // @ts-ignore
        if (result.affectedRows == 1) {
            console.log(result)
            return res.send({message: "Teklif basarili bir sekilde eklendi"})
        }
        
        else {
            return res.status(400).send({message: "Bir hata oldu"})
        }

    })                                                        
}