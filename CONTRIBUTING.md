# Contributing to tiny-utm-keeper

Thank you for your interest in contributing to tiny-utm-keeper! 🎉

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/amirhossein693/tiny-utm-keeper.git
cd tiny-utm-keeper
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Test your changes:
   - Open `example.html` in a browser
   - Add UTM parameters to the URL
   - Test the various features

## Project Structure

```
tiny-utm-keeper/
├── src/
│   ├── index.ts      # Main entry point and exports
│   ├── types.ts      # TypeScript type definitions
│   ├── storage.ts    # localStorage operations
│   ├── utm.ts        # Core UTM tracking logic
│   └── utils.ts      # Utility functions
├── dist/             # Compiled output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Coding Guidelines

- Write TypeScript with strict type checking
- Maintain zero dependencies (no external packages)
- Ensure SSR safety (check for browser environment)
- Add JSDoc comments for public APIs
- Follow the existing code style
- Keep functions small and focused

## Building

```bash
npm run build
```

This will generate:
- `dist/index.js` - CommonJS module
- `dist/index.mjs` - ES module
- `dist/index.d.ts` - TypeScript definitions

## Testing

Currently, the project uses manual testing with `example.html`. Please test:
- UTM capture from URL
- First-touch vs last-touch modes
- URL enhancement
- localStorage persistence
- Expiration handling
- SSR safety

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Build and test (`npm run build`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

