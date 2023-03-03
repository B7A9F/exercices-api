const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    muscle: {
      type: String,
      required: true,
    },
    equipement: {
      type: String,
      required: false,
    },
    img: {
      type: String,
      required: false,
    },
    gif: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    instructions: {
      type: String,
      required: false,
    },
    owner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Exercice", exerciceSchema);
