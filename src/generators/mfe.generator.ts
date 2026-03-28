import path from 'path';
import { renderTemplateToFile, getTemplatesDir } from '../utils/template';
import { createDirectory } from '../utils/files';

export class MfeGenerator {
  private templatesDir: string;

  constructor(
    private targetDir: string,
    private projectName: string,
  ) {
    this.templatesDir = path.join(getTemplatesDir(), 'mfe');
  }

  async generate(): Promise<void> {
    const context = { projectName: this.projectName };

    await renderTemplateToFile(
      path.join(this.templatesDir, 'webpack.config.js.hbs'),
      path.join(this.targetDir, 'webpack.config.js'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'webpack.prod.config.js.hbs'),
      path.join(this.targetDir, 'webpack.prod.config.js'),
      context,
    );

    // Shell app bootstrap
    const shellDir = path.join(this.targetDir, 'src', 'app', 'shell');
    await createDirectory(shellDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'shell.module.ts.hbs'),
      path.join(shellDir, 'shell.module.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'shell-routing.module.ts.hbs'),
      path.join(shellDir, 'shell-routing.module.ts'),
      context,
    );

    // Micro frontend loader
    const mfeDir = path.join(this.targetDir, 'src', 'app', 'shared', 'mfe');
    await createDirectory(mfeDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'mfe-loader.service.ts.hbs'),
      path.join(mfeDir, 'mfe-loader.service.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'mfe-wrapper.component.ts.hbs'),
      path.join(mfeDir, 'mfe-wrapper.component.ts'),
      context,
    );
  }
}
