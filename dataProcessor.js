require('dotenv').config();

const { healthMetricsCounter } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

async function processFiles() {
  const userName = process.env.USER_NAME || 'User';
  const weeklyGoal = Number(process.env.WEEKLY_GOAL || 0);

  try {
    console.log(`Processing data for: ${userName}`);

    console.log('📁 Reading workout data...');
    const workoutSummary = await workoutCalculator('./data/workouts.csv');
    console.log(`Total workouts: ${workoutSummary.totalWorkouts}`);
    console.log(`Total minutes: ${workoutSummary.totalMinutes}`);

    console.log('📁 Reading health data...');
    const healthSummary = await healthMetricsCounter('./data/health-metrics.json');
    console.log(`Total health entries: ${healthSummary.totalEntries}`);

    console.log('\n=== SUMMARY ===');
    console.log(`Workouts found: ${workoutSummary.totalWorkouts}`);
    console.log(`Total workout minutes: ${workoutSummary.totalMinutes}`);
    console.log(`Health entries found: ${healthSummary.totalEntries}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    if (workoutSummary.totalMinutes >= weeklyGoal) {
      console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal!`);
    } else {
      const remaining = weeklyGoal - workoutSummary.totalMinutes;
      console.log(`Keep going ${userName}! You are ${remaining} minutes away from your weekly goal.`);
    }
  } catch (error) {
    console.error(`Error processing files: ${error.message}`);
  }
}

if (require.main === module) {
  processFiles();
}

module.exports = {
  processFiles,
};
