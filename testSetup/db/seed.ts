import User from '../../src/models/User';
import testAdmin from './admin';

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
    const newUser = new User(testAdmin);
    return newUser.save();
  } catch (error) {
    return error.message;
  }
}

const seed = async () => {
  try {
    await cleanDb();

    await createAdmin();
    return console.log('DB has been seeded');
  } catch (error) {
    console.log(error);
  }
};

export default seed;
