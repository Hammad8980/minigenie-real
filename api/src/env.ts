import { z } from 'zod';

const envSchema = z.object({
  // Required
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  PORT: z.string().default('3001'),
  WEBHOOK_SECRET: z.string().min(16),
  
  // Optional - LLM
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Optional - Email
  SENDGRID_API_KEY: z.string().optional(),
  
  // Optional - Auth
  JWT_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
  
  // Optional - Other
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export const env = validateEnv();
