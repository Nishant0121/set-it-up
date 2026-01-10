import inquirer from 'inquirer';
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { checkPrerequisites } from './utils/checkEnv.js';
import { setupReactNative } from './engines/reactNative.js';

export async function mainWizard() {
  // Clear the console for a fresh start
  console.clear();

  // Create a beautiful header
  const title = `
   SET - IT - UP   
`;
  
  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    backgroundColor: '#1b1b1b'
  };

  const welcomeMessage = boxen(
    gradient.pastel.multiline(title) + 
    '\n' + 
    chalk.white('🚀 Ready to launch your next idea?'),
    boxenOptions
  );

  console.log(welcomeMessage);
  
  console.log(chalk.hex('#4285F4')('  Hi there! Let\'s configure your new project.\n'));

  const answers = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'projectType',
      message: 'What do you want to build today?',
      choices: ['React Native', 'Next.js (Coming Soon)', 'Custom GitHub Template'],
    },
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter your project name:',
      default: 'my-awesome-app',
      validate: (input) => {
          if (/^([a-z0-9\-\_])+$/.test(input)) return true;
          return 'Project name may only include lowercase letters, numbers, underscores and hashes.';
      }
    },
    {
      type: 'rawlist',
      name: 'packageManager',
      message: 'Select your preferred package manager:',
      choices: ['npm', 'yarn', 'pnpm'],
    }
  ]);

  if (answers.projectType === 'React Native') {
    await checkPrerequisites('React Native');

    // Additional RN specific questions
    const rnAnswers = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'language',
        message: 'Which language do you want to use?',
        choices: ['TypeScript', 'JavaScript'],
      },
      {
        type: 'confirm',
        name: 'addNavigation',
        message: 'Would you like to add React Navigation setup?',
      }
    ]);

    await setupReactNative(answers, rnAnswers);
  } else {
      console.log(chalk.yellow('\n🚧 This feature is coming soon! Stay tuned.\n'));
  }
}
