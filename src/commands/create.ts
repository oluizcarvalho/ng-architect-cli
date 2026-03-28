import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { ProjectGenerator } from '../generators/project.generator';
import { ProjectOptions } from '../types';

export function createCommand(program: Command): void {
  program
    .command('create <name>')
    .description('Create a new Angular project with production-ready architecture')
    .option('--prefix <prefix>', 'Component selector prefix', 'app')
    .option('--skip-install', 'Skip npm install after generation', false)
    .option('--mfe', 'Include Micro Frontends setup', false)
    .option('--design-system', 'Include Design System', false)
    .option('--cicd', 'Include CI/CD pipelines', false)
    .option('--sso', 'Include SSO/Auth setup', false)
    .option('--i18n', 'Include internationalization', false)
    .option('--all', 'Include all features', false)
    .option('-y, --yes', 'Skip interactive prompts and use defaults', false)
    .action(async (name: string, options: Record<string, unknown>) => {
      console.log(chalk.bold.cyan('\n🏗  ng-architect — Angular Project Generator\n'));

      let projectOptions: ProjectOptions;

      if (options.yes) {
        projectOptions = {
          name,
          prefix: options.prefix as string || 'app',
          features: {
            microFrontends: !!options.all || !!options.mfe,
            designSystem: !!options.all || !!options.designSystem,
            cicd: !!options.all || !!options.cicd,
            sso: !!options.all || !!options.sso,
            i18n: !!options.all || !!options.i18n,
          },
          skipInstall: !!options.skipInstall,
        };
      } else {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'prefix',
            message: 'Component selector prefix:',
            default: options.prefix || 'app',
          },
          {
            type: 'checkbox',
            name: 'features',
            message: 'Select features to include:',
            choices: [
              { name: 'Micro Frontends (Module Federation)', value: 'microFrontends', checked: !!options.all || !!options.mfe },
              { name: 'Design System (Component Library)', value: 'designSystem', checked: !!options.all || !!options.designSystem },
              { name: 'CI/CD Pipelines (GitHub Actions)', value: 'cicd', checked: !!options.all || !!options.cicd },
              { name: 'SSO / Authentication (OIDC)', value: 'sso', checked: !!options.all || !!options.sso },
              { name: 'Internationalization (i18n)', value: 'i18n', checked: !!options.all || !!options.i18n },
            ],
          },
          {
            type: 'confirm',
            name: 'skipInstall',
            message: 'Skip npm install?',
            default: !!options.skipInstall,
          },
        ]);

        const featureList: string[] = answers.features;
        projectOptions = {
          name,
          prefix: answers.prefix,
          features: {
            microFrontends: featureList.includes('microFrontends'),
            designSystem: featureList.includes('designSystem'),
            cicd: featureList.includes('cicd'),
            sso: featureList.includes('sso'),
            i18n: featureList.includes('i18n'),
          },
          skipInstall: answers.skipInstall,
        };
      }

      const spinner = ora('Generating project...').start();

      try {
        const generator = new ProjectGenerator(projectOptions);
        await generator.generate();
        spinner.succeed(chalk.green('Project generated successfully!'));

        console.log(chalk.cyan(`\n  cd ${name}`));
        if (!projectOptions.skipInstall) {
          console.log(chalk.cyan('  npm install'));
        }
        console.log(chalk.cyan('  ng serve\n'));
      } catch (error) {
        spinner.fail(chalk.red('Failed to generate project'));
        console.error(error);
        process.exit(1);
      }
    });
}
