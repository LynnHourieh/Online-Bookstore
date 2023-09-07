import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    auther: { type: String, required: true },
    //image: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    images:[imageSchema] //array of image objects 
  },
  {
    timestamps: true,
  }
);
//create model based on this schema:
const Product = mongoose.model("Product", productSchema);
export default Product;