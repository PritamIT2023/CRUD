import express from 'express';
import  { Category } from '../models/category.model.js';
const router=express.Router();


/**
 * Create a new category
 * @route POST /
 * @param {string} name - Name of the category
 * @param {string} status - Status of the category
 * @returns {Object} Created category object
 */
router.post('/category',async(req, res)=>{
  try{
      const  name=req.body?.name;
      const  serviceId=req.body?.serviceId;
      const category=await Category.create({name: name ,serviceId:serviceId, status:'active'});
      res.status(200).send({message: 'Category created successfully', data: category});
  }catch(err){
      console.log(err);
      res.status(500).send("Internal Server Error");
  }
})

/**
 * Get all categories
 * @route GET /
 * @returns {Array} Array of categories
 */
router.get('/categories',async(req,res)=>{
    try{
        const categories=await Category.findAll();
        res.status(200).send({message: "Category fetch successfully", data: categories});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

/**
 * Update a category
 * @route PUT /:id
 * @param {string} id - ID of the category to update
 * @param {string} name - New name of the category
 * @param {string} status - New status of the category
 * @returns {Object} Updated category object
 */
router.put('/category/:categoryId',async(req, res)=>{
    try{
        const name=req.body?.name;
        const id=req.body?.categoryId;
        const category=await Category.update({name: name },{
            where:{
                id:id
            }
        });
        res.status(200).send({message: "Category updated successfully", data: serviceId});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

/**
 * Delete a category
 * @route DELETE /:id
 * @param {string} id - ID of the category to delete
 * @returns {Object} Deleted category object
 */
router.delete('/category/:categoryId',async(req, res)=>{
    try{
        const id=req.body?.categoryId;
        const category=await Category.destroy({
            where:{
                id: id,
                serviceId: null
            }
        });
        res.status(200).send({message: "Delete category no services only"});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

export default router;