import { ObjectId } from 'mongodb';
import mongoose from "mongoose";


export interface OfferDocument extends mongoose.Document {
  ageStart: number;
  _id: ObjectId;
  ageEnd: number;
  amount: number;
  company: {name: string, image: string};
  hospital: {
    name: string;
      address: {
        il: string;
        ilce: string;
        mahalle: string;
        sokak: string;
        no: number;
      }
  };
  createdAt: Date
  updatedAt: Date
}


const OfferSchema = new mongoose.Schema(
  {
    ageStart: {
        type: Number,
        required: true,
    },
    ageEnd: {
        type: Number,
        required: true
    },
    amount: {
      type: Number,
      required: true,
    },
    company: {name: String, image: String, _id: String},
    hospital: {
      _id: String,
      name: String,
      address: {
        il: String,
        ilce: String,
        mahalle: String,
        sokak: String,
        no: Number
      }
    }

    // company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
    // hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model<OfferDocument>('Offer', OfferSchema);
export default Offer;
