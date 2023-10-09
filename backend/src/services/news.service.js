import News from "../models/News.js";

const createService = (body) => News.create(body);

const findAllService = (limit, offset) =>
  News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const countNews = () => News.countDocuments();

const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

const getByIdService = (id) => News.findById(id).populate("user");

export {
  createService,
  findAllService,
  countNews,
  topNewsService,
  getByIdService,
};
