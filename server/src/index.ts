import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.warn(`[server] Emunah Companion API running on port ${PORT}`);
});
