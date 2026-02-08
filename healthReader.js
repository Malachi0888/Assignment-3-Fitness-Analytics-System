const fs = require('fs').promises;

async function readHealthData(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error('Health data must be a JSON array.');
    }

    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Health data file not found: ${filePath}`);
    }

    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format in health data file: ${filePath}`);
    }

    throw new Error(`Unable to read health data: ${error.message}`);
  }
}

async function healthMetricsCounter(filePath) {
  const entries = await readHealthData(filePath);
  return {
    totalEntries: entries.length,
    entries,
  };
}

module.exports = {
  readHealthData,
  healthMetricsCounter,
};
