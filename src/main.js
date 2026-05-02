require('dotenv').config();
const createApp = require('./infrastructure/web/app');

const start = async () => {
  try {
    const app = createApp();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

start();
