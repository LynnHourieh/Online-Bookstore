import express from "express";
import Product from "../Models/productModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAdmin,isAuth } from "../utils.js";
import multer from "multer";
import Feedback from "../Models/feedbackModel.js";


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../frontend/public/images/");
  },
  filename: (req, file, callback) => {
    
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const productRouter = express.Router();
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find({})

    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
});



const PAGE_SIZE = 4;

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
productRouter.post(
  "/",
  isAuth,
  isAdmin,
  upload.single("ProductImage"),
  expressAsyncHandler(async (req, res) => {
    try {
      const NewProduct = new Product({
        image: req.file.originalname,
        title: req.body.title,
        price: req.body.price,
        auther: req.body.auther, 
        countInStock: req.body.countInStock,
        description: req.body.description,
        rating: req.body.rating,
        genre:req.body.genre
      });

      const savedProduct = await NewProduct.save();
      res.json(savedProduct);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error adding product", error: error.message });
    }
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

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin, // Your isAdmin middleware
  expressAsyncHandler(async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
);


export default productRouter;
