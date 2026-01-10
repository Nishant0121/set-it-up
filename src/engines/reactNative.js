import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupReactNative(answers, rnAnswers) {
  const spinner = ora('Initializing React Native project...').start();
  try {
    const { projectName, packageManager } = answers;
    const isTypescript = rnAnswers.language === 'TypeScript';
    
    // Basic init command using the community CLI for latest version
    const args = ['--yes', '@react-native-community/cli@latest', 'init', projectName, '--skip-install'];
    
    await execa('npx', args);

    // Handle language selection (rename App.tsx to App.jsx if JS is selected)
    const appTsxPath = path.join(projectName, 'App.tsx');
    const appJsxPath = path.join(projectName, 'App.jsx');
    
    if (!isTypescript && await fs.pathExists(appTsxPath)) {
        await fs.rename(appTsxPath, appJsxPath);
    }

    spinner.text = 'Installing dependencies...';
    
    // Install dependencies using the selected package manager
    await execa(packageManager, ['install'], { cwd: projectName });

    if (rnAnswers.addNavigation) {
      spinner.text = 'Installing React Navigation...';
      const installCmd = packageManager === 'npm' ? 'install' : 'add';
      const packages = [
        '@react-navigation/native',
        'react-native-screens',
        'react-native-safe-area-context',
        '@react-navigation/native-stack'
      ];
      
      await execa(packageManager, [installCmd, ...packages], { cwd: projectName });

      spinner.text = 'Configuring Navigation...';
      
      const templateFileName = isTypescript ? 'navigation.tsx' : 'navigation.jsx';
      const templatePath = path.join(__dirname, '..', 'templates', 'reactNative', templateFileName);
      
      const content = await fs.readFile(templatePath, 'utf8');

      const targetPath = isTypescript ? appTsxPath : appJsxPath;
      
      await fs.writeFile(targetPath, content);
    }

    spinner.succeed(chalk.green(`Project ${projectName} created successfully! 🚀`));
  } catch (error) {
    spinner.fail('Setup failed.');
    console.error(error);
  }
}