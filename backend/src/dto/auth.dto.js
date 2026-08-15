const { z } = require('zod');

// Schema for registering a new team
const registerTeamSchema = z.object({
  body: z.object({
    team_name: z.string()
      .min(3, "Team name must be at least 3 characters long")
      .max(100, "Team name must be less than 100 characters"),
    auth_code: z.string()
      .min(4, "Auth code must be at least 4 characters long")
      .max(100, "Auth code must be less than 100 characters"),
  })
});

module.exports = {
  registerTeamSchema
};
