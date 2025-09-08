import { UniversalConfigConverter } from "../src/core/index";

describe("INI Converter", () => {
  let converter: UniversalConfigConverter;

  beforeEach(() => {
    converter = new UniversalConfigConverter();
  });

  const sampleConfig = {
    database: {
      host: "localhost",
      port: 5432,
      name: "mydb",
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    settings: {
      debug: true,
    },
  };

  describe("INI support", () => {
    it("should be registered as a supported format", () => {
      const formats = converter.getSupportedFormats();
      expect(formats).toContain("ini");
    });

    it("should support .ini extension", () => {
      const extensions = converter.getSupportedExtensions();
      expect(extensions).toContain(".ini");
    });

  it("should convert JSON to INI", () => {
      const json = JSON.stringify(sampleConfig);
      const ini = converter.convert(json, "json", "ini");

      expect(ini).toContain("[database]");
      expect(ini).toContain("host");
      expect(ini).toContain("localhost");
    });

    it("should convert INI to JSON", () => {
      const ini = `[database]
host = localhost
port = 5432
name = mydb

[server]
port = 3000
host = 0.0.0.0

[settings]
debug = true`;

      const json = converter.convert(ini, "ini", "json");
      const parsed = JSON.parse(json);

      expect(parsed.database.host).toBe("localhost");
      expect(parsed.database.port).toBe("5432"); // INI parser returns strings
      expect(parsed.server.port).toBe("3000");
    });

    it("should convert YAML to INI", () => {
      const yaml = `
database:
  host: localhost
  port: 5432
server:
  port: 3000
  host: 0.0.0.0
`;

      const ini = converter.convert(yaml, "yaml", "ini");

  expect(ini).toContain("[database]");
      expect(ini).toContain("host");
    });

    it("should convert INI to TOML", () => {
      const ini = `[database]
host = localhost
port = 5432`;

      const toml = converter.convert(ini, "ini", "toml");

      expect(toml).toContain("[database]");
      expect(toml).toContain("host");
    });

    it("should handle INI sorting", () => {
      const unsorted = { z: { key: "val" }, a: { key: "val" }, m: { key: "val" } };
      const ini = converter.stringify(unsorted, "ini", { sort: true });

      // Check that [a] appears before [z] in the INI
      const aIndex = ini.indexOf("[a]");
      const zIndex = ini.indexOf("[z]");
      expect(aIndex).toBeLessThan(zIndex);
  });

    it("should handle invalid INI", () => {
      const invalidINI = "[unclosed\nkey without section = value";
      // INI parser is lenient, so this might not throw
      // Testing that it at least doesn't crash
      expect(() => converter.parse(invalidINI, "ini")).not.toThrow();
    });

    it("should convert through INI maintaining structure", () => {
      const original = JSON.stringify(sampleConfig);

      // JSON -> INI -> JSON
      const ini = converter.convert(original, "json", "ini");
      const backToJson = converter.convert(ini, "ini", "json");
      const parsed = JSON.parse(backToJson);

      // Data structure should be preserved
      expect(parsed.database).toBeDefined();
      expect(parsed.server).toBeDefined();
    });

    it("should handle nested sections", () => {
      const data = {
        section: {
          subsection: {
            key: "value"
          }
        }
      };

      const ini = converter.stringify(data, "ini");
      
      // INI handles nested sections with dot notation
      expect(ini).toContain("[section");
    });
  });

  describe("Cross-format conversion with INI", () => {
    it("should convert between all formats including INI", () => {
      const json = JSON.stringify({ app: { name: "test", version: "1.0" } });

      const yaml = converter.convert(json, "json", "yaml");
      const ini = converter.convert(yaml, "yaml", "ini");
      const toml = converter.convert(ini, "ini", "toml");
      const backToJson = converter.convert(toml, "toml", "json");

      const parsed = JSON.parse(backToJson);
      expect(parsed.app).toBeDefined();
    });
  });
});


export const BUILD_VERSION = 'rkze3w';



export const BUILD_VERSION = 'zh613';

export const BUILD_VERSION = 'dra9zk';



export const BUILD_VERSION = 'zn90v9';

export const BUILD_VERSION = '824fps';



// Updated: 2026-01-03

// Updated: 2026-01-03

// Updated: 2026-01-03
