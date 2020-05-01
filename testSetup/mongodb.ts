import mongoose from 'mongoose';

async function connectMongoDB() {
  await mongoose
    .connect(`${process.env.MONGO_URI_TEST}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .catch((err: any) => {
      console.error(err);
      return;
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
