
import express from 'express'
import {Request, Response} from 'express'
import mongoose from 'mongoose'

require('dotenv').config()
import Company from './db_model/company.dbmodel';
import Hospital from './db_model/hospital.dbmodel';
import { ObjectID, ObjectId } from 'bson';
import Offer from './db_model/offer.dbmodel';
import appFaker from './utility/AppFaker';

// TODO: Refactor
const app = express()
const port = process.env.PORT || 3000
const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.zxrfs.mongodb.net/saglik_sigorta?retryWrites=true&w=majority`;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


mongoose.connect(MONGODB_URL, {})

mongoose.connection.on("connected", () => {
    console.log('Mongoose is connected')
})

// TEST
app.get('/api/companies/:id/hospitals', async (req: Request, res: Response) => {
    const id = req.params.id;
    const name = req.query.name;
      // @ts-ignore
    const page = Number.parseInt(req.query.page || "1");
    const ITEM_COUNT_PER_PAGE = 6

    console.log(`hospıtals GET! ${page}`)
    // TODO: find hospitals by id
    let filter = {}
    if (name != null) {
        // @ts-ignore
        filter.name = name
    }

    // @ts-ignore
    filter.companies = new ObjectId(id)
    
    let fetchedHospitals = await Hospital.find(filter).skip((page - 1) * ITEM_COUNT_PER_PAGE).limit(ITEM_COUNT_PER_PAGE)
    return res.send(fetchedHospitals)
})

/*
// TEST
app.post('/api/companies/:id/offer', async (req: Request, res: Response) => {
    console.log(req.body)
    const age = Number.parseInt(req.body.age);
    const hospitalName = req.body.hospitalName;

   let offer = await Offer.findOne({ageStart: {$lte: age}, ageEnd: {$gte: age}, "hospital.name": hospitalName })
   
   if (offer == null) {
       return res.sendStatus(404);
   }
   console.log(offer)
    return res.send(offer)
})
*/

// TEST
/*
app.get('/api/companies', async (req: Request, res: Response) => {
    const name = req.query.name;
    // @ts-ignore
    const page = Number.parseInt(req.query.page || "1");
    const ITEM_COUNT_PER_PAGE = 6

    console.log(`COMPANIES GET PAGE: ${page}`)

    let filter = {}
    if (name != null) {
        // @ts-ignore
        filter.name = name
    }
        let companies = await Company.find(filter).skip((page - 1) * ITEM_COUNT_PER_PAGE).limit(ITEM_COUNT_PER_PAGE)
        return res.send(companies)
   
})
*/

app.delete('/api/deneme', async (req: Request, res: Response) => {
    return res.send({message: "Basarili oldu hahahahaha"});
})



/*
app.post('/api/companies/:id/offer/new', async (req: Request, res: Response) => {
    const offer = appFaker.offer()
   console.log(offer)
    try {
        await Offer.create(offer);
        return res.send(offer);
    }
    catch(err) {
        console.log(err)
        return res.sendStatus(400);
    }
   res.send("sadasdas")
    
})
*/ 

/*
app.get('/api/new', async (req: Request, res: Response) => {


    let a = appFaker.offer(0, 10)
    let b = appFaker.offer(11, 16)
    let c = appFaker.offer(17, 25)
    let d = appFaker.offer(26, 30)
    let e = appFaker.offer(31, 40)
    let f = appFaker.offer(41, 45)
    let g = appFaker.offer(46, 50)
    let h = appFaker.offer(51, 66)
    let i = appFaker.offer(67, 80)
    let j = appFaker.offer(80, 82)
    await Offer.insertMany([a, b, c, d, e, f, g, h, i, j])
  res.send('Hello World')

})
*/



app.listen(port, () => {
    console.log("server started!")
})
