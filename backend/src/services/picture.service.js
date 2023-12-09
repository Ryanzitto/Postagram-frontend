import Picture from "../models/Picture.js";

const createPictureService = (picture) => Picture.create(picture);

const getPictureByIdService = (id) => Picture.findById({ _id: id });

const removePictureService = (id) => Picture.findOneAndRemove({ _id: id });

export { createPictureService, getPictureByIdService, removePictureService };
