import path from 'path';
import { renderTemplateToFile, getTemplatesDir } from '../utils/template';
import { createDirectory } from '../utils/files';

export class CiCdGenerator {
  private templatesDir: string;

  constructor(
    private targetDir: string,
    private projectName: string,
  ) {
    this.templatesDir = path.join(getTemplatesDir(), 'cicd');
  }

  async generate(): Promise<void> {
    const context = { projectName: this.projectName };

    const ghDir = path.join(this.targetDir, '.github', 'workflows');
    await createDirectory(ghDir);

    await renderTemplateToFile(
      path.join(this.templatesDir, 'ci.yml.hbs'),
      path.join(ghDir, 'ci.yml'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'cd.yml.hbs'),
      path.join(ghDir, 'cd.yml'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'Dockerfile.hbs'),
      path.join(this.targetDir, 'Dockerfile'),
      context,
    );

    await renderTemplateToFile(
      path.join(this.templatesDir, 'nginx.conf.hbs'),
      path.join(this.targetDir, 'nginx.conf'),
      context,
    );
  }
}
