import {Request, Response} from 'express'
import db from '../db/db'
import offset from '../utility/db_skip';


export default async function getCompanies(req: Request, res: Response) {
    const name = req.query.name;
    // @ts-ignore
    const page = Number.parseInt(req.query.page || "1");
    const ITEM_COUNT_PER_PAGE = 5

    const skip = offset(page, ITEM_COUNT_PER_PAGE)

    const queryStringAll = `SELECT * 
    FROM Companies
    ORDER BY company_name 
    LIMIT ${ITEM_COUNT_PER_PAGE}
    OFFSET ${skip}`

    const queryStringName = `SELECT * 
    FROM Companies WHERE company_name = '${name}'
    ORDER BY company_name 
    LIMIT ${ITEM_COUNT_PER_PAGE}
    OFFSET ${skip}`

    console.log(`COMPANIES GET PAGE: ${page}`)

    const queryString = name != null ? queryStringName : queryStringAll

    db.query(queryString, (err, results) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }
        console.log(results)
        return res.send(results)
    })
}