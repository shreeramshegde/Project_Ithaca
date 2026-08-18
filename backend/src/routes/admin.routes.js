const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const validate = require('../middlewares/validate');
const adminMiddleware = require('../middlewares/admin.middleware');
const { adjustYearsSchema, addQuestionSchema } = require('../dto/admin.dto');

// Apply basic auth to all admin routes
router.use(adminMiddleware);

/**
 * @swagger
 * /api/admin/leaderboard:
 *   get:
 *     summary: Get the current leaderboard
 *     tags: [Admin]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard data
 */
router.get('/leaderboard', adminController.getLeaderboard);

/**
 * @swagger
 * /api/admin/adjust-years:
 *   post:
 *     summary: Manually adjust a team's remaining years
 *     tags: [Admin]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               team_id:
 *                 type: string
 *               adjustment:
 *                 type: number
 *     responses:
 *       200:
 *         description: Score adjusted successfully
 */
router.post('/adjust-years', validate(adjustYearsSchema), adminController.adjustYears);

/**
 * @swagger
 * /api/admin/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Admin]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: List of all questions
 *   post:
 *     summary: Add a new question
 *     tags: [Admin]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               island_id:
 *                 type: number
 *                 example: 1
 *               type:
 *                 type: string
 *                 example: MAIN
 *               format:
 *                 type: string
 *                 example: MCQ
 *               question_text:
 *                 type: string
 *               hint_text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correct_answer:
 *                 type: string
 *               hidden_wrong_answer:
 *                 type: string
 *               reward_years:
 *                 type: number
 *                 example: 0
 *               penalty_years:
 *                 type: number
 *                 example: 5
 *               difficulty_level:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Question added
 */
router.get('/questions', adminController.getQuestions);
router.post('/questions', validate(addQuestionSchema), adminController.addQuestion);

module.exports = router;
