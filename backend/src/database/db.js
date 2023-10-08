import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Atlas connected"))
    .catch((error) => console.log(error));
};
