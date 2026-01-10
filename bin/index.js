#!/usr/bin/env node

import { program } from 'commander';
import { mainWizard } from '../src/wizard.js';

program
  .version('1.0.0')
  .description('A powerful CLI to forge new projects')
  .action(async () => {
    await mainWizard();
  });

program.parse(process.argv);
