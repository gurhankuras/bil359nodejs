import {Request, Response} from 'express'
import db from '../db/db'


export default async function getCompanyOffers (req: Request, res: Response) {
    const queryStr = `SELECT * 
                        FROM Offer 
                        JOIN Companies
                        ON Offer.company_id = Companies.id`

    db.query(queryStr, (err, result) => {
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