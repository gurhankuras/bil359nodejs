
import {Request, Response} from 'express'
import db from '../db/db'
import  { queries } from '../db/queryTemplates'
import { processHospital } from '../db/util'
import requestValidators from '../validators/requestValidators';
const halson = require('halson')

export default async function getHospital(req: Request, res: Response) {
    const {error, value} = requestValidators.id.validate(req.params);
    if (error) {
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }

    const id = Number.parseInt(req.params.id) 

    const formattedQuery = queries.getHospitalById(id);

    db.query(formattedQuery, (err, hospitals) => {
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
        
        let relProcessedHospital = halson(processedHospital)
        .addLink('self', '/joyent/node')
        .addLink('author', {
            href: '/joyent',
            title: 'Joyent'
        });
        
    
        //console.log(offer)
        return res.send(relProcessedHospital)
    })

}

