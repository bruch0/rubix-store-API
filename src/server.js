import './setup.js';
import app from './app.js';

if (process.env.PORT) {
  app.listen(process.env.PORT);
} else {
  app.listen(4000);
}
