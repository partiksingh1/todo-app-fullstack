
import  express  from "express";
import  mongoose  from "mongoose";
import cors from "cors";
import todoRoute from "./routes/todos.js";
import userRoute from "./routes/user.js"
const port = 8000;
const app = express();

app.listen(port,()=>{
    console.log(`Server is listining on ${port}`);
});


try {
    const connetion = mongoose.connect("mongodb+srv://partiktanwer:partiktanwer@todo-app.pssnqkw.mongodb.net/")

if(connetion){
    console.log("mongoose is connected");
}else{
    console.log("mongoose is not connected");
}
} catch (error) {
    console.log(error);
    
}
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        message:"this is homepage"
    })
})

app.use('/todo',todoRoute);
app.use('/user',userRoute);