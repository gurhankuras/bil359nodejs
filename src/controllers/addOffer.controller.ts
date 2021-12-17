

import {Request, Response} from 'express'
import db from '../db/db'
import {queries} from '../db/queryTemplates'
import requestValidators from '../validators/requestValidators'

export default async function addOffer(req: Request, res: Response) {
    console.log("ADD OFFER RUN")

    const {error, value} = requestValidators.addOffer.validate(req.body);

    if (error) {
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }

    const name = <string> req.body.name
    const ageStart = <number> req.body.ageStart
    const ageEnd = <number> req.body.ageEnd
    const price = <number> req.body.price

    console.log(req.body)
    
    const formattedQuery = queries.addOffer({companyName: name, ageStart, ageEnd, price})                                               

    console.log(formattedQuery)
    
    db.query(formattedQuery, (err, result) => {
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

