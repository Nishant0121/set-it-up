import inquirer from 'inquirer';
import chalk from 'chalk';
import { checkPrerequisites } from './utils/checkEnv.js';
import { setupReactNative } from './engines/reactNative.js';

export async function mainWizard() {
  console.log(chalk.bold.magenta('\n🚀 Welcome to Launchpad - Your Project Forge 🛠️\n'));

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
  }
}
