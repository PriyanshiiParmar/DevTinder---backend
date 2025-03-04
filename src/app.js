const express = require("express");

const app = express();

app.use("/", (req,res)=>{
res.send("Namastey Duniya");
})

app.use("/hello", (req, res)=>{
    res.send("Hello hello Namasteyyyy")
})

app.use("/test", (req, res) =>{
    res.send("Hello World");
})


app.listen(7777, () =>{
    console.log("Server is successfully running on port 7777");
});
