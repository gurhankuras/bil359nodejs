import {Request, Response} from 'express'
import { omit } from 'lodash';
import db from '../db/db'
import { processHospital } from '../db/util';
import offset from '../utility/db_skip';


export async function getCompanyHospitals(req: Request, res: Response)  {
    // @ts-ignore
   const id = Number.parseInt(req.params.id);
   if (isNaN(id)) {
       return res.sendStatus(400)
   }
   console.log(id)
  
   const name = req.query.name;
     // @ts-ignore
   const page = Number.parseInt(req.query.page || "1");
   const ITEM_COUNT_PER_PAGE = 2

   console.log(`hospıtals GET! ${page}`)


   const skip = offset(page, ITEM_COUNT_PER_PAGE)


   const queryString = `SELECT * 
   FROM Hospitals
   WHERE id IN 
   (SELECT hospital_id
   FROM CompanyHospital
   WHERE company_id = ${id})
   ${name != null ? `AND hospital_name='${name}'` : ''}
   ${page != null ? `LIMIT ${ITEM_COUNT_PER_PAGE}
   OFFSET ${skip}` : ''}
   `

   console.log(queryString)
   db.query(queryString, (err, result) => {
       if (err) {
           console.log(err)
           return res.sendStatus(400)
       }
       // @ts-ignore
       let processedHospitals = result.map((hospital) => {
           return processHospital(hospital)
       }) 
       return res.send(processedHospitals)
   });
}