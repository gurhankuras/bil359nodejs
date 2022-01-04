import {Request, Response} from 'express'
import db from '../db/db'
import  { queries } from '../db/queryTemplates'
import { processHospital } from '../db/util'
import requestValidators from '../validators/requestValidators';
const halson = require('halson')

export default async function getOffer(req: Request, res: Response) {
    const ageStart = <number> Number.parseInt(<string> req.body.ageStart)
    const ageEnd = <number> Number.parseInt(<string> req.body.ageEnd)
    const companyName = <string> req.body.companyName
    /*
    const {error, value} = requestValidators.id.validate(req.params);
    if (error) {
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }

    */

    const formattedQuery = queries.getOffer({companyName, ageStart, ageEnd});

    db.query(formattedQuery, (err, offers) => {
        if (err) {
            return res.sendStatus(400)
        }
        // @ts-ignore
        if (offers.length == 0) {
            return res.sendStatus(400)
        }
    
        // @ts-ignore
        let offer = offers[0]
       
        // offer.hospital = processHospital(hospital)
        
        if (offer['previous_value']) {
            offer['previous_value'] = Number.parseFloat(offer['previous_value'])
        }

        if (offer['price']) {
            offer['price'] = Number.parseFloat(offer['price'])
        }
        
        let relProcessedOffer = halson(offer)
        .addLink('self', '/joyent/node')
        .addLink('author', {
            href: '/joyent',
            title: 'Joyent'
        });
        
    
        //console.log(offer)
        return res.send(relProcessedOffer)
    })

}