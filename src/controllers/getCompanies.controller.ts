import {Request, Response} from 'express'
import db from '../db/db'
import { queries } from '../db/queryTemplates';
import offset from '../utility/db_skip';
import requestValidators from '../validators/requestValidators';


export default async function getCompanies(req: Request, res: Response) {

    const {error, value} = requestValidators.getCompanies.validate(req.query);

    if (error) {
        console.log(error)
        return res.status(422).send({message: "Gerekli bilgiler eksik ya da yanlış"});
    }

    const name = <string> req.query.name;
    const page = <string> (req.query.page || "1")
    const pageNumber = Number.parseInt(page);
    const ITEM_COUNT_PER_PAGE = 5

    const skip = offset(pageNumber, ITEM_COUNT_PER_PAGE)

    console.log(`COMPANIES GET PAGE: ${pageNumber}`)

    const queryString = name != null ? 
        queries.getCompaniesByNamePaginated({name: <string> name, limit: ITEM_COUNT_PER_PAGE, offset: skip}) 
        : queries.getCompaniesPaginated({limit: ITEM_COUNT_PER_PAGE, offset: skip})

    db.query(queryString, (err, results) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400)
        }
        console.log(results)
        return res.send(results)
    })
}