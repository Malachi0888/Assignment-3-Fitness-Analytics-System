const fs = require('fs').promises;
const path = require('path');
const { readWorkoutData, workoutCalculator } = require('./workoutReader');

const testDataDir = path.join(__dirname, 'data', '__tests__', 'workouts');

beforeAll(async () => {
  await fs.mkdir(testDataDir, { recursive: true });
});

afterAll(async () => {
  await fs.rm(testDataDir, { recursive: true, force: true });
});

test('reads valid CSV workout data', async () => {
  const filePath = path.join(testDataDir, 'valid-workouts.csv');
  const csvContent = 'date,type,minutes\n2026-01-01,run,30\n2026-01-02,bike,45\n';
  await fs.writeFile(filePath, csvContent, 'utf8');

  const result = await readWorkoutData(filePath);

  expect(Array.isArray(result)).toBe(true);
  expect(result).toHaveLength(2);
  expect(result[0]).toEqual(
    expect.objectContaining({
      type: 'run',
      minutes: '30',
    })
  );
});

test('counts workouts and calculates total minutes', async () => {
  const filePath = path.join(testDataDir, 'workout-summary.csv');
  const csvContent = 'date,type,minutes\n2026-01-01,run,60\n2026-01-02,lift,40\n2026-01-03,yoga,20\n';
  await fs.writeFile(filePath, csvContent, 'utf8');

  const summary = await workoutCalculator(filePath);

  expect(summary).toEqual(
    expect.objectContaining({
      totalWorkouts: 3,
      totalMinutes: 120,
      workouts: expect.any(Array),
    })
  );
});

test('throws helpful error when workout CSV file is missing', async () => {
  const filePath = path.join(testDataDir, 'missing-workouts.csv');

  await expect(readWorkoutData(filePath)).rejects.toThrow('Workout data file not found');
});
