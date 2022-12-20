const express = require("express");
const userController = require("./../controllers/user");

const router = express.Router();

// userRouter.post("/login", userController.login);
// userRouter.post("/register", userController.register);

router.route("/login").post(userController.login);
router.route("/register").post(userController.register);

router.route("/").get(userController.getAllUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
