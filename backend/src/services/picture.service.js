import Picture from "../models/Picture.js";

const createPictureService = (picture) => Picture.create(picture);

const getPictureByIdService = (id) => Picture.findById({ _id: id });

const removePictureService = (id) => Picture.findOneAndRemove({ _id: id });

const updatePictureService = (id, picture) =>
  Picture.findOneAndUpdate(
    { _id: id },
    { $set: { src: picture.src } },
    { new: true }
  );

export {
  createPictureService,
  getPictureByIdService,
  removePictureService,
  updatePictureService,
};
