
import ora from 'ora';

const spinner = ora(
  'Awaiting for a bit before inserting playlist items.'
).start();

setTimeout(() => {
  spinner.stop();
}, 10000);
