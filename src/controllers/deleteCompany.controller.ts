import {Request, Response} from 'express'
import db from '../db/db'
import { queries } from '../db/queryTemplates'
import requestValidators from '../validators/requestValidators';



export default async function deleteCompany (req: Request, res: Response) {
    const {error, value} = requestValidators.id.validate(req.params);

    if (error) {
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }
    
    const id = Number.parseInt(req.params.id);

    const formattedQuery = queries.deleteCompanyById(id)

    db.query(formattedQuery, (err, result) => {
        if (err) {
            return res.sendStatus(400)
        }

        // @ts-ignore
        if (result.affectedRows == 1) {
            return res.send({message: "Silme islemi basarili"})
        }
        else {
            return res.sendStatus(400)
        }

    })
}