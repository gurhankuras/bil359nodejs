import {Request, Response} from 'express'
import db from '../db/db'
import  { queries } from '../db/queryTemplates'


export default async function getCompanyOffers (req: Request, res: Response) {
    const formattedQuery = queries.getAllCompanyOffers()

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
                // @ts-ignore
            endResult[row.id].ageOffers.push({
                age_start: row.age_start, 
                age_end: row.age_end, 
                price: Number.parseFloat(row.price)
            })
        })
        return res.send(endResult)
    })
}