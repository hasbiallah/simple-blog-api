require('dotenv').config();
const createApp = require('./infrastructure/web/app');
const { testConnection } = require('./infrastructure/database/mysql_connection');

const start = async () => {
  try {
    await testConnection();
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
