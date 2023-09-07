import express from "express";
import Product from "../Models/productModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAdmin,isAuth } from "../utils.js";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const uniqueFilename = `${Date.now()}-${uuidv4()}`;
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../frontend/public/images/");
  },
  filename: (req, file, callback) => {
     const filename = `${uniqueFilename}-${file.originalname}`;
     callback(null, filename);
  },
});
//const storage = multer.memoryStorage(); // Store images in memory
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
  // upload.single("ProductImage"),
  upload.array("ProductImage",4),
  expressAsyncHandler(async (req, res) => {
    try {
      const images = req.files.map((file) => ({
        url: `${uniqueFilename}-${file.originalname}`,

        data: file.buffer, // Binary image data
        contentType: file.mimetype, // Image MIME type
        originalname: file.originalname, // Original filename
      }));

      const NewProduct = new Product({
        // image: req.file.originalname,
        
        images:images,
        title: req.body.title,
        price: req.body.price,
        auther: req.body.auther, 
        countInStock: req.body.countInStock,
        description: req.body.description,
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
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  upload.single('ProductImage'),
  expressAsyncHandler(async (req, res) => {
    try {
      const productId = req.params.id;
      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Validate and update product properties
      if (req.body.title) {
        existingProduct.title = req.body.title;
      }
      if (!isNaN(req.body.price)) {
        existingProduct.price = req.body.price;
      }
      if (req.body.auther) {
        existingProduct.auther = req.body.auther;
      }
      if (!isNaN(req.body.countInStock)) {
        existingProduct.countInStock = req.body.countInStock;
      }
      if (req.body.description) {
        existingProduct.description = req.body.description;
      }
      if (req.body.genre) {
        existingProduct.genre = req.body.genre;
      }

      // Update the image if a new one was uploaded
      if (req.file) {
        existingProduct.image = req.file.originalname;
      }

      const updatedProduct = await existingProduct.save();
      res.json(updatedProduct);
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Error updating product', error: error.message });
    }
  })
);




export default productRouter;
