const { z } = require('zod');

const adjustYearsSchema = z.object({
  body: z.object({
    team_id: z.string().uuid(),
    adjustment: z.number()
  })
});

module.exports = {
  adjustYearsSchema
};
