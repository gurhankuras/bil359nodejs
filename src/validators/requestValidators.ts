import Joi from "joi";

const addOffer = Joi.object({
    ageStart: Joi.number()
                .integer()
                .min(0)
                .required(),
    ageEnd: Joi.number()
                .integer()
                .min(0)
                .required(),
    price: Joi.number()
                .min(0)
                .required(),
    name: Joi.string()
            .required()    
})

const addHospital = Joi.object({
    companyIds: Joi.array().items(Joi.number().integer()).required(),
    hospitalName: Joi.string().required()
})

const createCompany = Joi.object({
    name: Joi.string().required()
})


const id = Joi.object({
    id: Joi.number().integer().required()
})


const getCompanies = Joi.object({
    page: Joi.number().integer().optional(),
    name: Joi.string().optional()
})

const getOffersByAgeAndHospitalName = Joi.object({
    age: Joi.number().integer().required().min(0),
    hospitalName: Joi.string().required()
})

 const requestValidators = {
    addOffer: addOffer,
    addHospital: addHospital,
    createCompany: createCompany,
    id: id,
    getCompanies: getCompanies,
    getOffersByAgeAndHospitalName: getOffersByAgeAndHospitalName
    
}

export default requestValidators