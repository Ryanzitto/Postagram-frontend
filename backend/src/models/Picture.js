import mongoose from "mongoose";

const PictureSchema = new mongoose.Schema({
  name: { type: String, require: true },
  src: { type: String, require: true },
});

const Picture = mongoose.model("Picture", PictureSchema);

export default Picture;
