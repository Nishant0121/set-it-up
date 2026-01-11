# set-it-up

set-it-up is a high-performance CLI tool designed to bootstrap and forge new projects with pre-configured templates, prerequisite checking, and interactive setup.

## Features

- Interactive Wizard: Professional terminal interface to guide you through project configuration.
- Prerequisite Checks: Automatically verifies necessary tools (Node.js, Git, etc.) are installed before starting.
- React Support (Vite):
  - Fast project scaffolding using Vite.
  - Automated Tailwind CSS v4 setup.
  - Standardized project structure (src/pages, src/components).
  - Integrated Layout and Navbar with React Router DOM support.
  - Optional Shadcn UI initialization and component addition.
  - Global AppContext setup for state management.
  - Automatic TypeScript to JavaScript conversion for Shadcn UI if JS is selected.
- React Native Support:
  - Rapid initialization with @react-native-community/cli.
  - Full support for both TypeScript and JavaScript.
  - Automated React Navigation integration with boilerplate code.
- Smart Defaults: Supports npm, yarn, and pnpm based on user preference.

## Installation

To use set-it-up globally on your system:

```bash
npm install -g @nishant0121/set-it-up
```

Using npx:

```bash
npx @nishant0121/set-it-up
```

## Usage

Run the tool in your terminal:

```bash
forge
```

Follow the prompts to:

1. Select your project type (React or React Native).
2. Provide a project name.
3. Choose your preferred package manager.
4. Select language (TypeScript or JavaScript).
5. Configure additional features (Shadcn UI, Router, Context, Navigation).

### Example Workflow

```text
SET-IT-UP

Hi there! Let's configure your new project.

? What do you want to build today? React
? Enter your project name: my-web-app
? Select your preferred package manager: npm
? Which language do you want to use? TypeScript
? Would you like to setup Shadcn UI? Yes
? Would you like to add React Router DOM? Yes
? Would you like to setup a global AppContext? Yes
```

## Contributing

Contributions are welcome. Please open an issue or submit a pull request for improvements.

## License

ISC
