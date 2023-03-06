const asyncHandler = require("express-async-handler");
const { promisifiedRequest } = require("../utils/api");
const Exercice = require("../models/exercicesModel");
require("dotenv").config();

//@desc Get local exercices
//@route GET /api/exercices/local
//@access private
const getLocalExercices = asyncHandler(async (req, res) => {
  const exercices = await Exercice.find({ owner: [req.user._id, "system"] });
  res.status(200).json(exercices);
});

const options = {
  url: "https://api.api-ninjas.com/v1/exercises",
  method: "GET",
  headers: {
    "X-Api-Key": process.env.EXERCICES_API_KEY,
  },
};
//@desc Get remote exercices
//@route GET /api/exercices/remote
//@access private
const getRemoteExercices = asyncHandler(async (req, res) => {
  const response = await promisifiedRequest(options);

  res.status(200).json(JSON.parse(response.body));
});
const getAllExercices = asyncHandler(async (req, res) => {
  const [local, remote] = await Promise.all([
    Exercice.find({ owner: [req.user._id, "system"] }),
    promisifiedRequest(options),
  ]).catch((err) => console.log(err));
  if (remote.statusCode !== 200) {
    return res.status(200).json([...local]);
  }
  if (local.statusCode !== 200) {
    return res.status(200).json([...JSON.parse(remote.body)]);
  }
  const data = [...local, ...JSON.parse(remote.body)];
  return res.status(200).json(data);
});

//@desc Create New exercice
//@route POST /api/exercices
//@access private
const createExercice = asyncHandler(async (req, res) => {
  const { name, type, muscle } = req.body;
  if (!name || !type || !muscle) {
    res.status(400);
    throw new Error("name, type and muscle fields are mandatory !");
  }
  const exercices = await Exercice.find({
    name,
    muscle,
    type,
    owner: req.user._id,
  });
  if (exercices.length > 0) {
    res.status(400);
    throw Error("Exercice already exist, you can delete or update it by id.");
  }
  const exercice = await Exercice.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json(exercice);
});

//@desc Get exercice
//@route GET /api/exercices/:id
//@access private
const getExercice = asyncHandler(async (req, res) => {
  const exercice = await Exercice.findById(req.params.id);
  if (!exercice) {
    res.status(404);
    throw new Error("Exercice not found");
  }
  res.status(200).json(exercice);
});

//@desc Update exercice
//@route PUT /api/exercices/:id
//@access private
const updateExercice = asyncHandler(async (req, res) => {
  const exercice = await Exercice.findById(req.params.id);
  if (!exercice) {
    res.status(404);
    throw new Error("Exercice not found");
  }

  if (exercice.owner.toString() !== req.user._id) {
    res.status(403);
    throw new Error(
      "User don't have permission to update other user exercices"
    );
  }

  const updatedExercice = await Exercice.findByIdAndUpdate(
    req.params.id,
    { ...req.body, owner: req.user._id },
    { new: true }
  );

  res.status(200).json(updatedExercice);
});

//@desc Delete exercice
//@route DELETE /api/exercices/:id
//@access private
const deleteExercice = asyncHandler(async (req, res) => {
  const exercice = await Exercice.findById(req.params.id);
  if (!exercice) {
    res.status(404);
    throw new Error("Exercice not found");
  }

  if (exercice.owner.toString() !== req.user._id) {
    res.status(403);
    throw new Error(
      "User don't have permission to update other user exercices"
    );
  }
  const data = await Exercice.deleteOne({ _id: req.params.id });
  res.status(200).json(exercice);
});

module.exports = {
  getLocalExercices,
  getRemoteExercices,
  getAllExercices,
  createExercice,
  getExercice,
  updateExercice,
  deleteExercice,
};
