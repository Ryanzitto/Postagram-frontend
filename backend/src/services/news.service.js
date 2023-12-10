import News from "../models/News.js";

const createService = (body) => News.create(body);

const findAllService = (limit, offset) =>
  News.find()
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)
    .populate("user")
    .populate("banner");

const countNews = () => News.countDocuments();

const getByIdService = (id) =>
  News.findById(id).populate("user").populate("banner");

const searchByTitleService = (title) =>
  News.find({
    title: { $regex: `${title || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

const searchByUserService = (id) =>
  News.find({ user: id }).sort({ _id: -1 }).populate("user").populate("banner");

const updateService = (id, title, text, banner) =>
  News.findOneAndUpdate(
    { _id: id },
    { title, text, banner },
    { includeResultMetadata: false }
  );

const deleteNewsService = (id) => News.findOneAndDelete({ _id: id });

const likeService = (id, userId) =>
  News.findOneAndUpdate(
    { _id: id, "likes.userId": { $nin: [userId] } },
    { $push: { likes: { userId, created: new Date() } } }
  );

const likeDeleteService = (id, userId) =>
  News.findOneAndUpdate({ _id: id }, { $pull: { likes: { userId } } });

const addCommentService = (id, comment, userId, userName) => {
  const idComment = Math.floor(Date.now() * Math.random()).toString(36);
  return News.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        comments: {
          idComment,
          userId,
          comment,
          createdAt: new Date(),
          userName,
        },
      },
    }
  );
};

const removeCommentService = (id, idComment, userId) =>
  News.findOneAndUpdate(
    { _id: id },
    { $pull: { comments: { idComment, userId } } }
  );

export {
  createService,
  findAllService,
  countNews,
  getByIdService,
  searchByTitleService,
  searchByUserService,
  updateService,
  deleteNewsService,
  likeService,
  likeDeleteService,
  addCommentService,
  removeCommentService,
};
