// models/stat_schema.js
import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema(
  {},
  { strict: false,  } 
);

const Stat = mongoose.model('Stat', StatSchema, 'stat');
export default Stat;
