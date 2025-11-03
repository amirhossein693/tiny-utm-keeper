# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-11-03

### Fixed
- Fix ESM module exports by properly separating build outputs
- Separate dist folders for CommonJS (`dist/cjs`), ESM (`dist/esm`), and TypeScript types (`dist/types`)
- Fix module resolution issues in browser environments
- Update example.html to use correct CDN path

### Changed
- Reorganized build structure for better module compatibility
- Improved package.json exports configuration

## [1.0.1] - 2025-11-03

### Fixed
- Add `.js` extensions to imports for ESM compatibility

## [1.0.0] - 2025-11-03

### Added
- Initial release
- Zero-dependency UTM parameter tracking
- First-touch and last-touch attribution modes
- SSR-safe implementation for Next.js and other frameworks
- localStorage-based persistence with configurable expiration
- Automatic URL parameter extraction and capture
- URL enhancement utilities for appending stored UTMs
- Fetch wrapper for automatic UTM injection
- Full TypeScript support with comprehensive type definitions
- Multiple export formats (CommonJS, ESM)
- Comprehensive documentation in English and Persian
- Example implementations for React, Next.js, and Vanilla JS

### Features
- `UTMKeeper` class for custom instances
- Singleton pattern with convenience functions
- Configurable storage keys and expiration periods
- Browser environment detection for SSR safety
- Automatic cleanup of expired UTM data
- Support for all standard UTM parameters (source, medium, campaign, term, content)

[1.0.2]: https://github.com/amirhossein693/tiny-utm-keeper/releases/tag/v1.0.2
[1.0.1]: https://github.com/amirhossein693/tiny-utm-keeper/releases/tag/v1.0.1
[1.0.0]: https://github.com/amirhossein693/tiny-utm-keeper/releases/tag/v1.0.0

