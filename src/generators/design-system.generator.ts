import path from 'path';
import { renderTemplateToFile, getTemplatesDir } from '../utils/template';
import { createDirectory } from '../utils/files';

export class DesignSystemGenerator {
  private templatesDir: string;

  constructor(
    private targetDir: string,
    private projectName: string,
  ) {
    this.templatesDir = path.join(getTemplatesDir(), 'design-system');
  }

  async generate(): Promise<void> {
    const context = { projectName: this.projectName };

    const libDir = path.join(this.targetDir, 'projects', 'design-system', 'src', 'lib');
    await createDirectory(libDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'public-api.ts.hbs'),
      path.join(this.targetDir, 'projects', 'design-system', 'src', 'public-api.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'design-system.module.ts.hbs'),
      path.join(libDir, 'design-system.module.ts'),
      context,
    );

    // Button component
    const buttonDir = path.join(libDir, 'components', 'button');
    await createDirectory(buttonDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'button.component.ts.hbs'),
      path.join(buttonDir, 'button.component.ts'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'button.component.html.hbs'),
      path.join(buttonDir, 'button.component.html'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'button.component.scss.hbs'),
      path.join(buttonDir, 'button.component.scss'),
      context,
    );

    // Tokens
    const tokensDir = path.join(libDir, 'tokens');
    await createDirectory(tokensDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'tokens.scss.hbs'),
      path.join(tokensDir, '_tokens.scss'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'ng-package.json.hbs'),
      path.join(this.targetDir, 'projects', 'design-system', 'ng-package.json'),
      context,
    );
  }
}
