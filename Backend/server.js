const express= require('express');
const dotenv= require('dotenv');
const cors= require('cors');

const connectionDB= require("./config/db");

dotenv.config();

const app= express();

app.use(cors());
app.use(express.json());

connectionDB();

app.get("/",(req,res) =>{
    res.send("Welcome to Helping Hands API");
});

const PORT= process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});