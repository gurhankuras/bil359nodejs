

import {Request, Response} from 'express'
import db from '../db/db'
import {queries} from '../db/queryTemplates'
import requestValidators from '../validators/requestValidators'

export default async function addDiscount(req: Request, res: Response) {
    console.log("ADD DISCOUNT RUN")

    /*
    const {error, value} = requestValidators.addOffer.validate(req.body);

    if (error) {
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }
    */

    const id = <number> req.body.id
    const currentPrice = <number> req.body.currentPrice
    const discountedPrice = <number> req.body.discountedPrice

    console.log(req.body)
    
    const formattedQuery = queries.addDiscount({currentPrice, discountedPrice, id})                                               

    console.log(formattedQuery)
    
    db.query(formattedQuery, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).send({message: "Bir hata oldu"})
        }

        // @ts-ignore
        if (result.affectedRows == 1) {
            console.log(result)
            return res.send({message: "Indirim basarili bir sekilde islendi"})
        }
        
        else {
            return res.status(400).send({message: "Bir hata oldu"})
        }

    })                                                        
}

