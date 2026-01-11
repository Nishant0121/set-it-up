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
      
      // Create modular folder structure
      const srcDir = path.join(projectName, 'src');
      const pagesDir = path.join(srcDir, 'pages');
      const componentsDir = path.join(srcDir, 'components');

      await fs.ensureDir(pagesDir);
      await fs.ensureDir(componentsDir);

      const ext = isTypescript ? 'tsx' : 'jsx';
      const templateBase = path.join(__dirname, '..', 'templates', 'reactNative', 'modular');

      // Copy App file
      const appContent = await fs.readFile(path.join(templateBase, `App.${ext}`), 'utf8');
      const targetAppPath = isTypescript ? appTsxPath : appJsxPath;
      await fs.writeFile(targetAppPath, appContent);

      // Copy Screens
      const homeContent = await fs.readFile(path.join(templateBase, 'pages', `HomeScreen.${ext}`), 'utf8');
      await fs.writeFile(path.join(pagesDir, `HomeScreen.${ext}`), homeContent);

      const detailsContent = await fs.readFile(path.join(templateBase, 'pages', `DetailsScreen.${ext}`), 'utf8');
      await fs.writeFile(path.join(pagesDir, `DetailsScreen.${ext}`), detailsContent);
    }

    spinner.succeed(chalk.green(`Project ${projectName} created successfully! 🚀`));
  } catch (error) {
    spinner.fail('Setup failed.');
    console.error(error);
  }
}