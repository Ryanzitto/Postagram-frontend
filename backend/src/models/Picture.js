import mongoose from "mongoose";

const PictureSchema = new mongoose.Schema({
  src: { type: String, require: true },
});

const Picture = mongoose.model("Picture", PictureSchema);

export default Picture;
