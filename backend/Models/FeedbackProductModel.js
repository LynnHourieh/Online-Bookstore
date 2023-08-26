import mongoose from "mongoose";

const feedbackproductSchema = new mongoose.Schema(
  {
    
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
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

const FeedbackProduct = mongoose.model(
  "FeedbackProduct",
  feedbackproductSchema
);
export default FeedbackProduct;
