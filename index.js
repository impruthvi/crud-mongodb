const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { userRouter, postRouter } = require("./src/routes/");

app.use("/posts", postRouter);
app.use("/users", userRouter);



app.listen(3000, () => {
    console.log("listening on 3000");
});