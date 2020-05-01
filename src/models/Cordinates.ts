import mongoose, { Schema } from 'mongoose';

export interface ICordinates extends mongoose.Document {
  longitute: String;
  latitude: String;
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
