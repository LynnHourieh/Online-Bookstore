import express from "express";
import Product from "../Models/productModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAdmin,isAuth } from "../utils.js";
const productRouter = express.Router();
productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const PAGE_SIZE = 2;

productRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

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
