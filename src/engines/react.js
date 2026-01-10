import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

// Import templates
import { getNavbar, getLayout } from '../templates/react/components.js';
import { getHome, getAbout } from '../templates/react/pages.js';
import { getApp, getAppContext, getViteConfig } from '../templates/react/main.js';

export async function setupReact(answers, reactAnswers) {
  const spinner = ora('Initializing React project with Vite...').start();
  try {
    const { projectName, packageManager } = answers;
    const isTypescript = reactAnswers.language === 'TypeScript';
    // Force TypeScript template if Shadcn is selected, otherwise use user choice
    const template = (isTypescript || reactAnswers.addShadcn) ? 'react-ts' : 'react';

    // 1. Scaffold with Vite
    await execa('npm', ['create', 'vite@latest', projectName, '--', '--template', template]);

    spinner.text = 'Installing dependencies...';
    // 2. Install Dependencies
    await execa(packageManager, ['install'], { cwd: projectName });
    
    // Install Node types for path resolution if TypeScript OR if we forced TS for Shadcn
    if (isTypescript || reactAnswers.addShadcn) {
        await execa(packageManager, [packageManager === 'npm' ? 'install' : 'add', '-D', '@types/node'], { cwd: projectName });
    }

    spinner.text = 'Setting up Tailwind CSS v4...';
    // 3. Install Tailwind CSS & Vite Plugin
    const installCmd = packageManager === 'npm' ? 'install' : 'add';
    await execa(packageManager, [installCmd, 'tailwindcss', '@tailwindcss/vite'], { cwd: projectName });  

    // 4. Configure TSConfig for aliases (if TypeScript OR Shadcn forced TS)
    if (isTypescript || reactAnswers.addShadcn) {
        const tsConfigPath = path.join(projectName, 'tsconfig.json');
        const tsConfigAppPath = path.join(projectName, 'tsconfig.app.json');

        const readJsonSafe = async (filePath) => {
            const content = await fs.readFile(filePath, 'utf8');
            // Simple regex to strip comments (// and /* */)
            const jsonContent = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');        
            return JSON.parse(jsonContent);
        };

        // Update tsconfig.json
        if (await fs.pathExists(tsConfigPath)) {
            try {
                const tsConfig = await readJsonSafe(tsConfigPath);
                tsConfig.compilerOptions = tsConfig.compilerOptions || {};
                tsConfig.compilerOptions.baseUrl = ".";
                tsConfig.compilerOptions.paths = tsConfig.compilerOptions.paths || {};
                tsConfig.compilerOptions.paths["@/*"] = ["./src/*"];

                await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
            } catch (e) {
                console.warn('Could not update tsconfig.json automatically. Please add baseUrl and paths manually.');
            }
        }

        // Update tsconfig.app.json
        if (await fs.pathExists(tsConfigAppPath)) {
            try {
                const tsConfigApp = await readJsonSafe(tsConfigAppPath);
                tsConfigApp.compilerOptions = tsConfigApp.compilerOptions || {};
                tsConfigApp.compilerOptions.baseUrl = ".";
                tsConfigApp.compilerOptions.paths = tsConfigApp.compilerOptions.paths || {};
                tsConfigApp.compilerOptions.paths["@/*"] = ["./src/*"];

                await fs.writeJson(tsConfigAppPath, tsConfigApp, { spaces: 2 });
            } catch (e) {
                console.warn('Could not update tsconfig.app.json automatically.');
            }
        }
    }

    // 5. Configure Vite (vite.config.js/ts)
    const viteConfigContent = getViteConfig();
    const viteConfigPath = path.join(projectName, (isTypescript || reactAnswers.addShadcn) ? 'vite.config.ts' : 'vite.config.js');
    await fs.writeFile(viteConfigPath, viteConfigContent);

    // 6. Configure CSS (src/index.css)
    const indexCssPath = path.join(projectName, 'src', 'index.css');
    await fs.writeFile(indexCssPath, '@import "tailwindcss";');

    // Handle Optional Features
    if (reactAnswers.addShadcn) {
      spinner.stop();
      console.log(chalk.blue('\n🎨 Initializing Shadcn UI...'));

      try {
          await execa('npx', ['shadcn@latest', 'init', '-d'], {
              cwd: projectName,
              stdio: 'inherit'
          });

          console.log(chalk.green('✔ Shadcn UI initialized.'));

          // Add a button component as requested
          console.log(chalk.blue('Adding Button component...'));
          await execa('npx', ['shadcn@latest', 'add', 'button', '-y'], {
            cwd: projectName,
            stdio: 'inherit'
          });

      } catch (e) {
          console.warn(chalk.yellow('⚠ Shadcn UI setup encountered an issue. You might need to run "npx shadcn@latest init" manually.'));
      }
      
      spinner.start();
    }

    if (reactAnswers.addRouter) {
      spinner.text = 'Installing React Router DOM...';
      await execa(packageManager, [installCmd, 'react-router-dom'], { cwd: projectName });
    }

    if (reactAnswers.addContext) {
      spinner.text = 'Creating AppContext...';
      const contextDir = path.join(projectName, 'src', 'context');
      await fs.ensureDir(contextDir);
      
      const contextFile = (isTypescript || reactAnswers.addShadcn) ? 'AppContext.tsx' : 'AppContext.jsx'; 
      const contextContent = getAppContext({ isTypescript, addShadcn: reactAnswers.addShadcn });
      await fs.writeFile(path.join(contextDir, contextFile), contextContent);
    }

    // Rewrite App.jsx/tsx and create structure
    spinner.text = 'Generating Project Structure...';
    await generateProjectStructure(projectName, (isTypescript || reactAnswers.addShadcn), reactAnswers);

    // FINAL STEP: Downgrade to JS if requested but forced to TS
    if (!isTypescript && reactAnswers.addShadcn) {
        spinner.text = 'Converting to JavaScript...';
        await convertToJs(projectName);
    }

    spinner.succeed(chalk.green(`Project ${projectName} created successfully! 🚀`));
    console.log(chalk.cyan(`
To get started:
  cd ${projectName}
  ${packageManager} run dev`));

  } catch (error) {
    spinner.fail('Setup failed.');
    console.error(error);
  }
}

