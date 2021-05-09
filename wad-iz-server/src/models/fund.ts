import { Schema, Document, model } from 'mongoose';

interface FundDocument extends Document {
  amount: number;
  time: Date;
}

const FundSchema = new Schema<FundDocument>({
  amount: { type: Number, required: true },
  time: { type: Date, required: true, default: () => new Date() },
});

const Fund = model<FundDocument>('Fund', FundSchema);

export default Fund;
