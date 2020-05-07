import User from '../models/User';
import Market from '../models/Market';
import user from './admin';
import markets from './markets';

const cleanDb = async () => {
  try {
    await User.deleteMany({});
    return console.log('succesfully cleared db');
  } catch (err) {
    console.log('Error: occured', err);
    return err;
  }
};

export async function createAdmin() {
  try {
    const newUser = new User(user);
    return newUser.save();
  } catch (error) {
    return error.message;
  }
}

export const seedMarkets = async () => {
  try {
    // console.log(markets, 'Markets');

    const allMarkets = markets.map(async (market) => {
      if (await Market.findOne({ name: market.name })) {
        return;
      }

      const { latlng, ...rest } = market;

      const address = await Market.reverseCordinates(latlng);

      const marketData = {
        address,
        ...rest,
      };

      //Create market
      const newMarket = new Market(marketData);

      //Get and save cordinates
      newMarket.cordinates = await newMarket.getCordinates();

      //Save market
      return await newMarket.save();
    });
    const res = await Promise.all(allMarkets);

    return res;
  } catch (err) {
    return err;
  }
};

const seed = async () => {
  try {
    await cleanDb();

    await createAdmin();
    const markets = await seedMarkets();
    return console.log(`DB has been seeded with ${markets.length} markets`);
  } catch (error) {
    console.log(error);
  }
};

export default seed;
