const { z } = require('zod');

const adjustYearsSchema = z.object({
  body: z.object({
    team_id: z.string().uuid(),
    adjustment: z.number()
  })
});

const addQuestionSchema = z.object({
  body: z.object({
    island_id: z.number().min(1).max(4),
    type: z.enum(['PRE_ROUND', 'MAIN']),
    format: z.enum(['MCQ', 'NON_MCQ']),
    question_text: z.string().min(5),
    hint_text: z.string().optional(),
    options: z.array(z.string()).optional(),
    correct_answer: z.string().min(1),
    hidden_wrong_answer: z.string().optional(),
    reward_years: z.number().min(0).default(0.0),
    penalty_years: z.number().min(0).default(0.0),
    difficulty_level: z.number().min(1).default(1)
  })
});

module.exports = {
  adjustYearsSchema,
  addQuestionSchema
};
