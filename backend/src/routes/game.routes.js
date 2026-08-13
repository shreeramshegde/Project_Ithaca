const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth.middleware');
const { submitPreRoundSchema, submitAnswerSchema, useRewardSchema } = require('../dto/game.dto');

// Apply auth middleware to all game routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/game/state:
 *   get:
 *     summary: Get current team state
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current game state
 */
router.get('/state', gameController.getState);

/**
 * @swagger
 * /api/game/submit-pre-round:
 *   post:
 *     summary: Submit pre-round GK MCQ
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: string
 *               selected_option:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pre-round processed
 */
router.post('/submit-pre-round', validate(submitPreRoundSchema), gameController.submitPreRound);

/**
 * @swagger
 * /api/game/submit-answer:
 *   post:
 *     summary: Submit an answer for a main question
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: string
 *               answer_string:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer processed
 */
router.post('/submit-answer', validate(submitAnswerSchema), gameController.submitAnswer);

/**
 * @swagger
 * /api/game/use-hint:
 *   post:
 *     summary: Use one of the 3 standard hints
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hint provided
 */
router.post('/use-hint', gameController.useHint);

/**
 * @swagger
 * /api/game/use-reward:
 *   post:
 *     summary: Use an acquired reward item
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reward_type:
 *                 type: string
 *               target_question_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reward activated
 */
router.post('/use-reward', validate(useRewardSchema), gameController.useReward);

/**
 * @swagger
 * /api/game/next-island:
 *   post:
 *     summary: Progress team to the next island
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sailed to next island or finished game
 */
router.post('/next-island', gameController.nextIsland);

module.exports = router;
