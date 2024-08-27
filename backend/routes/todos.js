import express from 'express'
import { Todo } from '../model/todoSchema.js';
import { todo } from 'node:test';
import authMiddleware from '../middleware/index.js';


const todoRoute = express.Router();

todoRoute.get('/all', async(req,res)=>{
    try {
        const todos = await Todo.find();
        if(todos){
            console.log(todos);
            res.status(200).send({
                message:"successfully fetched all the todos",
                todo:todos
            })
        }
        else{
            res.status(404).send({
                "message":"Todos not found"
            })
        }
   
    } catch (error) {
        console.error("Error fetching todos");
        res.status(500).send({
            message:"Error fetching todos",
            error:error.message
        })
    }
})

todoRoute.get('/:_id',authMiddleware,async(req,res)=>{
    try {
        const id = req.params._id
        console.log(id);
        const todo = await Todo.findById(id);
            if(todo){
                console.log(todo);
                 res.status(200).send({
            message:"successfully fetched the todo",
            todo:todo
            })
            }
            else{
                res.status(404).send({
                    "message":"Todo not found"
                })
            }
       
    } catch (error) {
        console.error("Error fetching todo");
        res.status(500).send({
            message:"Error fetching todo",
            error:error.message
        })
    }
})

todoRoute.get('/user/:userId',authMiddleware,async(req,res)=>{
    try {
        const {userId} = req.params;
    const todos = await Todo.find({user: userId});
    if(todo){
        console.log(todo);
         res.status(200).send({
    message:"successfully fetched the todo",
    todos:todos
    })
    }
    else{
        res.status(404).send({
            "message":"Todo not found"
        })
    }
    } catch (error) {
        console.error("Error fetching todo");
        res.status(500).send({
            message:"Error fetching todo",
            error:error.message
        })
    }
    
})

todoRoute.post('/addTodo',authMiddleware,async (req,res)=>{
    try {
        const todoData = req.body;
        const newTodo = new Todo(todoData);
        await newTodo.save();
        res.status(200).send({
            message:"Todo added successfully",
            todo: newTodo
        });
    } catch (error) {
        console.error("Error adding todo",error);
        res.status(500).send({
            message:"Failed to add todo",
            error:"error.message"
        })
    }
})

todoRoute.delete("/delete/:_id",authMiddleware,async(req,res)=>{
    try {
        const id = req.params._id;
        const deleteTodo = await Todo.findOneAndDelete(id)
        if(deleteTodo){
            res.status(200).send({
                message:"Todo deleted successfully!!",
            })
        }else{
            res.status(404).send({
                message:"Todo not found"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message:"Not deleted ..some problem"
        })
    }
})

todoRoute.put("/edit/:_id",authMiddleware,async (req,res)=>{
    try {
        const id = req.params._id;
        const updateData = req.body;
        const updateTodo = await Todo.findByIdAndUpdate(id,updateData,{new:true});

        if(!updateTodo){
            return res.status(404).send({message:"Todo not found"});
        }
        res.send(updateTodo);
        
    } catch (error) {
        res.status(500).send({ message: 'Error updating todo', error });
    }
})



export default todoRoute;