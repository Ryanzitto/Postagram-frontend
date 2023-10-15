import User from "../models/User.js";

const createService = (body) => User.create(body);

const findAllService = () => User.find();

const findByIdService = (id) => User.findById(id);

const updateService = (id, name, userName, email, password, avatar, bio) =>
  User.findOneAndUpdate(
    { _id: id },
    { name, userName, email, password, avatar, bio }
  );

const findByUserNameService = (userName) =>
  User.findOne({ userName: userName });

export default {
  createService,
  findAllService,
  findByIdService,
  updateService,
  findByUserNameService,
};
