const mongoose= require("mongoose");
const connectionDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connected successfully");
    }catch(error){
        console.log(error);
        process.exit(1);
    }

};

module.exports= connectionDB;