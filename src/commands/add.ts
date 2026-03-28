import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { MfeGenerator } from '../generators/mfe.generator';
import { DesignSystemGenerator } from '../generators/design-system.generator';
import { CiCdGenerator } from '../generators/cicd.generator';
import { SsoGenerator } from '../generators/sso.generator';
import { I18nGenerator } from '../generators/i18n.generator';

const FEATURES = ['mfe', 'design-system', 'cicd', 'sso', 'i18n'] as const;
type Feature = typeof FEATURES[number];

const GENERATORS: Record<Feature, new (targetDir: string, projectName: string) => { generate(): Promise<void> }> = {
  'mfe': MfeGenerator,
  'design-system': DesignSystemGenerator,
  'cicd': CiCdGenerator,
  'sso': SsoGenerator,
  'i18n': I18nGenerator,
};

export function addCommand(program: Command): void {
  program
    .command('add <feature>')
    .description(`Add a feature to an existing project. Features: ${FEATURES.join(', ')}`)
    .option('--target <dir>', 'Target project directory', '.')
    .action(async (feature: string, options: { target: string }) => {
      if (!FEATURES.includes(feature as Feature)) {
        console.error(chalk.red(`Unknown feature: ${feature}`));
        console.log(chalk.yellow(`Available features: ${FEATURES.join(', ')}`));
        process.exit(1);
      }

      const targetDir = path.resolve(options.target);
      const pkgPath = path.join(targetDir, 'package.json');

      if (!await fs.pathExists(pkgPath)) {
        console.error(chalk.red('No package.json found. Are you in an Angular project?'));
        process.exit(1);
      }

      const pkg = await fs.readJson(pkgPath);
      const projectName = pkg.name || path.basename(targetDir);

      const spinner = ora(`Adding ${feature}...`).start();

      try {
        const GeneratorClass = GENERATORS[feature as Feature];
        const generator = new GeneratorClass(targetDir, projectName);
        await generator.generate();
        spinner.succeed(chalk.green(`${feature} added successfully!`));
      } catch (error) {
        spinner.fail(chalk.red(`Failed to add ${feature}`));
        console.error(error);
        process.exit(1);
      }
    });
}
