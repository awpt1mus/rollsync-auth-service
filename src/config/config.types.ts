import { z } from 'zod';

export const EnvironmentVariableSchema = z.object({
  port: z.coerce.number().safe().min(0).max(65535),
  secret: z.string().min(1),
});
