
import {Request, Response} from 'express'
import db from '../db/db'
import { processHospital } from '../db/util'


export default async function getHospital(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id) 

    if (isNaN(id)) {
        return res.sendStatus(400)
    }

    const queryStr = `SELECT * FROM Hospitals WHERE id = '${id}'`

    db.query(queryStr, (err, hospitals) => {
        if (err) {
            return res.sendStatus(400)
        }
        // @ts-ignore
        if (hospitals.length == 0) {
            return res.sendStatus(400)
        }
    
        // @ts-ignore
        let hospital = hospitals[0]
       
        // offer.hospital = processHospital(hospital)
        
        let processedHospital = processHospital(hospital)
    
        //console.log(offer)
        return res.send(processedHospital)
    })

}

