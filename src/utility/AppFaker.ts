

import { ObjectId } from 'bson'
import faker, { fake } from 'faker'
import { add } from 'lodash'



const mockHospital = {
    "_id": new ObjectId("61adc1c75d96e533487f80f7"),
    "name": "Adnan Hastanesi",
    "address": {
        "il": "Istanbul",
        "ilce": "Kartal",
        "mahalle": "A Mahallesi",
        "sokak": "B Sokak",
        "no": 23
    },
    "companies": [
        new ObjectId("61a76e94f399ce76cdd1e380")
    ],
}

const mockCompany = {
    "_id": new ObjectId("61adc2675d96e533487f80f8"),
    "name": "Axa sigorta",
    "image": "sadasdas",
    "hospitals": [
        new ObjectId("61a76e93f399ce76cdd1e37e")
    ],
}

class AppFaker {
    
    constructor() {

    }

    
    address() {
        const address = {
            il: faker.address.cityName(),
            ilce: faker.name.lastName(),
            sokak: faker.address.streetName(),
            mahalle: faker.address.secondaryAddress(),
            no: Math.floor(Math.random() * 50)
        }
        return address
    }

    ageGroup() {
        const ageStart = Math.floor(Math.random() * 10)
        const ageEnd = Math.floor(Math.random() * 70) + 10
        return {ageStart, ageEnd}
    }

    company() {
        const image = faker.image.business()
        const name = faker.finance.accountName()
        const id =  new ObjectId()
        return {image: image, name: name, "_id": id}
    }

    hospital() {
        const name = `${faker.finance.accountName()} Hastanesi`
        const address = this.address()
        const id =  new ObjectId()
        return {name: name, address: address, "_id": id}
    }

    amount() {
        const amount = Math.floor(Math.random() * 1000) + 100
        return amount
    }

    now() {
        return new Date();
    }

    offer(startAge: number, endAge: number) {
        let defaultAgeGroup = this.ageGroup();
        let ageStart = startAge || defaultAgeGroup.ageStart
        let ageEnd = endAge || defaultAgeGroup.ageEnd

        return {
            _id: new ObjectId(),
            //hospital: this.hospital(),
            //company: this.company(),
            hospital: mockHospital,
            company: mockCompany,
            ageStart: ageStart,
            ageEnd: ageEnd,
            amount: this.amount(),
            createdAt: this.now(),
            updatedAt: this.now()
        }
    }

}

const appFaker = new AppFaker()
export default appFaker