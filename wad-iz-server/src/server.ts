import App from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = new App(80);

mongoose
  .connect(process.env.DB_PATH!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'));
