const { z } = require('zod');

const submitPreRoundSchema = z.object({
  body: z.object({
    question_id: z.string().uuid(),
    selected_option: z.string().min(1)
  })
});

const submitAnswerSchema = z.object({
  body: z.object({
    question_id: z.string().uuid(),
    answer_string: z.string().min(1)
  })
});

const useRewardSchema = z.object({
  body: z.object({
    reward_type: z.enum(['ATHENAS_SCROLL', 'CYCLOPS_EYE', 'HERMES_SANDALS', 'THE_BLESSING']),
    target_question_id: z.string().uuid().optional()
  })
});

module.exports = {
  submitPreRoundSchema,
  submitAnswerSchema,
  useRewardSchema
};
