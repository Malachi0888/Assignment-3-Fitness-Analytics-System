const fs = require('fs').promises;
const path = require('path');
const { readHealthData, healthMetricsCounter } = require('./healthReader');

const testDataDir = path.join(__dirname, 'data', '__tests__', 'health');

beforeAll(async () => {
  await fs.mkdir(testDataDir, { recursive: true });
});

afterAll(async () => {
  await fs.rm(testDataDir, { recursive: true, force: true });
});

test('reads valid JSON health data', async () => {
  const filePath = path.join(testDataDir, 'valid-health.json');
  const payload = [
    { date: '2026-01-01', sleepHours: 7 },
    { date: '2026-01-02', sleepHours: 8 },
  ];
  await fs.writeFile(filePath, JSON.stringify(payload), 'utf8');

  const result = await readHealthData(filePath);

  expect(Array.isArray(result)).toBe(true);
  expect(result).toHaveLength(2);
});

test('counts health entries correctly', async () => {
  const filePath = path.join(testDataDir, 'count-health.json');
  const payload = [
    { date: '2026-01-01', calories: 2200 },
    { date: '2026-01-02', calories: 2100 },
    { date: '2026-01-03', calories: 2300 },
  ];
  await fs.writeFile(filePath, JSON.stringify(payload), 'utf8');

  const summary = await healthMetricsCounter(filePath);

  expect(summary).toEqual(
    expect.objectContaining({
      totalEntries: 3,
      entries: expect.any(Array),
    })
  );
});

test('throws helpful error when health JSON file is missing', async () => {
  const filePath = path.join(testDataDir, 'missing-health.json');

  await expect(readHealthData(filePath)).rejects.toThrow('Health data file not found');
});

test('throws helpful error for invalid JSON', async () => {
  const filePath = path.join(testDataDir, 'invalid-health.json');
  await fs.writeFile(filePath, '{ invalid json', 'utf8');

  await expect(readHealthData(filePath)).rejects.toThrow('Invalid JSON format');
});
