import App from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Log } from './log';

Log.info('Server starting...');

dotenv.config();

mongoose
  .connect(process.env.DB_PATH!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => Log.info('Connected to database'))
  .then(() => new App(80));
