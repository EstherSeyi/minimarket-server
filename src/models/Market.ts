import mongoose, { Schema, Model } from 'mongoose';
import {
  Client,
  LatLng,
  DistanceMatrixResponse,
} from '@googlemaps/google-maps-services-js';

import Cordinates, { ICordinates } from './Cordinates';
// import { Origin } from '../types/index';

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
  foodCategory: { type: String, required: true },
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

    interface ClosestDistance {
      distance: { value: number };
      duration: {};
      status: string;
      index: number;
    }
    // const allAddress = response.data.destination_addresses;
    const distances = response.data.rows[0].elements;

    console.log('DISTANCES', distances);

    const closestMarket = distances.reduce<ClosestDistance>(
      (total, item, index) => {
        console.log(total);
        let closest = total;
        if (closest.distance) {
          if (item.distance.value < closest.distance.value) {
            closest = { ...item, index };
          }
        }

        return closest;
      },
      <ClosestDistance>{},
    );

    console.log(response.data, 'RESPONSE');
    console.log(response.data.rows[0].elements, 'ELEMENTS');

    console.log(closestMarket, 'MARKET');

    const distancesOfAllMarkets = response.data.rows[0].elements.map((item) => {
      return item.distance.value;
    });

    return Math.min(...distancesOfAllMarkets);
  },

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
  computeNearestMarket: (origin: LatLng) => Promise<DistanceMatrixResponse>;
  getAddressCordinates: (address: string) => Promise<LatLng>;
}

export default mongoose.model<IMarket, IMarketModel>('Market', MarketSchema);
