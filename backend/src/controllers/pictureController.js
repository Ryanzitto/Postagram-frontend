import Picture from "../models/Picture.js";
import fs from "fs";

console.log("chegou no controller");

const create = async (req, res) => {
  try {
    const file = req.file;

    const picture = new Picture({
      src: file.path,
    });

    console.log("path da imagem:" + picture.src);

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
    const picture = await Picture.findOneAndRemove({ _id: id });

    if (!picture) {
      return res.status(404).send({ message: "Imagem não encontrada" });
    }

    fs.unlinkSync(picture.src);

    res.send({ message: "Imagem removida com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro ao remover imagem." });
  }
};

export { create, findAll, remove };
