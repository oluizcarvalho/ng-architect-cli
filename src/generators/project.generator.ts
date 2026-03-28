import path from 'path';
import fs from 'fs-extra';
import { ProjectOptions, TemplateContext } from '../types';
import { renderTemplateToFile, getTemplatesDir } from '../utils/template';
import { createDirectory, writeJsonFile } from '../utils/files';
import { MfeGenerator } from './mfe.generator';
import { DesignSystemGenerator } from './design-system.generator';
import { CiCdGenerator } from './cicd.generator';
import { SsoGenerator } from './sso.generator';
import { I18nGenerator } from './i18n.generator';

export class ProjectGenerator {
  private targetDir: string;
  private templatesDir: string;
  private context: TemplateContext;

  constructor(private options: ProjectOptions) {
    this.targetDir = path.resolve(process.cwd(), options.name);
    this.templatesDir = getTemplatesDir();
    this.context = {
      projectName: options.name,
      prefix: options.prefix,
      features: options.features,
      year: new Date().getFullYear(),
    };
  }

  async generate(): Promise<void> {
    await createDirectory(this.targetDir);
    await this.generateBaseProject();

    if (this.options.features.microFrontends) {
      await new MfeGenerator(this.targetDir, this.options.name).generate();
    }
    if (this.options.features.designSystem) {
      await new DesignSystemGenerator(this.targetDir, this.options.name).generate();
    }
    if (this.options.features.cicd) {
      await new CiCdGenerator(this.targetDir, this.options.name).generate();
    }
    if (this.options.features.sso) {
      await new SsoGenerator(this.targetDir, this.options.name).generate();
    }
    if (this.options.features.i18n) {
      await new I18nGenerator(this.targetDir, this.options.name).generate();
    }
  }

  private async generateBaseProject(): Promise<void> {
    const templateDir = path.join(this.templatesDir, 'project');

    await renderTemplateToFile(
      path.join(templateDir, 'package.json.hbs'),
      path.join(this.targetDir, 'package.json'),
      this.context,
    );

    await renderTemplateToFile(
      path.join(templateDir, 'angular.json.hbs'),
      path.join(this.targetDir, 'angular.json'),
      this.context,
    );

    await renderTemplateToFile(
      path.join(templateDir, 'tsconfig.json.hbs'),
      path.join(this.targetDir, 'tsconfig.json'),
      this.context,
    );

    await renderTemplateToFile(
      path.join(templateDir, 'README.md.hbs'),
      path.join(this.targetDir, 'README.md'),
      this.context,
    );

    // Core app files
    const srcDir = path.join(this.targetDir, 'src');
    await createDirectory(path.join(srcDir, 'app'));
    await createDirectory(path.join(srcDir, 'assets'));
    await createDirectory(path.join(srcDir, 'environments'));

    await renderTemplateToFile(
      path.join(templateDir, 'src', 'main.ts.hbs'),
      path.join(srcDir, 'main.ts'),
      this.context,
    );

    await renderTemplateToFile(
      path.join(templateDir, 'src', 'app', 'app.module.ts.hbs'),
      path.join(srcDir, 'app', 'app.module.ts'),
      this.context,
    );

    await renderTemplateToFile(
      path.join(templateDir, 'src', 'app', 'app.component.ts.hbs'),
      path.join(srcDir, 'app', 'app.component.ts'),
      this.context,
    );

    await renderTemplateToFile(
      path.join(templateDir, 'src', 'app', 'app-routing.module.ts.hbs'),
      path.join(srcDir, 'app', 'app-routing.module.ts'),
      this.context,
    );

    await renderTemplateToFile(
      path.join(templateDir, 'src', 'environments', 'environment.ts.hbs'),
      path.join(srcDir, 'environments', 'environment.ts'),
      this.context,
    );

    await renderTemplateToFile(
      path.join(templateDir, 'src', 'environments', 'environment.prod.ts.hbs'),
      path.join(srcDir, 'environments', 'environment.prod.ts'),
      this.context,
    );

    // Config files
    await writeJsonFile(path.join(this.targetDir, '.editorconfig'), undefined as never);
    await fs.writeFile(
      path.join(this.targetDir, '.editorconfig'),
      `root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
`,
    );

    await fs.writeFile(
      path.join(this.targetDir, '.gitignore'),
      `node_modules/
dist/
.angular/
coverage/
*.log
.env
.DS_Store
`,
    );
  }
}
