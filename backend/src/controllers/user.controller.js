import userService from "../services/user.service.js";

import {
  createPictureService,
  updatePictureService,
  getPictureByIdService,
} from "../services/picture.service.js";

import Picture from "../models/Picture.js";

import fs from "fs";

const create = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    const file = req.file;

    const picture = new Picture({
      src: file.path,
    });

    if (!name || !userName || !email || !password) {
      res.status(400).send({ message: "Submit all fields for registration" });
    }

    const pictureRef = await createPictureService(picture);

    const user = await userService.createService({
      name: name,
      userName: userName,
      email: email,
      password: password,
      avatar: pictureRef._id,
    });

    res.status(201).send({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findAll = async (req, res) => {
  try {
    const users = await userService.findAllService();

    if (users.length === 0) {
      return res.status(400).send({ message: "there is no registred users" });
    }
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findById = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findByUserName = async (req, res) => {
  try {
    const { userName } = req.params;

    if (!userName) {
      return res.status(400).send({ message: "username is missing" });
    }

    const user = await userService.findByUserNameService(userName);

    if (!user) {
      return res.status(404).send({ message: "userName not found" });
    }

    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, userName, email, password, bio, pictureID } = req.body;

    const file = req.file;

    const id = req.params.id;

    if (!name && !userName && !email && !password && !bio && !file) {
      return res
        .status(400)
        .send({ message: "Submit at least one field for registration" });
    }

    if (file && pictureID) {
      const pictureToRemove = await getPictureByIdService(pictureID);

      fs.unlinkSync(pictureToRemove.src);

      const picture = new Picture({
        src: file.path,
      });

      const updatedPicture = await updatePictureService(pictureID, picture);
    }

    const newUserData = req.body;

    const userUpdated = await userService.updateService(id, newUserData);

    res.status(200).send({ message: "User updated with sucess." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export default { create, findAll, findById, update, findByUserName };
