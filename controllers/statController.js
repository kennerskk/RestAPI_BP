import Stat from '../models/stat_schema.js';

// Create or update by timestamp
export const createOrUpdateStat = async (req, res) => {
  try {
    const data = req.body;
    const { timestamp } = data;
    if (!timestamp) return res.status(400).json({ error: 'timestamp is required' });

    // Upsert: create new or replace existing
    const updated = await Stat.findOneAndUpdate(
      { timestamp },
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: 'ok', data: updated });
  } catch (err) {
    console.error('Error in createOrUpdateStat', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

export const getAllStats = async (req, res) => {
  try {
    const stats = await Stat.find().sort({ timestamp: -1 });
    return res.json(stats);
  } catch (err) {
    console.error('Error in getAllStats', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

export const getStatByTimestamp = async (req, res) => {
  try {
    const { timestamp } = req.params;
    const stat = await Stat.findOne({ timestamp });
    if (!stat) return res.status(404).json({ error: 'not found' });
    return res.json(stat);
  } catch (err) {
    console.error('Error in getStatByTimestamp', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

export const deleteStatByTimestamp = async (req, res) => {
  try {
    const { timestamp } = req.params;
    const result = await Stat.deleteOne({ timestamp });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'not found' });
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('Error in deleteStatByTimestamp', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};
