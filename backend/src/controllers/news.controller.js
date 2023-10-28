import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  getByIdService,
  searchByTitleService,
  searchByUserService,
  updateService,
  deleteNewsService,
  likeService,
  likeDeleteService,
  addCommentService,
  removeCommentService,
} from "../services/news.service.js";

import User from "../models/User.js";
import News from "../models/News.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      res.status(400).send({
        message: "Submit all fields for registration",
      });
    }

    const news = await createService({
      title,
      text,
      banner,
      user: req.userId,
    });

    res.status(201).send({ news });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const getAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    if (!limit) {
      limit = 5;
    }
    if (!offset) {
      offset = 0;
    }

    limit = Number(limit);
    offset = Number(offset);

    const news = await findAllService(limit, offset);

    const total = await countNews();

    const currentUrl = req.baseUrl;

    const next = offset + limit;

    const nextUrl =
      next < total ? `${currentUrl}?limit${limit}&offset${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;

    const previousUrl =
      previous !== null
        ? `${currentUrl}?limit${limit}&offset${previous}`
        : null;

    if (news.length === 0) {
      return res.status(400).send({ message: "there is no registred news" });
    }

    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.userName,
        avatar: item.user.avatar,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const topNews = async (req, res) => {
  try {
    const news = await topNewsService();
    if (!news) {
      return res.status(400).send({ message: "There is no news here" });
    }

    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        userName: news.user.name,
        userAvatar: news.user.avatars,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const getById = async (req, res) => {
  try {
    console.log("entrou no getbyid");
    const { id } = req.params;
    const news = await getByIdService(id);

    if (!news) {
      res.status(400).send({ message: "news not found" });
    }

    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        userName: news.user.userName,
        userAvatar: news.user.avatar,
      },
    });
  } catch (error) {
    console.log("entrou no getbyid");
    res.status(500).send({ message: error.message });
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const news = await searchByTitleService(title);

    if (news.length === 0) {
      return res.status(400).send({ message: "no news existing " });
    }

    console.log(news);

    return res.send({
      news: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.userName,
        userAvatar: item.user.avatars,
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const searchByUser = async (req, res) => {
  try {
    const id = req.userId;
    const news = await searchByUserService(id);
    console.log(news);
    return res.send({
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.userName,
        userAvatar: item.user.avatars,
      })),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//solução encontrada pelo gpt porém preciso refatorar para não ferir os principios da arquitetura limpa
const searchByUserName = async (req, res) => {
  try {
    const userName = req.params.userName;

    // Encontre o usuário com base no userName
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Encontre todas as notícias associadas a esse usuário
    const news = await News.find({ user: user._id })
      .sort({ _id: -1 })
      .populate("user");

    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar notícias", error });
  }
};

const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    const { id } = req.params;

    if (!title && !text && !banner) {
      res.status(400).send({
        message: "Submit at least one field",
      });
    }

    const news = await getByIdService(id);

    console.log(news.user.id != req.userId);

    if (news.user.id != req.userId) {
      return res.status(400).send({ message: "you did not update this post" });
    }

    await updateService(id, title, text, banner);

    return res.send({ message: "Post successfully updated" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await getByIdService(id);

    if (news.user.id != req.userId) {
      return res.status(400).send({ message: "you did not delete this post" });
    }

    await deleteNewsService(id);

    return res.send({ message: "news deleted!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const like = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const newsLiked = await likeService(id, userId);
  console.log(newsLiked);

  if (!newsLiked) {
    await likeDeleteService(id, userId);
    return res.status(200).send({ message: "like removed" });
  }
  res.send({ message: "like successfull aplied" });
};

const comment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment, userName } = req.body;

    if (!comment) {
      return res.status(400).send({
        message: "write a comment to continue.",
      });
    }
    if (!userName) {
      return res.status(400).send({
        message: "send a userName to continue.",
      });
    }

    await addCommentService(id, comment, userId, userName);

    res.send({ message: "comment successfully completed" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const removeComment = async (req, res) => {
  try {
    const { id, idComment } = req.params;
    const userId = req.userId;

    const commentDeleted = await removeCommentService(id, idComment, userId);

    console.log(commentDeleted);

    const commentFinder = commentDeleted.comments.find(
      (comment) => comment.idComment === idComment
    );

    if (!commentFinder) {
      return res.status(400).send({ message: "comment not found" });
    }

    if (commentFinder.userId !== userId) {
      return res.status(400).send({ message: "this comment cant be deleted" });
    }

    res.send({ message: "comment successfully removed" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {
  create,
  getAll,
  topNews,
  getById,
  searchByTitle,
  searchByUser,
  searchByUserName,
  update,
  deleteNews,
  like,
  comment,
  removeComment,
};
