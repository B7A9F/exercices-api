const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Managing users API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Account username
 *         email:
 *           type: string
 *           description: User e-mail
 *         password:
 *           type: string
 *           description: User password
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterResponse:
 *       type: object
 *       required:
 *         - email
 *         - token
 *       properties:
 *         email:
 *           type: string
 *           description: User e-mail
 *         token:
 *           type: string
 *           description: User auth token
 *
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: All fields must be filled / Email not valid / Password not strong enough / Email already in use
 *       500:
 *         description: Some server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User e-mail
 *         password:
 *           type: string
 *           description: User password
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - token
 *       properties:
 *         username:
 *           type: string
 *           description: Account username
 *         email:
 *           type: string
 *           description: User e-mail
 *         token:
 *           type: string
 *           description: User auth token
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login into account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: The user was successfully loged-in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: All fields must be filled / Incorrect email / Incorrect password
 *       500:
 *         description: Some server error
 */
router.post("/login", loginUser);

module.exports = router;
