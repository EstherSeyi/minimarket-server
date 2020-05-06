import { Request, Response } from 'express';
import httpStatus from 'http-status';

import sendResponse from '../utils/response';
import Market from '../models/Market';
import {
  marketSchema,
  latlngSchema,
  updateSchema,
  categorySchema,
  updateNameSchema,
  deleteMarketsSchema,
} from '../validation/market';

const market = {
  //CREATE MARKET CONTROLLER
  create: async (req: Request, res: Response) => {
    const { value, error } = marketSchema.validate(req.body);

    if (error) {
      res.status(httpStatus.BAD_REQUEST).send(
        sendResponse({
          message: 'Please provide valid login credentials',
          error,
        }),
      );
      return;
    }

    try {
      //check if market already exists
      if (await Market.findOne({ name: value.name })) {
        res.status(httpStatus.BAD_REQUEST).send(
          sendResponse({
            message: 'market name already exists!',
          }),
        );

        return;
      }

      const { latlng, ...rest } = value;

      const address = await Market.reverseCordinates(latlng);

      const marketData = {
        address,
        ...rest,
      };

      //Create market
      const market = new Market(marketData);

      //Get and save cordinates
      market.cordinates = await market.getCordinates();

      //Save market
      const newMarket = await market.save();

      //send response
      res.status(httpStatus.OK).send(
        sendResponse({
          message: 'success',
          payload: newMarket,
        }),
      );
      return;
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
        sendResponse({
          message: 'Market creation failed!',
          error,
        }),
      );
      return;
    }
  },

  //GET MARKET BY REVERSE GEOCODING CONTROLLER

  getByReverseGeocoding: async (req: Request, res: Response) => {
    const { value, error } = latlngSchema.validate(req.query);

    if (error) {
      res.status(httpStatus.BAD_REQUEST).send(
        sendResponse({
          message: 'provide valid latlng string',
          error,
        }),
      );
      return;
    }

    try {
      //Latlng string from map
      const { latlng } = value;

      //get address
      const address = await Market.reverseCordinates(latlng);

      //send response
      res.status(httpStatus.OK).send(
        sendResponse({
          message: 'success',
          payload: { address },
        }),
      );
      return;
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
        sendResponse({
          message: 'Reverse Geocoding failed',
          error,
        }),
      );
      return;
    }
  },

  //GET ALL MARKETS CONTROLLER
  getAll: async (_req: Request, res: Response) => {
    try {
      const markets = await Market.find().select({ __v: 0 });

      res.status(httpStatus.OK).json(
        sendResponse({
          message: 'success',
          payload: markets,
        }),
      );
      return;
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
        sendResponse({
          message: 'Reverse Geocoding failed',
          error,
        }),
      );
      return;
    }
  },

  //GET MARKET BY CATEGORY CONTROLLER

  getByCategory: async (req: Request, res: Response) => {
    const { value, error } = categorySchema.validate(req.query);

    if (error) {
      res.status(httpStatus.BAD_REQUEST).send(
        sendResponse({
          message: 'provide valid category',
          error,
        }),
      );
      return;
    }

    const { category } = value;

    try {
      const markets = await Market.find({ foodCategory: category });

      res.status(httpStatus.OK).send(
        sendResponse({
          message: 'success',
          payload: markets,
        }),
      );
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
        sendResponse({
          message: 'could not fetch category',
          error,
        }),
      );
      return;
    }
  },

  //DELETE MARKET CONTROLLER
  deleteMarkets: async (req: Request, res: Response) => {
    const { value, error } = deleteMarketsSchema.validate(req.body);

    if (error) {
      res.status(httpStatus.BAD_REQUEST).send(
        sendResponse({
          message: 'provide valid market ids',
          error,
        }),
      );
      return;
    }

    const { markets } = value;

    try {
      const result = await Market.deleteMany({
        _id: {
          $in: [...markets],
        },
      });

      res.status(httpStatus.OK).send(
        sendResponse({
          message: 'success',
          payload: result,
        }),
      );

      return;
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
        sendResponse({
          message: 'unsuccessfull delete',
          error,
        }),
      );
      return;
    }
  },

  //UPDATE MARKET CONTROLLER
  updateMarket: async (req: Request, res: Response) => {
    const { value, error } = updateSchema.validate(req.body);

    if (error) {
      res.status(httpStatus.BAD_REQUEST).send(
        sendResponse({
          message: 'provide valid details',
          error,
        }),
      );
      return;
    }

    const { name, id, ...details } = value;

    try {
      const market = await Market.findOneAndUpdate({ _id: id }, details, {
        new: true,
      });

      res.status(httpStatus.OK).send(
        sendResponse({
          message: 'success',
          payload: market,
        }),
      );
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
        sendResponse({
          message: 'could not update market',
          error,
        }),
      );
      return;
    }
  },

  //GET NEAREST MARKET CONTROLLER

  getNearestMarket: async (req: Request, res: Response) => {
    const { market } = req.body;

    try {
      let cordinates;

      if (typeof market === 'string') {
        cordinates = await Market.getAddressCordinates(market);
      } else {
        cordinates = market;
      }

      const nearest = await Market.computeNearestMarket(cordinates);

      res.status(httpStatus.OK).send(
        sendResponse({
          message: 'success',
          payload: nearest,
        }),
      );
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
        sendResponse({
          message: 'could not compute nearest market',
          error,
        }),
      );
      return;
    }
  },

  //UPDATE MARKET NAME CONTROLLER

  updateMarketName: async (req: Request, res: Response) => {
    const { value, error } = updateNameSchema.validate(req.body);

    if (error) {
      res.status(httpStatus.BAD_REQUEST).send(
        sendResponse({
          message: 'provide valid names',
          error,
        }),
      );
      return;
    }

    const { newName, oldName } = value;

    //check if market already exists

    try {
      if (await Market.findOne({ name: newName })) {
        res.status(httpStatus.BAD_REQUEST).send(
          sendResponse({
            message: 'market name already exists!',
          }),
        );

        return;
      }

      const theMarket = await Market.findOneAndUpdate(
        { name: oldName },
        { name: newName },
        {
          new: true,
        },
      );

      res.status(httpStatus.OK).send(
        sendResponse({
          message: 'success',
          payload: theMarket,
        }),
      );
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
        sendResponse({
          message: 'could not update market name',
          error: error.message,
        }),
      );
      return;
    }
  },
};

export default market;
