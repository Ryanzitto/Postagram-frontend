import Picture from "../models/Picture.js";
import fs from "fs";

console.log("chegou no controller");

const create = async (req, res) => {
  try {
    const { name } = req.body;

    const file = req.file;

    const picture = new Picture({
      name,
      src: file.path,
    });

    await picture.save();
    res.status(200).send({ message: "sucesso", picture });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const findAll = async (req, res) => {
  try {
    const pictures = await Picture.find();
    res.status(200).send(pictures);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar imagem." });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const picture = await Picture.findById(id);
    console.log(id);
    if (!picture) {
      return res.status(404).send({ message: "Imagem não encontrada" });
    }

    console.log("aqui");
    fs.unlinkSync(picture.src);
    console.log("aqui");
    await picture.remove();

    res.send({ message: "Imagem removida com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar imagem." });
  }
};

export { create, findAll, remove };
