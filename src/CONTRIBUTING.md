# Contributing to Color Rodeo

Thank you for your interest in contributing to Color Rodeo! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.18
- npm >= 9.0.0
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/color-rodeo.git
   cd color-rodeo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` type
- Use meaningful variable and function names

### React Components
```typescript
// Good: Functional component with props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `ColorSwatch.tsx`)
- Utilities: `camelCase.ts` (e.g., `colorUtils.ts`)
- Hooks: `useCamelCase.ts` (e.g., `useColorPicker.ts`)
- Types: `camelCase.ts` (e.g., `palette.ts`)

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Avoid inline styles unless dynamic
- Use CSS variables for theme values

### Code Organization
```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── types/           # TypeScript types
├── constants/       # App constants
└── styles/          # Global styles
```

## 🧪 Testing

Before submitting a PR:

1. **Type check**
   ```bash
   npm run type-check
   ```

2. **Build check**
   ```bash
   npm run build
   ```

3. **Manual testing**
   - Test your changes in both light and dark mode
   - Test on different screen sizes
   - Test keyboard shortcuts
   - Check accessibility

## 🎯 Pull Request Process

### Before Submitting

1. **Update documentation** if needed
2. **Test thoroughly** on multiple browsers
3. **Ensure no TypeScript errors**
4. **Follow the existing code style**
5. **Write meaningful commit messages**

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(palette): add color harmony generator

fix(accessibility): improve contrast ratio calculation

docs(readme): update installation instructions

refactor(utils): optimize color conversion functions
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Tested on mobile
- [ ] Type checking passes
- [ ] Build succeeds

## Screenshots (if applicable)
Add screenshots here

## Additional Notes
Any additional context
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear title and description**
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Screenshots/videos** if applicable
5. **Browser and OS information**
6. **Console errors** if any

## 💡 Feature Requests

For feature requests:

1. **Clear use case description**
2. **Why it's valuable** to users
3. **Proposed implementation** (if you have ideas)
4. **Mockups or examples** if applicable

## 📚 Resources

### Design System
- Colors: See `styles/globals.css`
- Components: See `components/ui/`
- Icons: [Lucide React](https://lucide.dev)

### Useful Libraries
- Color manipulation: [chroma-js](https://gka.github.io/chroma.js/)
- Animations: [Motion](https://motion.dev)
- UI Components: [shadcn/ui](https://ui.shadcn.com)

## ⚡ Development Tips

### Hot Module Replacement
Vite provides fast HMR. Changes should reflect immediately.

### TypeScript Checking
Enable TypeScript checking in your IDE for real-time feedback.

### Component Development
Test components in isolation before integrating.

### Accessibility
- Use semantic HTML
- Provide ARIA labels where needed
- Test with keyboard navigation
- Check contrast ratios

## 🤝 Code Review

All PRs require review before merging. Reviewers will check:

- Code quality and style
- TypeScript types
- Performance implications
- Accessibility
- Browser compatibility
- Mobile responsiveness

## 📞 Questions?

- Open an issue for questions
- Check existing issues and PRs
- Read the main README.md

## 🙏 Thank You!

Your contributions make Color Rodeo better for everyone. We appreciate your time and effort!

---

**Happy coding! 🎨**
