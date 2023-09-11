import express from 'express';
import { isAdmin, isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Category from "../Models/categoryModel.js";
const categoryRouter=express.Router()


categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const categories = await Category.find({});

      if (!categories) {
        res.status(404).json({ message: 'No categories found' });
        return;
      }

      res.status(200).json(categories);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error retrieving categories', error: error.message });
    }
  })
);


categoryRouter.post("/",isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
    try{
        const {title}=req.body
const newCategory= new Category({
        title,
    })
      const savedCategory = await newCategory.save();
       res.status(200).json({ message: "category added", newCategory });}catch(error){
res
        .status(400)
        .json({ message: "Error  adding category", error: error.message });
    }
    
}))

categoryRouter.delete(
  '/:id',
  isAuth,
  isAdmin, // Your isAdmin middleware
  expressAsyncHandler(async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);

      if (!deletedCategory) {
        res.status(404).json({ message: 'Category not found' });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
);
export default categoryRouter