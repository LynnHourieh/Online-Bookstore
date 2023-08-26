import express from "express";
import Feedback from "../Models/feedbackModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";

const feedbackRouter = express.Router();
//get feedback according to user's id
feedbackRouter.get(
  "/user/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const feedback = await Feedback.find({ user: req.params.userId });
    res.send(feedback);
  })
);
//get feedback according to product's id
feedbackRouter.get(
  "/product/:productId",
  expressAsyncHandler(async (req, res) => {
    try {
      const productId = req.params.productId;

      const feedback = await Feedback.find({ product: productId }).populate(
        "user",
        "name"
      );

      if (!feedback || feedback.length === 0) {
        res.status(404).json({ message: "Feedback not found for the product" });
        return;
      }

      const totalRatings = feedback.reduce(
        (total, item) => total + item.rating,
        0
      );
      const averageRating = totalRatings / feedback.length;

      res.status(200).json({ feedback, averageRating });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving feedback", error: error.message });
    }
  })
);

//get all feedbacks
feedbackRouter.get(
  "/all",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const feedback = await Feedback.find({});
    res.send(feedback);
  })
);
//add new feedback with user and product ids
//localhost:5000/api/feedback/64ce97e1aff22725f6dc74f6

feedbackRouter.post(
  "/product/:productId/user/:userId",isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { text,rating } = req.body;
      const { productId, userId } = req.params;

      // Check if user has existing feedback for this product
      let existingFeedback = await Feedback.findOne({
        product: productId,
        user: userId,
      });

      if (existingFeedback) {
        // If existing feedback exists, update it
        existingFeedback.text = text;
        existingFeedback.rating=rating;
        const updatedFeedback = await existingFeedback.save();
        res.status(200).json(updatedFeedback);
      } else {
        // If no existing feedback, create a new feedback entry
        const newFeedback = new Feedback({
          text,
          rating,
          product: productId,
          user: userId,
        });
        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error adding/updating feedback", error: error.message });
    }
  })
);
feedbackRouter.delete(
  "/:feedbackId",
  expressAsyncHandler(async (req, res) => {
    try {
      const { feedbackId } = req.params;

      // Find and delete the feedback by its ID
      const deletedFeedback = await Feedback.findOneAndDelete({
        _id: feedbackId,
      });

      if (deletedFeedback) {
        res.status(200).json({ message: "Feedback deleted", deletedFeedback });
      } else {
        res.status(404).json({ message: "Feedback not found" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error deleting feedback", error: error.message });
    }
  })
);


export default feedbackRouter