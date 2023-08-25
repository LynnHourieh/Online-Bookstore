import express from "express";
import Rating from "../Models/ratingModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";


const ratingRouter = express.Router();
ratingRouter.get(
  "/product/:productId",
  expressAsyncHandler(async (req, res) => {
    const rating = await Rating.find({
      product: req.params.productId,
    }).populate("user", "name");
    res.send(rating);
  })
);
ratingRouter.post(
  "/product/:productId/user/:userId",isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { rating } = req.body;
      const { productId, userId } = req.params;

      // Check if user has existing feedback for this product
      let existingRating = await Rating.findOne({
        product: productId,
        user: userId,
      });

      if (existingRating) {
        // If existing feedback exists, update it
        existingRating.rating = rating;
        const updatedRating = await existingRating.save();
        res.status(200).json(updatedRating);
      } else {
        // If no existing feedback, create a new feedback entry
        const newRating = new Rating({
          rating,
          product: productId,
          user: userId,
        });
        const savedRating = await newRating.save();
        res.status(201).json(savedRating);
      }
    } catch (error) {
      res
        .status(400)
        .json({
          message: "Error adding/updating rating",
          error: error.message,
        });
    }
  })
);

export default ratingRouter