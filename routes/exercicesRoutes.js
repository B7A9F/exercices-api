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
/**
 * @swagger
 * tags:
 *   name: Exercice
 *   description: Managing exercices API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercice:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - muscle
 *       properties:
 *         name:
 *           type: string
 *           description: Exercice name
 *         type:
 *           type: string
 *           description: Exercice type
 *         muscle:
 *           type: string
 *           description: Exercice muscle
 *         _id:
 *           type: string
 *           description: Exercice id
 *         equipment:
 *           type: string
 *           description: Exercice equipment
 *         difficulty:
 *           type: string
 *           description: Exercice difficulty
 *         instructions:
 *           type: string
 *           description: Exercice instructions
 *         owner:
 *           type: string
 *           description: Exercice owner
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       required:
 *         - title
 *         - message
 *       properties:
 *         title:
 *           type: string
 *           description: Error title
 *         message:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /api/exercices/:
 *   get:
 *     summary: Returns the list of all the exerices
 *     tags: [Exercice]
 *     responses:
 *       200:
 *         description: The list of the exercices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercice'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/exercices:
 *   post:
 *     summary: Create a new exercice
 *     tags: [Exercice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercice'
 *     responses:
 *       201:
 *         description: The exercice was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercice'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/").get(getAllExercices).post(createExercice);
/**
 * @swagger
 * /api/exercices/local:
 *   get:
 *     summary: Returns the list of all local exerices
 *     tags: [Exercice]
 *     responses:
 *       200:
 *         description: The list of the exercices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercice'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/local").get(getLocalExercices);
/**
 * @swagger
 * /api/exercices/remote:
 *   get:
 *     summary: Returns the list of remote exerices
 *     tags: [Exercice]
 *     responses:
 *       200:
 *         description: The list of the exercices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercice'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/remote").get(getRemoteExercices);

router
  .route("/:id")

  /**
   * @swagger
   * /api/exercices/{id}:
   *   get:
   *     summary: Get the exercice by id
   *     tags: [Exercice]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The exercice id
   *     responses:
   *       200:
   *         description: The exercice by id
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercice'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Exercice not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Some server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  .get(getExercice)

  /**
   * @swagger
   * /api/exercices/{id}:
   *   put:
   *     summary: Update the exercice by id
   *     tags: [Exercice]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The exercice id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Exercice'
   *     responses:
   *       200:
   *         description: Updated exercice
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercice'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Exercice not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Some server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  .put(updateExercice)
  /**
   * @swagger
   * /api/exercices/{id}:
   *   delete:
   *     summary: Delete the exercice by id
   *     tags: [Exercice]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The exercice id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Exercice'
   *     responses:
   *       200:
   *         description: Deleted exercice
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Exercice'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Exercice not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Some server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  .delete(deleteExercice);

module.exports = router;
