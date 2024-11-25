import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoDB.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMPLATES_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMPLATES_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};
bootstrap();
