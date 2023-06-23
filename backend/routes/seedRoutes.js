import express from "express";
import Product from "../Models/productModel.js";
import data from "../data.js";

const seedRouter = express.Router();

//seedRoute to upload data to database
seedRouter.get("/", async (req, res) => {
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(data.products);
  res.send({ createdProducts });
});
export default seedRouter;
