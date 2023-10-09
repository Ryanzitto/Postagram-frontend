import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  getByIdService,
} from "../services/news.service.js";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      res.status(400).send({
        message: "Submit all fields for registration",
      });
    }

    await createService({
      title,
      text,
      banner,
      user: req.userId,
    });

    res.send(201);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const getAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    if (!limit) {
      limit = 2;
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
        userName: item.user.name,
        userAvatar: item.user.avatars,
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
        userName: news.user.name,
        userAvatar: news.user.avatars,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export { create, getAll, topNews, getById };
