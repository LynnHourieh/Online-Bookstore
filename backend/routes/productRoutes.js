import express from "express";
import Product from "../Models/productModel.js";
import expressAsyncHandler from "express-async-handler";

const productRouter = express.Router();
productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// productRouter.get(
//   "/search",
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const searchQuery = query.query;
//     console.log(searchQuery)
//     const queryFilter = searchQuery
//       ? {
//           title: {
//             $regex: searchQuery,
//             $options: "i",
//           },
//         }
//       : {};

//     const products = await Product.find(queryFilter);
// console.log(products)
//     res.send({
//       products,
//     });
//   })
// );

productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const searchQuery = req.query.query;
    const queryFilter = searchQuery
      ? {
          $or: [
            {
              title: {
                $regex: searchQuery,
                $options: "i",
              },
            },
            {
              genre: {
                $regex: searchQuery,
                $options: "i",
              },
            },
            {
              auther: {
                $regex: searchQuery,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const products = await Product.find(queryFilter);
    console.log(products);

    res.send({
      products,
    });
  })
);

productRouter.get("/title/:title", async (req, res) => {
  const product = await Product.findOne({ title: req.params.title });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});
productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default productRouter;
