import Picture from "../models/Picture.js";

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
    res.status(200).send({ message: "sucesso" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export { create };
