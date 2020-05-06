import mongoose from 'mongoose';

async function connectMongoDB(dbname: string) {
  await mongoose
    .connect(`${process.env.MONGO_URI_TEST}/${dbname}`, {
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

  await mongoose.connection.close();

  // await db.close();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
