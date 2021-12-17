import {Request, Response} from 'express'
import { omit } from 'lodash';
import db from '../db/db'
import { queries } from '../db/queryTemplates';
import { processHospital } from '../db/util';
import requestValidators from '../validators/requestValidators';


export default async function getOffersByAgeAndHospitalName(req: Request, res: Response) {

    const {error, value} = requestValidators.getOffersByAgeAndHospitalName.validate(req.body);
    if (error) {
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }

    console.log(req.body)
    const age = Number.parseInt(req.body.age);
    const hospitalName = <string> req.body.hospitalName;
    
    const formattedQuery = queries.getOffersByAgeAndHospitalName({age, hospitalName})

    console.log(formattedQuery)
    db.query(formattedQuery, (err, result) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }

        // @ts-ignore
        if (result.length == 0) {
            console.log("buraya gırdı ")
            return res.status(400).send({message: "Teklif Bulunamadi!"})
        }

        // @ts-ignore
        const final = result.map((rawOffer) => {
            let processedOffer = {...rawOffer, price: Number.parseFloat(rawOffer.price)}
            console.log(rawOffer)

            let company = {company_name: processedOffer.company_name, id: processedOffer.company_id, image: processedOffer.image}
            let offer = omit(processedOffer, ['company_id','company_name', 'image'])
            offer.company = company
            return offer
        })
        
        return res.send(final)
    
        
    })
}