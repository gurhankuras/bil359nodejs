import {Request, Response} from 'express'
import db from '../db/db'
import { queries } from '../db/queryTemplates'
import requestValidators from '../validators/requestValidators';


export default async function createCompany (req: Request, res: Response) {
    const {error, value} = requestValidators.createCompany.validate(req.body);

    if (error) {
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }
    
    const name = <string> req.body.name
    const formattedQuery = queries.createCompany({companyName: name, image: ""})

    db.query(formattedQuery, (err, result) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }
        // @ts-ignore
        if (result.affectedRows == 1) {
            return res.send({message: "Basariyla eklendi"})
        }
        return res.send(result)
    })
}