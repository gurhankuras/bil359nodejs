import {Request, Response} from 'express'
import { omit } from 'lodash';
import db from '../db/db'
import { queries } from '../db/queryTemplates';
import { processHospital } from '../db/util';
import offset from '../utility/db_skip';


export async function getCompanyHospitals(req: Request, res: Response)  {
    // @ts-ignore
   const id = Number.parseInt(req.params.id);
   if (isNaN(id)) {
       return res.sendStatus(400)
   }
   console.log(id)
  
   let name = req.query.name;
   let typedName: string | null

   typedName = !name ? null : <string> name;
   

     // @ts-ignore
   const page = Number.parseInt(req.query.page || "1");
   const ITEM_COUNT_PER_PAGE = 2

   console.log(`hospıtals GET! ${page}`)


   const skip = offset(page, ITEM_COUNT_PER_PAGE)
   const formattedQuery = queries.getHospitalsByCompany({companyId: <number> id, hospitalName: typedName, limit: ITEM_COUNT_PER_PAGE, offset: skip})

   console.log(formattedQuery)
   db.query(formattedQuery, (err, result) => {
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