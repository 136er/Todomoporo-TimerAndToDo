# GitHub Copilot Custom Agents

This directory contains custom agent configurations for GitHub Copilot to assist with this project.

## Available Agents

### `pomodoro-fullstack-expert`
**Purpose**: Full-stack development expert specialized in this Pomodoro Timer PWA project.

**Specialization**:
- React 19, TypeScript, PWA development
- Code review and quality assurance
- Bug hunting and fixing
- Performance optimization
- Feature enhancement

**When to Use**:
- When you need help with React/TypeScript code
- For code reviews and bug fixes
- When implementing new features
- For performance optimization advice
- When working with IndexedDB or PWA features

**How to Use**:
1. In GitHub Copilot Chat, use `@pomodoro-fullstack-expert` to invoke this agent
2. Ask specific questions or request help with code review, bug fixes, or feature implementation
3. The agent will provide guidance based on the project's technology stack and best practices

## Creating New Agents

To create a new custom agent:
1. Create a new `.agent.md` file in this directory
2. Use the format: `agent-name.agent.md`
3. Include YAML frontmatter with `name`, `description`, and `tools`
4. Write clear instructions in the body of the file
5. Merge the file to the main branch to make it available

For more information, see: https://docs.github.com/en/copilot/reference/custom-agents-configuration
