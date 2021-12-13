import { ObjectId } from 'mongodb';
// const mongoose =  require('mongoose');
import mongoose from "mongoose";
//import { ObjectId } from 'mongodb';


export interface CompanyDocument extends mongoose.Document {
  name: string;
  image: string;
  hospitals: [ObjectId];
  offers: [
    {
      ageStart: number;
      ageEnd: number;
      amount: number;
    }
  ]
  createdAt: Date
  updatedAt: Date
}


const CompanySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    image: {
      type: String,
      required: true,
    },
    hospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }],
    offers: [{
      ageStart: Number,
      ageEnd: Number,
      amount: Number
    }]
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model<CompanyDocument>('Company', CompanySchema);
export default Company;