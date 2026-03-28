import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';

Handlebars.registerHelper('ifFeature', function (this: unknown, feature: boolean, options: Handlebars.HelperOptions) {
  return feature ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('kebabCase', (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();
});

Handlebars.registerHelper('pascalCase', (str: string) => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
});

export async function renderTemplate(templatePath: string, context: Record<string, unknown> | object): Promise<string> {
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);
  return template(context);
}

export async function renderTemplateToFile(
  templatePath: string,
  outputPath: string,
  context: Record<string, unknown> | object,
): Promise<void> {
  const content = await renderTemplate(templatePath, context);
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, content, 'utf-8');
}

export function getTemplatesDir(): string {
  return path.resolve(__dirname, '../../templates');
}
