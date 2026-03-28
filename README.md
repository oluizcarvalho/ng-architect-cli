# ng-architect-cli

A powerful CLI to generate **production-ready Angular projects** with enterprise-grade architecture out of the box.

## Features

- **Micro Frontends** — Module Federation setup with shell app, remote loader, and wrapper components
- **Design System** — Angular component library with tokens, theming, and reusable components (Button, etc.)
- **CI/CD** — GitHub Actions workflows for CI/CD, multi-stage Dockerfile, and Nginx configuration
- **SSO / Authentication** — OIDC-based auth with angular-oauth2-oidc (guard, interceptor, service)
- **Internationalization (i18n)** — @ngx-translate setup with en, pt-BR, and es translations

## Installation

```bash
npm install -g ng-architect-cli
```

## Usage

### Create a new project

```bash
# Interactive mode
ng-architect create my-app

# Non-interactive with all features
ng-architect create my-app --all -y

# Select specific features
ng-architect create my-app --mfe --design-system --cicd --sso --i18n

# Custom prefix
ng-architect create my-app --prefix myorg
```

### Add a feature to an existing project

```bash
ng-architect add mfe
ng-architect add design-system
ng-architect add cicd
ng-architect add sso
ng-architect add i18n

# Specify target directory
ng-architect add cicd --target ./my-project
```

## Available Features

| Feature | Flag | Description |
|---------|------|-------------|
| Micro Frontends | `--mfe` | Webpack Module Federation, shell routing, MFE loader service |
| Design System | `--design-system` | Component library with tokens, Button component, ng-packagr |
| CI/CD | `--cicd` | GitHub Actions (CI + CD), Dockerfile, Nginx config |
| SSO | `--sso` | OIDC auth module, guard, interceptor, token management |
| i18n | `--i18n` | @ngx-translate setup, translation files (en, pt-BR, es) |

## Generated Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/          # SSO (when enabled)
│   │   │   └── i18n/          # i18n (when enabled)
│   │   ├── shared/
│   │   │   └── mfe/           # MFE loader (when enabled)
│   │   ├── shell/             # Shell module (when MFE enabled)
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   │   └── i18n/              # Translation files (when enabled)
│   ├── environments/
│   └── main.ts
├── projects/
│   └── design-system/         # Design System library (when enabled)
├── .github/
│   └── workflows/             # CI/CD (when enabled)
│       ├── ci.yml
│       └── cd.yml
├── webpack.config.js          # MFE config (when enabled)
├── Dockerfile                 # Docker (when CI/CD enabled)
├── nginx.conf                 # Nginx (when CI/CD enabled)
├── angular.json
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Commander** — CLI framework
- **Inquirer** — Interactive prompts
- **Chalk** — Terminal styling
- **Ora** — Spinners
- **Handlebars** — Template engine
- **fs-extra** — File system utilities

## Development

```bash
# Clone the repo
git clone https://github.com/oluizcarvalho/ng-architect-cli.git
cd ng-architect-cli

# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js create my-app --all -y

# Or use ts-node
npm run dev -- create my-app --all -y
```

## License

MIT
