import User from "../models/User.js";

const createService = (body) => User.create(body);

const findAllService = () => User.find().populate("avatar");

const findByIdService = (id) => User.findById(id);

const updateService = (id, newUserData) =>
  User.findOneAndUpdate({ _id: id }, newUserData);

const findByUserNameService = (userName) =>
  User.findOne({ userName: userName }).populate("avatar");

export default {
  createService,
  findAllService,
  findByIdService,
  updateService,
  findByUserNameService,
};
