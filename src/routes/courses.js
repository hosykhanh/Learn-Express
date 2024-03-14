const express = require("express");
const router = express.Router();

const CourseController = require("../app/controllers/CourseController");

// CourseController.index

router.get("/create", CourseController.create);
router.post("/store", CourseController.store);
router.get("/:slug", CourseController.show);
router.get("/:id/edit", CourseController.edit);
router.put("/:id", CourseController.update);
router.delete("/:id", CourseController.delete);

module.exports = router;
