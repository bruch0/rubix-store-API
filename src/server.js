import './setup.js';
import app from './app.js';

console.log(process.env.DB_DATABASE);

app.listen(process.env.PORT);
