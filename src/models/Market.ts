import mongoose, { Schema } from 'mongoose';

import { ICordinates } from './Cordinates';

export interface IMarket extends mongoose.Document {
  name: String;
  description: String;
  foodCategory: String;
  images: Array<String>;
  address: String;
  cordinates: ICordinates;
}

const MarketSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  foodCategory: { type: String, required: true },
  address: { type: String, required: true },
  images: { type: [String], required: true },
  cordinates: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cordinates',
  },
});

export default mongoose.model<IMarket>('Market', MarketSchema);
