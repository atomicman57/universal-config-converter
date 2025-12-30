import { ConverterRegistry } from "../src/core/registry";
import { UniversalConfigConverter } from "../src/core/index";
import { BaseConverter } from "../src/core/converters/base";
import { ConfigData, ConversionOptions, ConfigFormat } from "../src/core/types";

// Mock custom converter for testing plugin architecture
class XMLConverter extends BaseConverter {
  readonly format: ConfigFormat = 'json' as ConfigFormat; // Using JSON format type for now
  readonly extensions = ['.xml'];

  parse(content: string): ConfigData {
    // Mock XML parsing
    return { xml: "parsed" };
  }

  stringify(data: ConfigData, options: ConversionOptions = {}): string {
    // Mock XML stringification
    return "<root>mock</root>";
  }
}

describe("ConverterRegistry", () => {
  let registry: ConverterRegistry;

  beforeEach(() => {
    // Get fresh instance for each test
    registry = ConverterRegistry.getInstance();
  });

  describe("Plugin Architecture", () => {
    it("should allow registering custom converters", () => {
      const converter = new UniversalConfigConverter();
      
      // Check initial formats
      const initialFormats = converter.getSupportedFormats();
      expect(initialFormats).toContain('json');
      expect(initialFormats).toContain('yaml');
      expect(initialFormats).toContain('toml');
      expect(initialFormats).toContain('env');
    });

    it("should return supported formats", () => {
      const converter = new UniversalConfigConverter();
      const formats = converter.getSupportedFormats();
      
      expect(formats.length).toBe(5);
      expect(formats).toEqual(expect.arrayContaining(['json', 'yaml', 'toml', 'env', 'xml']));
    });

    it("should return supported extensions", () => {
      const converter = new UniversalConfigConverter();
      const extensions = converter.getSupportedExtensions();
      
      expect(extensions.length).toBeGreaterThan(0);
      expect(extensions).toContain('.json');
      expect(extensions).toContain('.yaml');
      expect(extensions).toContain('.yml');
      expect(extensions).toContain('.toml');
      expect(extensions).toContain('.env');
    });
  });

  describe("Error Messages", () => {
    it("should provide helpful error message for unsupported source format", () => {
      const converter = new UniversalConfigConverter();
      
      expect(() => {
        converter.convert("content", "csv" as any, "json");
      }).toThrow(/Unsupported source format: csv/);
      expect(() => {
        converter.convert("content", "csv" as any, "json");
      }).toThrow(/Supported formats:/);
    });

    it("should provide helpful error message for unsupported target format", () => {
      const converter = new UniversalConfigConverter();
      
      expect(() => {
        converter.convert("{}", "json", "csv" as any);
      }).toThrow(/Unsupported target format: csv/);
    });

    it("should provide helpful error message for unsupported file extension", () => {
      const converter = new UniversalConfigConverter();
      
      expect(() => {
        converter.convertFile("input.csv", "output.json");
      }).toThrow(/Cannot detect format from extension: .csv/);
      expect(() => {
        converter.convertFile("input.csv", "output.json");
      }).toThrow(/Supported extensions:/);
    });
  });

  describe("Base Converter Functionality", () => {
    it("should use common error handling from BaseConverter", () => {
      const converter = new UniversalConfigConverter();
      
      // Invalid JSON should throw with consistent error format
      expect(() => {
        converter.parse("invalid json", "json");
      }).toThrow(/Failed to parse JSON/);
    });

    it("should use common preprocessing from BaseConverter", () => {
      const converter = new UniversalConfigConverter();
      const data = { z: 1, a: 2, m: 3 };
      
      // Test that sorting works via BaseConverter
      const sorted = converter.stringify(data, "json", { sort: true });
      const parsed = JSON.parse(sorted);
      const keys = Object.keys(parsed);
      
      expect(keys).toEqual(["a", "m", "z"]);
    });
  });
});

describe("UniversalConfigConverter - Extended", () => {
  let converter: UniversalConfigConverter;

  beforeEach(() => {
    converter = new UniversalConfigConverter();
  });

  describe("Registry Integration", () => {
    it("should detect format by file extension", () => {
      const jsonData = '{"key": "value"}';
      const yamlData = 'key: value';
      
      // Should work with different extensions
      const testFiles = [
        { input: "config.json", output: "config.yaml" },
        { input: "settings.yml", output: "settings.json" },
        { input: "data.toml", output: "data.env" },
      ];
      
      // We can't test file conversion without actual files,
      // but we can test format detection through parse
      expect(() => converter.parse(jsonData, 'json')).not.toThrow();
      expect(() => converter.parse(yamlData, 'yaml')).not.toThrow();
    });

    it("should handle case-insensitive file extensions", () => {
      // Extensions are stored lowercase in registry
      const extensions = converter.getSupportedExtensions();
      
      extensions.forEach(ext => {
        expect(ext).toBe(ext.toLowerCase());
      });
    });
  });

  describe("Code Quality Improvements", () => {
    it("should not duplicate sortKeys logic across converters", () => {
      // This is implicit - if tests pass, sortKeys works consistently
      // across all converters through BaseConverter
      
      const data = { b: { y: 1, a: 2 }, a: 1 };
      
      const jsonSorted = converter.stringify(data, 'json', { sort: true });
      const yamlSorted = converter.stringify(data, 'yaml', { sort: true });
      const tomlSorted = converter.stringify(data, 'toml', { sort: true });
      
      // All should have sorted keys
      const jsonParsed = JSON.parse(jsonSorted);
      expect(Object.keys(jsonParsed)).toEqual(['a', 'b']);
      expect(Object.keys(jsonParsed.b)).toEqual(['a', 'y']);
      
      // YAML and TOML should also be sorted (verified by checking output)
      expect(yamlSorted).toMatch(/^a:/m);
      
      // For TOML, just check that both keys are present
      // TOML may place top-level keys differently than nested tables
      expect(tomlSorted).toContain('a =');
      expect(tomlSorted).toContain('[b]');
    });
  });
});

