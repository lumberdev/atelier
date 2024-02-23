import { Client, envs } from 'stytch';

export const stytch = new Client({
  project_id: process.env.STYTCH_PROJECT_ID || '',
  secret: process.env.STYTCH_SECRET_TOKEN || '',
  env: process.env.NODE_ENV !== 'production' ? envs.test : envs.live,
});
