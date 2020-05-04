import mongoose, { Schema } from 'mongoose';

export interface ICordinates extends mongoose.Document {
  longitute: string;
  latitude: string;
}

const CordinatesSchema: Schema = new Schema({
  longitute: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ICordinates>('Cordinates', CordinatesSchema);
