import Picture from "../models/Picture.js";

const createPictureService = (picture) => Picture.create(picture);

const getPictureByIdService = (id) => Picture.findById(id);

export { createPictureService, getPictureByIdService };