async function generateProjectStructure(projectName, isTypescript, answers) {
  const ext = isTypescript ? 'tsx' : 'jsx';
  const componentsDir = path.join(projectName, 'src', 'components');
  const pagesDir = path.join(projectName, 'src', 'pages');
  
  await fs.ensureDir(componentsDir);
  await fs.ensureDir(pagesDir);

  // 1. Create Navbar
  const navbarContent = getNavbar(answers);
  await fs.writeFile(path.join(componentsDir, `Navbar.${ext}`), navbarContent);

  // 2. Create Layout (with Outlet)
  const layoutContent = getLayout(answers);
  await fs.writeFile(path.join(componentsDir, `Layout.${ext}`), layoutContent);

  // 3. Create Pages (Home & About)
  const homeContent = getHome(answers);
  await fs.writeFile(path.join(pagesDir, `Home.${ext}`), homeContent);

  const aboutContent = getAbout();
  await fs.writeFile(path.join(pagesDir, `About.${ext}`), aboutContent);

  // 4. Update App.jsx/tsx
  const finalAppContent = getApp(answers);
  await fs.writeFile(path.join(projectName, 'src', `App.${ext}`), finalAppContent);
}

async function convertToJs(projectName) {
    const srcDir = path.join(projectName, 'src');
    
    // Recursive function to rename .tsx -> .jsx and .ts -> .js
    async function renameFiles(dir) {
        const items = await fs.readdir(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = await fs.stat(fullPath);
            
            if (stat.isDirectory()) {
                await renameFiles(fullPath);
            } else {
                if (item.endsWith('.tsx')) {
                    await fs.rename(fullPath, fullPath.replace('.tsx', '.jsx'));
                } else if (item.endsWith('.ts') && !item.endsWith('.d.ts') && item !== 'vite.config.ts') {
                     // Careful not to rename config files if they are in root (this is in src)
                     await fs.rename(fullPath, fullPath.replace('.ts', '.js'));
                }
            }
        }
    }

    await renameFiles(srcDir);
    
    // Also rename root files if necessary
    const mainTsx = path.join(projectName, 'src', 'main.tsx'); // Standard Vite entry
    const mainJsx = path.join(projectName, 'src', 'main.jsx');
    if (await fs.pathExists(mainTsx)) await fs.rename(mainTsx, mainJsx);
}
