const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { User, Friend, Post, Comment, UserEvent } = require("../../db/models");

const router = express.Router();


const eventExists = async (req, res, next) => {
  const { eventId } = req.params;

  const event = await UserEvent.findByPk(eventId);

  if (!event) {
    res.status(404);
    return res.json({
      message: "This event does not exist.",
    });
  }

  req.event = event;
  return next();
};

const isEventOrganizer = (req, res, next) => {
  const { userId: organizerId } = req.event;

  const { id: userId } = req.user;

  // console.log(userId, organizerId);

  if (organizerId != userId) {
    res.status(403);
    return res.json({
      message: "You dont have permission to edit this event.",
    });
  }

  return next();
};

router.put(
  "/:eventId",
  [requireAuth, eventExists, isEventOrganizer],
  async (req, res) => {
    const { event } = req;

    const { body } = req;

    const options = {};

    for (key of Object.keys(body)) {
      options[key] = body[key];
    }

    const newEvent = await event.update(options);

    res.status(200);
    return res.json(newEvent);
  }
);

router.delete(
  "/:eventId",
  [requireAuth, eventExists, isEventOrganizer],
  async (req, res) => {
    const { event } = req;

    await event.destroy();

    res.status(200);
    return res.json({
      message: "Success",
    });
  }
);

module.exports = router;
