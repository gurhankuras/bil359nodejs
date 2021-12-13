import mongoose from 'mongoose'
import { ObjectId } from 'mongodb';

export interface HospitalDocument extends mongoose.Document {
  name: string;
  adress: {
    il: string,
    ilce: string,
    mahalle: string,
    sokak: string,
    no: string
  };
  companies: [ObjectId]
  createdAt: Date
  updatedAt: Date
}

const HospitalSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    address: {
      il: {type: String, required: true},
      ilce: {type: String, required: true},
      mahalle: {type: String, required: true},
      sokak: {type: String, required: true},
      no: {type: Number, required: true}
    },

    companies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }]
    

  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model<HospitalDocument>('Hospital', HospitalSchema);
export default Hospital
