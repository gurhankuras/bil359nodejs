import {Request, Response} from 'express'
import db from '../db/db'


export default async function createCompany (req: Request, res: Response) {
    const name = req.body.name
    if (name == null) {
        return res.sendStatus(400)
    }

    db.query(`INSERT INTO Companies (company_name, image) VALUES ('${name}', '')`, (err, result) => {
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