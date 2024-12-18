import express from 'express';
import  { Category } from '../models/category.model.js';
import { Service } from '../models/service.model.js';
import { Price } from '../models/serviceprice.model.js';
const router=express.Router();

router.post('/category/:categoryId/service',async(req, res)=>{
    try{
        const  name=req.body?.name;
        const  categoryId=req.params?.categoryId;
        const  price=req.body?.prices;
        if(!name || !categoryId){
            return res.status(400).send({message: 'Please provide name and categoryId'});
        }
        const categoryData = await Category.findByPk(categoryId);
        if(!categoryData){
            return res.status(400).send({message: 'Given Category not found'});
        }
        const service=await Service.create({name: name ,categoryId:categoryId, status:'active'});
        
        const priceData = price.map(item => {
          // Create a new object for each item
          const newItem = {...item, serviceId: service.id, status: 'active' };
          return newItem;
        });
        const prices = await Price.bulkCreate(priceData);
        res.status(200).send({message: 'Service created successfully', data: service});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})


router.get('/category/:categoryId/services',async(req,res)=>{
    try{
        const categoryId=req.params?.categoryId;
        const services=await Service.findAll({
            where:{
                categoryId: categoryId
            }
        });
        const prices = await Price.findAll({
            where:{
                serviceId: services.map(service => service.id)
            }
        });
        res.status(200).send({message: "Service fetch successfully", services: services, prices:prices});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

/*
Create an API to remove service from category.
DELETE /category/:categoryId/service/:serviceId
*/
router.delete('/category/:categoryId/service/:serviceId',async(req, res)=>{
    try{
        const categoryId=req.params?.categoryId;
        const serviceId=req.params?.serviceId;
        const service=await Service.findByPk(serviceId);
        if(!service){
            return res.status(400).send({message: 'Given Service not found'});
        }
        await Service.update({status: 'inactive'}, {
            where: {
                id: serviceId
            }
        });
        await Price.update({status: 'inactive'}, {
            where: {
                serviceId: serviceId
            }
        });
        res.status(200).send({message: 'Service removed successfully'});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

/*
PUT /category/:categoryId/service/:serviceId
- We are able to add/remove/update price options of any service while updating using the above API.
*/
router.put('/category/:categoryId/service/:serviceId',async(req, res)=>{
    try{
        const categoryId=req.params?.categoryId;
        const serviceId=req.params?.serviceId;
        const service=await Service.findByPk(serviceId);
        if(!service){
            return res.status(400).send({message: 'Given Service not found'});
        }
        const  price=req.body?.prices;
        const priceData = price.map(item => {
            // Create a new object for each item
            const newItem = {...item, serviceId: service.id, status: 'active' };
            return newItem;
        });
        const prices = await Price.bulkCreate(priceData);
        res.status(200).send({message: 'Service updated successfully', data: service});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

export default router;