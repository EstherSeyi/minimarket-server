import mongoose, { Schema, Model } from 'mongoose';
import { Client, LatLng } from '@googlemaps/google-maps-services-js';

import Cordinates, { ICordinates } from './Cordinates';
import reduced, { getNearestAddress } from '../utils/reduced';

export interface IMarket extends mongoose.Document {
  name: String;
  description: String;
  foodCategory: String;
  images: Array<String>;
  address: String;
  cordinates: ICordinates;
  getCordinates: () => Promise<ICordinates>;
  reverseCordinates: (input: string) => Promise<any>;
}

const MarketSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  foodCategory: {
    type: String,
    required: true,
    enum: [
      'fruits',
      'sea food',
      'general groceries',
      'junk food',
      'meat',
      'staples',
    ],
  },
  address: { type: String, required: true },
  images: { type: [String], required: true },
  cordinates: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cordinates',
  },
});

MarketSchema.methods = {
  getCordinates: async function () {
    const address = this.address;
    const client = new Client();

    const res = await client.geocode({
      params: {
        key: `${process.env.GOOGLE_API_KEY}`,
        address: `${address}`,
      },
    });

    const cordinates = new Cordinates({
      longitute: res.data.results[0].geometry.location.lng,
      latitude: res.data.results[0].geometry.location.lat,
    });

    return await cordinates.save();
  },
};
MarketSchema.statics = {
  /**========================
   * REVERSE CORDINATES METHOD
   * ==========================*/

  reverseCordinates: async function (input: string) {
    const client = new Client();

    const res = await client.reverseGeocode({
      params: {
        key: `${process.env.GOOGLE_API_KEY}`,
        latlng: input,
      },
    });

    return res.data.results[0].formatted_address;
  },

  /**========================
   * COMPUT NEAREST MARKET METHOD
   * ==========================*/

  computeNearestMarket: async function (origin: LatLng) {
    const client = new Client();

    const markets = await this.find({});

    const marketAddresses: LatLng[] = markets.map(async (market: IMarket) => {
      const cordinates = await Cordinates.findOne({ _id: market.cordinates });

      return {
        lat: parseFloat(cordinates!.latitude),
        lng: parseFloat(cordinates!.longitute),
      };
    });

    const destinations = await Promise.all(marketAddresses);
    const response = await client.distancematrix({
      params: {
        key: `${process.env.GOOGLE_API_KEY}`,
        origins: [origin],
        destinations: destinations,
      },
    });

    const reducedToObject = reduced(
      response.data.destination_addresses,
      response.data.rows[0].elements,
    );

    const nearestAddress = getNearestAddress(reducedToObject);

    return nearestAddress;
  },

  /**========================
   * GET CORDINATES FROM ADDRESS METHOD
   * ==========================*/

  getAddressCordinates: async function (address: string) {
    const client = new Client();

    const res = await client.geocode({
      params: {
        key: `${process.env.GOOGLE_API_KEY}`,
        address: `${address}`,
      },
    });

    const cordinates = new Cordinates({
      longitute: res.data.results[0].geometry.location.lng,
      latitude: res.data.results[0].geometry.location.lat,
    });

    return {
      lat: parseFloat(cordinates.latitude),
      lng: parseFloat(cordinates.longitute),
    };
  },
};

export interface IMarketModel extends Model<IMarket> {
  reverseCordinates: (input: string) => Promise<string>;
  computeNearestMarket: (
    origin: LatLng,
  ) => Promise<{ minDist: string; minVal: number }>;
  getAddressCordinates: (address: string) => Promise<LatLng>;
}

export default mongoose.model<IMarket, IMarketModel>('Market', MarketSchema);
