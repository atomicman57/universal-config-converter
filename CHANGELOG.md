# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **INI Support**: Added INI converter supporting `.ini` files
  - Parse INI to ConfigData
  - Convert ConfigData to INI with section support
  - Full integration with existing formats
  - 11 comprehensive tests for INI functionality

- **XML Support**: Added XML converter supporting `.xml` files
  - Parse XML to ConfigData
  - Convert ConfigData to XML with pretty printing
  - Full integration with existing formats
  - 10 comprehensive tests for XML functionality

- **Plugin Architecture**: Complete refactoring to support custom format converters
  - `BaseConverter` abstract class for common functionality
  - `ConverterRegistry` singleton for managing converters
  - `registerConverter()` method for adding custom formats at runtime
  - Automatic file extension detection and format validation
  
- **New API Methods**:
  - `getSupportedFormats()` - Returns array of supported format names
  - `getSupportedExtensions()` - Returns array of supported file extensions

### Changed
- **Architecture Refactoring** (Breaking changes for extenders, not users):
  - All converters now extend `BaseConverter`
  - Unified error handling across all formats
  - Eliminated code duplication (DRY principle)
  - Better error messages with helpful format listings
  
- **Dependencies**:
  - Added `xml2js` ^0.6.2 for XML parsing
  - Added `@types/xml2js` ^0.4.14 for TypeScript support
  - Added `ini` ^4.1.1 for INI parsing
  - Added `@types/ini` ^4.1.1 for TypeScript support

### Improved
- Error messages now include lists of supported formats/extensions
- Consistent error handling across all converters
- Better code organization and maintainability
- Enhanced type safety with TypeScript

### Tests
- Increased test coverage from 25 to 57 tests
- Added 11 tests for plugin architecture
- Added 10 tests for XML functionality
- Added 11 tests for INI functionality
- All tests passing with 100% success rate

## [1.0.0] - 2024-01-01

### Added
- Initial release with support for JSON, YAML, TOML, and ENV formats
- CLI tool for file conversion
- Web UI with live preview
- REST API for programmatic access
- Batch conversion support
- Pretty printing and key sorting options


## Version History

- 2026-01-03: Updated


## Updated 2026-01-03

Minor improvements and clarifications.
