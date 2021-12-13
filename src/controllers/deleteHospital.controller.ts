import {Request, Response} from 'express'
import db from '../db/db'


export default async function deleteHospital(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id) 

    if (isNaN(id)) {
        return res.sendStatus(400)
    }

    const queryStr = `DELETE FROM Hospitals WHERE id = ${id}`

    db.query(queryStr, (err, result) => {
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