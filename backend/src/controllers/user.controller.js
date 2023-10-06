const userService = require("../services/user.service");
const mongoose = require("mongoose");

const create = async (req, res) => {
  const { name, userName, email, password, avatar } = req.body;

  if (!name || !userName || !email || !password || !avatar) {
    res.status(400).send({ message: "Submit all fields for registration" });
  }

  const user = await userService.createService(req.body);

  if (!user) {
    return res.status(400).send({ message: "Error creating user" });
  }

  res.status(201).send({
    message: "User created successfully",
    user: {
      id: user._id,
      name,
      userName,
      email,
      avatar,
    },
  });
};

const findAll = async (req, res) => {
  const users = await userService.findAllService();

  if (users.length === 0) {
    return res.status(400).send({ message: "there is no registred users" });
  }
  res.send(users);
};

const findById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "invalid ID" });
  }

  const user = await userService.findByIdService(id);

  if (!user) {
    return res.status(400).send({ message: "user not found" });
  }

  res.send(user);
};

module.exports = { create, findAll, findById };
