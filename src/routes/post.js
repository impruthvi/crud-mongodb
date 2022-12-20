const express = require("express");
const postController = require("./../controllers/post");
const userController = require("./../controllers/user");

const router = express.Router();

router
    .route("/")
    .get(postController.getAllPost)
    .post(userController.protect, postController.uploadPostImages, postController.createPost);

router
    .route("/:id")
    .get(postController.getOnePost)
    .patch(postController.updatePost)
    .delete(postController.deletePost);

module.exports = router;