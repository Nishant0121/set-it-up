# set-it-up 🚀

**set-it-up** is a powerful CLI tool designed to forge new projects effortlessly. It automates the boilerplate setup, handles prerequisites, and gets you coding faster with pre-configured templates.

## ✨ Features

- **Interactive Wizard**: Easy-to-use terminal interface to guide you through project creation.
- **Prerequisite Checks**: Automatically checks for necessary tools (Node.js, Git, etc.) before starting.
- **React Native Support**:
  - fast setup with `@react-native-community/cli`.
  - Option to choose between **TypeScript** and **JavaScript**.
  - One-click **React Navigation** integration with boilerplate code.
- **Smart Defaults**: Uses the user's preferred package manager (npm, yarn, pnpm).

## 📦 Installation

To use `set-it-up` globally on your system:

```bash
# Install globally from the current directory (for development)
npm install -g .

# Or if published to npm (future)
# npm install -g set-it-up
```

## 🛠️ Usage

Simply run the `setup` command in your terminal:

```bash
setup
```

Follow the on-screen prompts to:
1. Choose your project type (currently supports **React Native**).
2. Enter a project name.
3. Select your package manager.
4. Configure specific options (e.g., add Navigation).

### Example Workflow

```text
🚀 Welcome to Launchpad - Your Project Forge 🛠️

? What do you want to build today? React Native
? Enter your project name: my-app
? Select your preferred package manager: npm
? Which language do you want to use? TypeScript
? Would you like to add React Navigation setup? Yes
```

## 🗺️ Roadmap

- [x] React Native (JS/TS + Navigation)
- [ ] Next.js Support
- [ ] Custom GitHub Templates
- [ ] Backend Templates (Express, NestJS)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements.

## 📄 License

ISC
