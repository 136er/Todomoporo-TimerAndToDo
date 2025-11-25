# GitHub Copilot Custom Agents

This directory contains custom agent configurations for GitHub Copilot to assist with this project.

## Available Agents

### `pomodoro-fullstack-expert`

**Purpose**: Full-stack development expert specialized in this Pomodoro Timer PWA project.

**Specialization**:

- React 18+, TypeScript 5+, PWA development
- Code review and quality assurance
- Bug hunting and fixing
- Performance optimization
- Feature enhancement
- IndexedDB and offline-first patterns

**When to Use**:

- When you need help with React/TypeScript code
- For code reviews and bug fixes
- When implementing new features (timer logic, UI components, data persistence)
- For performance optimization advice
- When working with IndexedDB or PWA features
- When debugging timer state management or Pomodoro cycle logic
- For accessibility improvements

**How to Use**:

#### Example 1: Code Review

```
@pomodoro-fullstack-expert can you review the changes I made to useTimer.ts
and check if there are any memory leaks or React best practices violations?
```

#### Example 2: Bug Fix

```
@pomodoro-fullstack-expert the timer doesn't properly cycle from work to
break mode after completion. Can you investigate and fix this issue?
```

#### Example 3: Feature Implementation

```
@pomodoro-fullstack-expert I want to add a volume control slider for the
alarm sound. Can you implement this feature following the project's patterns?
```

#### Example 4: Performance Optimization

```
@pomodoro-fullstack-expert the canvas animation seems to lag when there are
many tasks. Can you optimize the rendering performance?
```

#### Example 5: IndexedDB Help

```
@pomodoro-fullstack-expert I'm getting transaction errors when saving tasks.
Can you help debug the IndexedDB operations?
```

**Tips**:

- Be specific about the issue or feature you're working on
- Mention relevant files or components if known
- Ask for explanations if you want to understand the reasoning
- Request code examples when implementing new features

## Creating New Agents

To create a new custom agent:

1. Create a new `.agent.md` file in this directory
2. Use the format: `agent-name.agent.md`
3. Include YAML frontmatter with `name`, `description`, and `tools`
4. Write clear instructions in the body of the file
5. Merge the file to the main branch to make it available

For more information, see: https://docs.github.com/en/copilot/reference/custom-agents-configuration
