require('dotenv').config()

import express, { Request, Response } from 'express'
import db from './db/db'

import deleteCompany from './controllers/deleteCompany.controller'
import getCompanies from './controllers/getCompanies.controller'
import { getCompanyHospitals } from './controllers/getCompanyHospitals.controller'
import deleteHospital from './controllers/deleteHospital.controller'
import createCompany from './controllers/createCompany.controller'
import getCompanyOffers from './controllers/getCompanyOffers.controller'
import addOffer from './controllers/addOffer.controller'
import getHospital from './controllers/getHospital.controller'
import addHospital from './controllers/addHospital.controller'
import getOffersByAgeAndHospitalName from './controllers/getOffersByAgeAndHospitalName'

// TODO: TEST
// TODO: eliminate most of the @ts-ignore comments

const app = express()
const port = process.env.PORT || 3000


db.connect((err) => {
    if (err) {
        console.log(err)
    }
    console.log("database connected!")
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req: Request, res: Response) => { return res.sendStatus(200) })

// offers
app.post('/api/companies/:id/offer', getOffersByAgeAndHospitalName)
app.get('/api/offers', getCompanyOffers)
app.post('/api/offers', addOffer)

// hospitals
app.get('/api/companies/:id/hospitals', getCompanyHospitals)
app.delete('/api/hospitals/:id', deleteHospital)
app.get('/api/hospitals/:id', getHospital)
app.post('/api/hospitals', addHospital)

// companies
app.delete('/api/companies/:id', deleteCompany)
app.get('/api/companies', getCompanies)
app.post('/api/companies', createCompany)

app.listen(port, () => {
    console.log("server started!")
})

