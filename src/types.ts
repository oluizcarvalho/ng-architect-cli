export interface ProjectFeatures {
  microFrontends: boolean;
  designSystem: boolean;
  cicd: boolean;
  sso: boolean;
  i18n: boolean;
}

export interface ProjectOptions {
  name: string;
  prefix: string;
  features: ProjectFeatures;
  skipInstall: boolean;
}

export interface TemplateContext {
  projectName: string;
  prefix: string;
  features: ProjectFeatures;
  year: number;
}
