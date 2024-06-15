import mongoose from 'mongoose';
const mongoURI = "mongodb://localhost:27017";

const connectToMongo = () =>{
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => console.error('Error connecting to MongoDB:', error));
    // mongoose.connect(mongoURI, ()=>{
    //     console.log("Connected to Mongo Successfully");
    // });
}

  

export default connectToMongo;