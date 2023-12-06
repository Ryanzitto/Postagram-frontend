import Picture from "../models/Picture.js";

const createPictureService = (picture) => {
  console.log(picture);
  return Picture.create(picture);
};

export { createPictureService };
