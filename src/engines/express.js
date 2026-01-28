import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

import { 
  getPackageJson, 
  getTsConfig, 
  getIndex, 
  getRouteIndex, 
  getController,
  getDatabaseConfig,
  getPrismaClient
} from '../templates/express/main.js';

export async function setupExpress(answers, expressAnswers) {
  const spinner = ora('Initializing Express project...').start();
  try {
    const { projectName, packageManager } = answers;
    const isTypescript = expressAnswers.language === 'TypeScript';
    const database = expressAnswers.database;
    const projectPath = path.join(process.cwd(), projectName);

    // 1. Create Project Directory
    await fs.ensureDir(projectPath);

    // 2. Create package.json
    spinner.text = 'Creating package.json...';
    const packageJsonContent = getPackageJson(projectName, isTypescript, database);
    await fs.writeFile(path.join(projectPath, 'package.json'), packageJsonContent);

    // 3. Create tsconfig.json (if TypeScript)
    if (isTypescript) {
      spinner.text = 'Creating tsconfig.json...';
      const tsConfigContent = getTsConfig();
      await fs.writeFile(path.join(projectPath, 'tsconfig.json'), tsConfigContent);
    }

    // 4. Create Source Directories and Files
    spinner.text = 'Generating project structure...';
    const srcDir = path.join(projectPath, 'src');
    const routesDir = path.join(srcDir, 'routes');
    const controllersDir = path.join(srcDir, 'controllers');

    await fs.ensureDir(srcDir);
    await fs.ensureDir(routesDir);
    await fs.ensureDir(controllersDir);

    const ext = isTypescript ? 'ts' : 'js';

    // Handle Database Setup
    let envContent = 'PORT=3000\n';

    if (database === 'MongoDB (Mongoose)') {
      const configDir = path.join(srcDir, 'config');
      await fs.ensureDir(configDir);
      await fs.writeFile(path.join(configDir, `db.${ext}`), getDatabaseConfig(isTypescript));
      envContent += 'MONGO_URI=mongodb://127.0.0.1:27017/my-awesome-app\n';
    } else if (database === 'PostgreSQL (Prisma)') {
      const configDir = path.join(srcDir, 'config');
      const prismaDir = path.join(projectPath, 'prisma');
      
      await fs.ensureDir(configDir);
      await fs.ensureDir(prismaDir);
      
      // Create Prisma Client Instance
      await fs.writeFile(path.join(configDir, `client.${ext}`), getPrismaClient(isTypescript));
      
      // Create schema.prisma
      const schemaPrisma = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
`;
      await fs.writeFile(path.join(prismaDir, 'schema.prisma'), schemaPrisma);
      
      envContent += 'DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"\n';
    }

    // src/index.ts or src/index.js
    await fs.writeFile(path.join(srcDir, `index.${ext}`), getIndex(isTypescript, database));

    // src/routes/index.ts or src/routes/index.js
    await fs.writeFile(path.join(routesDir, `index.${ext}`), getRouteIndex(isTypescript));

    // src/controllers/exampleController.ts or src/controllers/exampleController.js
    await fs.writeFile(path.join(controllersDir, `exampleController.${ext}`), getController(isTypescript));

    // Create .env file
    await fs.writeFile(path.join(projectPath, '.env'), envContent);

    // Create .gitignore
    const gitignoreContent = `node_modules
.env
dist
.DS_Store
coverage
`;
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);


    // 5. Install Dependencies
    spinner.text = 'Installing dependencies...';
    const installCmd = packageManager === 'npm' ? 'install' : 'add';
    await execa(packageManager, [installCmd], { cwd: projectPath });

    // 6. Generate Prisma Client (if Prisma selected)
    if (database === 'PostgreSQL (Prisma)') {
        spinner.text = 'Generating Prisma Client...';
        await execa('npx', ['prisma', 'generate'], { cwd: projectPath });
    }

    spinner.succeed(chalk.green(`Express project ${projectName} created successfully! 🚀`));
    console.log(chalk.cyan(`
To get started:
  cd ${projectName}
  ${packageManager} run dev`));

  } catch (error) {
    spinner.fail('Setup failed.');
    console.error(error);
  }
}
