import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js"
import orderRouter from "./routes/orderRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import stripeRouter from "./routes/stripeRoute.js";
import categoryRouter from "./routes/categoryRoutes.js";



//for .env file
dotenv.config();
//connect to db
mongoose.connect(process.env.MONGODB_URI).then(()=>{console.log("connected to db")}).catch((error)=>{console.log(error.message)})


//to convert formdata body from post request to json object 
//for backend url
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))


//call seedRouter
app.use("/api/seed", seedRouter);
app.use("/api/products",productRouter)
app.use("/api/users", userRouter);
app.use("/api/orders",orderRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/stripe",stripeRouter);
app.use("/api/category",categoryRouter)



// app.get("/api/products", (req, res) => {
//   res.send(data.products);
// });

app.use((err,req,res,next)=>{
  res.status(500).send({message:err.message});
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
