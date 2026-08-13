const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const validate = require('../middlewares/validate');
const adminMiddleware = require('../middlewares/admin.middleware');
const { adjustYearsSchema } = require('../dto/admin.dto');

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

module.exports = router;
