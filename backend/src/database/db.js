import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(
      "mongodb+srv://ryanhardflip:3RuDrjP94ropX9MC@cluster0.qk1sejc.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("MongoDB Atlas connected"))
    .catch((error) => console.log(error));
};
