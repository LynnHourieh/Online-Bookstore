import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";

//for .env file
dotenv.config();
//connect to db
mongoose.connect(process.env.MONGODB_URI).then(()=>{console.log("connected to db")}).catch((error)=>{console.log(error.message)})


//for backend url
const app = express();
//call seedRouter
app.use("/api/seed", seedRouter);
app.use("/api/products",productRouter)

// app.get("/api/products", (req, res) => {
//   res.send(data.products);
// });


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
