const express = require("express");
const router = express.Router();
const {
  getLocalExercices,
  getRemoteExercices,
  getAllExercices,
  createExercice,
  getExercice,
  updateExercice,
  deleteExercice,
} = require("../controllers/exercicesController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getAllExercices).post(createExercice);
router.route("/local").get(getLocalExercices);
router.route("/remote").get(getRemoteExercices);

router
  .route("/:id")
  .get(getExercice)
  .put(updateExercice)
  .delete(deleteExercice);

module.exports = router;
