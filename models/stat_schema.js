import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  timestamp: { type: String, required: true }, // หรือ Number ก็ได้
  value: { type: Number, default: 0 },
  topic_name: { type: String },
  experiment_id: { type: Number },
  session_id: { type: Number },
  data: { type: Object } // เก็บ object nested ได้
}, { timestamps: true });

const Stat = mongoose.model('Stat', StatSchema, 'stat');
export default Stat;
