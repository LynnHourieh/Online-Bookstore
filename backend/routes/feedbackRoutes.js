import express from "express";
import Feedback from "../Models/feedbackModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";

const feedbackRouter = express.Router();

feedbackRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const feedback = await Feedback.find({ user: req.user._id });
    res.send(feedback);
  })
);
feedbackRouter.get(
  "/all",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const feedback = await Feedback.find({});
    res.send(feedback);
  })
);

export default feedbackRouter