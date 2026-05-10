const { z } = require('zod');

const signup = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

module.exports = { signup, login };
