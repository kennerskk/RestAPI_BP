import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  timestamp: { type: String, default: 'not have timestamp' },
  value: { type: Number, default: 0 },
  // add other fields as you need
}, { timestamps: true });

const Stat = mongoose.model('Stat', StatSchema, 'stat');
export default Stat;
