import commandExists from 'command-exists';
import chalk from 'chalk';

export async function checkPrerequisites(type, options = {}) {
  const requirements = {
    'React Native': ['node', 'git', 'npm', 'java'],
    'React': ['node', 'git', 'npm'],
    'Next.js': ['node', 'git']
  };

  if (type === 'React Native' && options.targetPlatform !== 'Android') {
    requirements['React Native'].push('pod');
  }

  console.log(chalk.blue('\n🔍 Checking prerequisites...'));

  for (const cmd of requirements[type]) {
    try {
      await commandExists(cmd);
      console.log(chalk.green(`  ✔ ${cmd} is installed`));
    } catch {
      console.log(chalk.red(`  ✘ ${cmd} is missing. Please install it to continue.`));
      process.exit(1);
    }
  }
}