import express from "express";
import anify from "../services/anify.js";
import gogoanime from "../services/gogoanime.js";
import samehadaku from "../services/samehadaku.js";
import otakudesu from "../services/otakudesu.js";

const router = express.Router();

router.get("/:animeId", async (req, res, next) => {
  try {
    const { animeId } = req.params;
    const { source = "anify" } = req.query;

    let result;
    switch (source) {
      case "anify":
        result = await anify.getEpisodes(animeId);
        break;
      case "gogoanime":
        result = await gogoanime.getEpisodes(animeId);
        break;
      case "samehadaku":
        result = await samehadaku.getEpisodes(animeId);
        break;
      case "otakudesu":
        result = await otakudesu.getEpisodes(animeId);
        break;
      default:
        result = await anify.getEpisodes(animeId);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:animeId/:episodeNumber", async (req, res, next) => {
  try {
    const { animeId, episodeNumber } = req.params;
    const { source = "anify", server = "vidplay" } = req.query;

    let result;
    const episodeId = `${animeId}-${episodeNumber}`;

    try {
      switch (source) {
        case "anify":
          result = await anify.getEpisodeSources(episodeId, server);
          break;
        case "gogoanime":
          result = await gogoanime.getEpisodeSources(episodeId);
          break;
        default:
          result = await anify.getEpisodeSources(episodeId, server);
      }
    } catch {
      result = {
        success: false,
        error: { code: "SOURCE_OFFLINE", message: "No sources available" },
      };
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
