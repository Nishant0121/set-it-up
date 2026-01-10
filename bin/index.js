#!/usr/bin/env node

import { program } from 'commander';
import { mainWizard } from '../src/wizard.js';

program
  .version('1.0.0')
  .description('A powerful CLI to forge new projects')
  .action(async () => {
    try {
      await mainWizard();
    } catch (error) {
      if (error.name === 'ExitPromptError' || error.message.includes('User force closed the prompt')) {
        console.log('\n👋 Goodbye!');
        process.exit(0);
      } else {
        console.error(error);
        process.exit(1);
      }
    }
  });

program.parse(process.argv);
