const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { registerTeamSchema } = require('../dto/auth.dto');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new team
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_name
 *               - auth_code
 *             properties:
 *               team_name:
 *                 type: string
 *                 example: "The Argonauts"
 *               auth_code:
 *                 type: string
 *                 example: "secretCode123"
 *     responses:
 *       201:
 *         description: Team registered successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Team already exists
 */
router.post('/register', validate(registerTeamSchema), authController.registerTeam);

module.exports = router;
