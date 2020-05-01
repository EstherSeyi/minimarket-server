import mongoose from 'mongoose';

async function connectMongoDB() {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  await mongoose
    .connect(`${process.env.MONGO_URI_TEST}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .catch((err: any) => {
      console.error(err);

      process.exit(1);
    });
  console.log('Connected to testDB');
}

async function disconnectMongoDB() {
  await mongoose.connection.db.dropDatabase();

  mongoose.connection.close();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
