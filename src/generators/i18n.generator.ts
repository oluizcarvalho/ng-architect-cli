import path from 'path';
import { renderTemplateToFile, getTemplatesDir } from '../utils/template';
import { createDirectory } from '../utils/files';

export class I18nGenerator {
  private templatesDir: string;

  constructor(
    private targetDir: string,
    private projectName: string,
  ) {
    this.templatesDir = path.join(getTemplatesDir(), 'i18n');
  }

  async generate(): Promise<void> {
    const context = { projectName: this.projectName };

    const i18nDir = path.join(this.targetDir, 'src', 'app', 'core', 'i18n');
    await createDirectory(i18nDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'i18n.module.ts.hbs'),
      path.join(i18nDir, 'i18n.module.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'translate-loader.factory.ts.hbs'),
      path.join(i18nDir, 'translate-loader.factory.ts'),
      context,
    );

    // Translation files
    const assetsDir = path.join(this.targetDir, 'src', 'assets', 'i18n');
    await createDirectory(assetsDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'en.json.hbs'),
      path.join(assetsDir, 'en.json'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'pt-BR.json.hbs'),
      path.join(assetsDir, 'pt-BR.json'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'es.json.hbs'),
      path.join(assetsDir, 'es.json'),
      context,
    );
  }
}
