
import {Request, Response} from 'express'
import db from '../db/db'
import { queries } from '../db/queryTemplates'
import requestValidators from '../validators/requestValidators';

export default async function getCompanyDiscounts(req: Request, res: Response) {
    const formattedQuery = queries.getAllCompanyDiscounts()

    db.query(formattedQuery, (err, result) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }

        const endResult = {}
        // @ts-ignore
        result.map((row) => {
            // @ts-ignore
            row.id = Number.parseInt(row.id)
            // @ts-ignore
            if (!endResult[row.id]) {
                // @ts-ignore
                endResult[row.id] = {
                    company: {
                        id: row.id, 
                        company_name: row.company_name, 
                        image: row.image
                    },
                    ageOffers: []
                }
            }
            let offer = {
                age_start: row.age_start, 
                age_end: row.age_end, 
                price: Number.parseFloat(row.price)
            }

            if (row["previous_value"]) {
                // @ts-ignore
                offer['previous_value'] = Number.parseFloat(row["previous_value"])
            }
                // @ts-ignore 
            endResult[row.id].ageOffers.push(offer)
        })
        return res.send(endResult)
    })              
}