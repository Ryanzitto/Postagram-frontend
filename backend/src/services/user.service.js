const User = require("../models/User");

const createService = (body) => User.create(body);

const findAllService = () => User.find();

const findByIdService = (id) => User.findById(id);

const updateService = (id, name, userName, email, password, avatar) =>
  User.findOneAndUpdate(
    { _id: id },
    { name, userName, email, password, avatar }
  );

module.exports = {
  createService,
  findAllService,
  findByIdService,
  updateService,
};
