import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 0, max: 5 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
