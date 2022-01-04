import {Request, Response} from 'express'
import db from '../db/db'
import { queries } from '../db/queryTemplates'
import requestValidators from '../validators/requestValidators';

export default async function dropCompanyDiscounts(req: Request, res: Response) {
    const id = <number> Number.parseInt(<string> req.params.id)
    const formattedQuery = queries.dropCompanyDiscounts(id)

    db.query(formattedQuery, (err, result) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }
        // @ts-ignore
        if (result.affectedRows > 0) {
            return res.send({message: "Basariyla silindi"})
        }
        return res.send(result)
    })
}