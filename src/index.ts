#!/usr/bin/env node

import { Command } from 'commander';
import { createCommand } from './commands/create';
import { addCommand } from './commands/add';

const program = new Command();

program
  .name('ng-architect')
  .description('CLI to generate production-ready Angular projects with Micro Frontends, Design System, CI/CD, SSO, and i18n')
  .version('1.0.0');

createCommand(program);
addCommand(program);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
