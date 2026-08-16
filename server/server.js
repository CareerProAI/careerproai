import { createApp, ready } from './createApp.js';

const app = createApp();
const PORT = process.env.PORT || 3001;

ready().then(() => {
  app.listen(PORT, () => {
    console.log(`CareerProAI Backend API server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
