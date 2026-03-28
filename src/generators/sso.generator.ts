import path from 'path';
import { renderTemplateToFile, getTemplatesDir } from '../utils/template';
import { createDirectory } from '../utils/files';

export class SsoGenerator {
  private templatesDir: string;

  constructor(
    private targetDir: string,
    private projectName: string,
  ) {
    this.templatesDir = path.join(getTemplatesDir(), 'sso');
  }

  async generate(): Promise<void> {
    const context = { projectName: this.projectName };

    const authDir = path.join(this.targetDir, 'src', 'app', 'core', 'auth');
    await createDirectory(authDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'auth.module.ts.hbs'),
      path.join(authDir, 'auth.module.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'auth.service.ts.hbs'),
      path.join(authDir, 'auth.service.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'auth.guard.ts.hbs'),
      path.join(authDir, 'auth.guard.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'auth.interceptor.ts.hbs'),
      path.join(authDir, 'auth.interceptor.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'auth-config.ts.hbs'),
      path.join(authDir, 'auth-config.ts'),
      context,
    );
  }
}
