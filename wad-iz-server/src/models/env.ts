import { Document, Schema, model, Model } from 'mongoose';

interface EnvDocument<T> extends Document {
  key: string;
  value: T;
}

interface EnvModel extends Model<EnvDocument<any>> {
  getEnv<T>(key: string): Promise<EnvDocument<T>>;
  setEnv(key: string, value: any): Promise<void>;
}

const EnvSchema = new Schema<EnvDocument<any>>({
  key: { type: String, unique: true, required: true },
  value: { type: Schema.Types.Mixed, required: true },
});

EnvSchema.static('getEnv', async (key: string) => {
  const env = await Env.findOne({ key });
  if (!env) return false;
  return env;
});

EnvSchema.static('setEnv', async (key: string, value: any) => {
  const env = (await Env.getEnv<any>(key)) || new Env({ key, value });
  env.value = value;
  await env.save();
});

const Env = model<EnvDocument<any>, EnvModel>('env', EnvSchema);

export default Env;
