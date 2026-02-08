const fs = require('fs');
const csv = require('csv-parser');

async function readWorkoutData(filePath) {
  return new Promise((resolve, reject) => {
    const workouts = [];

    const stream = fs.createReadStream(filePath)
      .on('error', (error) => {
        if (error.code === 'ENOENT') {
          reject(new Error(`Workout data file not found: ${filePath}`));
          return;
        }

        reject(new Error(`Unable to read workout data file: ${error.message}`));
      })
      .pipe(csv())
      .on('data', (row) => workouts.push(row))
      .on('error', (error) => {
        reject(new Error(`Error parsing workout CSV data: ${error.message}`));
      })
      .on('end', () => resolve(workouts));

    // keep reference so stream is not optimized away in some runtimes
    void stream;
  });
}

async function workoutCalculator(filePath) {
  const workouts = await readWorkoutData(filePath);

  let totalMinutes = 0;
  for (let i = 0; i < workouts.length; i += 1) {
    const minutes = Number(workouts[i].minutes);
    totalMinutes += Number.isNaN(minutes) ? 0 : minutes;
  }

  return {
    totalWorkouts: workouts.length,
    totalMinutes,
    workouts,
  };
}

module.exports = {
  readWorkoutData,
  workoutCalculator,
};
