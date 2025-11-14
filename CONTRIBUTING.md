# Contributing to Pomodoro Timer PWA

Thank you for considering contributing to this project! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Suggesting Features

We love new ideas! To suggest a feature:

- Open an issue with the `enhancement` label
- Describe the feature and its benefits
- Explain how it would work
- Include mockups or examples if possible

### Pull Requests

1. **Fork the repository** and create your branch from `main`

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   - Ensure the app builds without errors
   - Test on multiple browsers if possible
   - Check that PWA features still work

4. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     - `feat: add dark mode toggle`
     - `fix: resolve timer reset bug`
     - `docs: update installation instructions`

5. **Push to your fork** and submit a pull request

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Wait for review**
   - Address any feedback from reviewers
   - Be patient and respectful

## Development Setup

1. Clone your fork:

   ```bash
   git clone https://github.com/your-username/pomodoro-timer.git
   cd pomodoro-timer
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

## Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components and hooks
- Keep components small and focused
- Add JSDoc comments for functions
- Use meaningful variable names

## Project Structure

- `client/src/components/` - Reusable UI components
- `client/src/hooks/` - Custom React hooks
- `client/src/lib/` - Utility functions and helpers
- `client/src/pages/` - Page components
- `client/public/` - Static assets and PWA files

## Testing

Before submitting a PR:

- Test the timer functionality
- Verify task management works
- Check IndexedDB persistence
- Test Service Worker offline functionality
- Ensure responsive design on mobile

## Questions?

Feel free to open an issue for any questions about contributing!

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

---

Thank you for contributing! 🎉
