import inquirer from 'inquirer';

console.log('Testing inquirer...');
try {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'test',
      message: 'Does this work?',
      choices: ['Yes', 'No'],
    }
  ]);
  console.log('Answers:', answers);
} catch (error) {
  console.error('Error:', error);
}
