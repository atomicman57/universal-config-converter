# Contributing to Universal Config Converter

Thank you for your interest in contributing! This guide will help you add new format converters or make other improvements.

## Adding a New Format Converter

Thanks to our plugin architecture, adding a new format is straightforward and typically requires only 30-50 lines of code.

### Step 1: Create Your Converter

Create a new file in `src/core/converters/` (e.g., `ini.ts`):

```typescript
import { BaseConverter } from './base';
import { ConfigData, ConversionOptions, ConfigFormat } from '../types';

export class INIConverter extends BaseConverter {
  readonly format: ConfigFormat = 'ini' as ConfigFormat;
  readonly extensions = ['.ini'];

  parse(content: string): ConfigData {
    try {
      // Your parsing logic here
      const ini = require('ini');
      return ini.parse(content);
    } catch (error) {
      this.handleError('parse', error);
    }
  }

  stringify(data: ConfigData, options: ConversionOptions = {}): string {
    try {
      // Use inherited preprocessing for sorting
      const processedData = this.preprocess(data, options);
      
      const ini = require('ini');
      return ini.stringify(processedData);
    } catch (error) {
      this.handleError('stringify', error);
    }
  }
}
```

### Step 2: Update Types

Add your format to `src/core/types.ts`:

```typescript
export type ConfigFormat = 'yaml' | 'json' | 'toml' | 'env' | 'xml' | 'ini';
```

### Step 3: Register the Converter

Update `src/core/index.ts`:

```typescript
// 1. Import your converter
import { INIConverter } from './converters/ini';

// 2. Register it in the constructor
private registerDefaultConverters(): void {
  this.registry.register(new JSONConverter());
  this.registry.register(new YAMLConverter());
  this.registry.register(new TOMLConverter());
  this.registry.register(new ENVConverter());
  this.registry.register(new XMLConverter());
  this.registry.register(new INIConverter()); // Add this line
}

// 3. Export it
export { 
  JSONConverter, 
  YAMLConverter, 
  TOMLConverter, 
  ENVConverter, 
  XMLConverter,
  INIConverter  // Add this line
};
```

### Step 4: Update Server (Optional)

If you want web UI support, update `src/server.ts`:

```typescript
// 1. Update valid formats
const validFormats: ConfigFormat[] = ["json", "yaml", "toml", "env", "xml", "ini"];

// 2. Add to switch statement
case ".ini":
  fromFormat = "ini";
  break;

// 3. Update formats endpoint
formats: ["json", "yaml", "toml", "env", "xml", "ini"],
description: {
  // ... existing formats
  ini: "INI Configuration Format",
}
```

### Step 5: Add Tests

Create `tests/ini.test.ts`:

```typescript
import { UniversalConfigConverter } from "../src/core/index";

describe("INI Converter", () => {
  let converter: UniversalConfigConverter;

  beforeEach(() => {
    converter = new UniversalConfigConverter();
  });

  it("should be registered as a supported format", () => {
    const formats = converter.getSupportedFormats();
    expect(formats).toContain("ini");
  });

  it("should convert JSON to INI", () => {
    const json = '{"section": {"key": "value"}}';
    const ini = converter.convert(json, "json", "ini");
    expect(ini).toContain("[section]");
    expect(ini).toContain("key=value");
  });

  // Add more tests...
});
```

### Step 6: Update Documentation

1. Add example in `README.md`
2. Update supported formats table
3. Add to `CHANGELOG.md`
4. Create `example.ini` file

### Step 7: Run Tests

```bash
npm test
npm run build
```

### Benefits of BaseConverter

By extending `BaseConverter`, you automatically get:

- ✅ **sortKeys()** - Alphabetical key sorting
- ✅ **preprocess()** - Common data preprocessing
- ✅ **handleError()** - Consistent error messages
- ✅ Automatic format and extension registration
- ✅ Type safety with TypeScript

## Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public methods
- Keep converters focused and simple
- Leverage `BaseConverter` methods

## Testing

- Write comprehensive tests for your converter
- Test error cases and edge cases
- Ensure all existing tests still pass
- Aim for high code coverage

## Pull Request Process

1. Create a feature branch (`feature/add-ini-support`)
2. Make your changes following this guide
3. Write tests and ensure they pass
4. Update documentation
5. Submit a pull request with clear description

## Questions?

Open an issue or reach out to the maintainers!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

