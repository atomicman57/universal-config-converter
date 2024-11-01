import { UniversalConfigConverter } from "../src/core/index";

describe("UniversalConfigConverter", () => {
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
    debug: true,
  };

  describe("JSON conversion", () => {
    it("should parse JSON correctly", () => {
      const json = JSON.stringify(sampleConfig);
      const parsed = converter.parse(json, "json");
      expect(parsed).toEqual(sampleConfig);
    });

    it("should stringify to JSON correctly", () => {
      const json = converter.stringify(sampleConfig, "json", {
        pretty: true,
        indent: 2,
      });
      const parsed = JSON.parse(json);
      expect(parsed).toEqual(sampleConfig);
    });

    it("should sort keys when option is enabled", () => {
      const json = converter.stringify(sampleConfig, "json", { sort: true });
      const keys = Object.keys(JSON.parse(json));
      expect(keys).toEqual(["database", "debug", "server"]);
    });
  });

  describe("YAML conversion", () => {
    it("should convert JSON to YAML", () => {
      const json = JSON.stringify(sampleConfig);
      const yaml = converter.convert(json, "json", "yaml");
      expect(yaml).toContain("database:");
      expect(yaml).toContain("host: localhost");
    });

    it("should convert YAML to JSON", () => {
      const yaml = `
database:
  host: localhost
  port: 5432
  name: mydb
server:
  port: 3000
  host: 0.0.0.0
debug: true
`;
      const json = converter.convert(yaml, "yaml", "json");
      const parsed = JSON.parse(json);
      expect(parsed).toEqual(sampleConfig);
    });

    it("should handle YAML parsing errors", () => {
      const invalidYaml = "invalid: yaml: content:";
      expect(() => converter.parse(invalidYaml, "yaml")).toThrow();
    });
  });

  describe("TOML conversion", () => {
    it("should convert JSON to TOML", () => {
      const json = JSON.stringify(sampleConfig);
      const toml = converter.convert(json, "json", "toml");
      expect(toml).toContain("[database]");
      expect(toml).toContain('host = "localhost"');
    });

    it("should convert TOML to JSON", () => {
      const toml = `
[database]
host = "localhost"
port = 5432
name = "mydb"

[server]
port = 3000
host = "0.0.0.0"

debug = true
`;
      const json = converter.convert(toml, "toml", "json");
      const parsed = JSON.parse(json);
      expect(parsed.database.host).toBe("localhost");
      expect(parsed.server.port).toBe(3000);
    });
  });

  describe("ENV conversion", () => {
    it("should parse ENV format", () => {
      const env = `
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mydb
SERVER_PORT=3000
SERVER_HOST=0.0.0.0
DEBUG=true
`;
      const parsed = converter.parse(env, "env");
      expect(parsed.database.host).toBe("localhost");
      expect(parsed.database.port).toBe(5432);
      expect(parsed.server.port).toBe(3000);
    });

    it("should convert JSON to ENV", () => {
      const json = JSON.stringify(sampleConfig);
      const env = converter.convert(json, "json", "env");
      expect(env).toContain("DATABASE_HOST=localhost");
      expect(env).toContain("DATABASE_PORT=5432");
      expect(env).toContain("SERVER_PORT=3000");
    });

    it("should handle quoted values in ENV", () => {
      const env = `
MESSAGE="Hello World"
PATH='/usr/local/bin'
UNQUOTED=value
`;
      const parsed = converter.parse(env, "env");
      expect(parsed.message).toBe("Hello World");
      expect(parsed.path).toBe("/usr/local/bin");
      expect(parsed.unquoted).toBe("value");
    });

    it("should skip comments and empty lines", () => {
      const env = `
# This is a comment
DATABASE_HOST=localhost

# Another comment
DATABASE_PORT=5432
`;
      const parsed = converter.parse(env, "env");
      expect(parsed.database.host).toBe("localhost");
      expect(parsed.database.port).toBe(5432);
    });
  });

  describe("Cross-format conversion", () => {
    it("should convert through all formats maintaining data integrity", () => {
      const original = JSON.stringify(sampleConfig);

      // JSON -> YAML -> TOML -> ENV -> JSON
      const yaml = converter.convert(original, "json", "yaml");
      const toml = converter.convert(yaml, "yaml", "toml");
      const env = converter.convert(toml, "toml", "env");
      const finalJson = converter.convert(env, "env", "json");

      const finalParsed = JSON.parse(finalJson);
      expect(finalParsed.database.host).toBe(sampleConfig.database.host);
      expect(finalParsed.server.port).toBe(sampleConfig.server.port);
      expect(finalParsed.debug).toBe(sampleConfig.debug);
    });

    it("should handle nested objects in all formats", () => {
      const nested = {
        level1: {
          level2: {
            level3: {
              value: "deep",
            },
          },
        },
      };

      const json = JSON.stringify(nested);
      const yaml = converter.convert(json, "json", "yaml");
      const toml = converter.convert(json, "json", "toml");
      const env = converter.convert(json, "json", "env");

      expect(yaml).toContain("level1:");
      expect(toml).toContain("[level1.level2.level3]");
      expect(env).toContain("LEVEL1_LEVEL2_LEVEL3_VALUE=deep");
    });
  });

  describe("Error handling", () => {
    it("should throw error for invalid JSON", () => {
      expect(() => converter.parse("invalid json", "json")).toThrow(
        "Failed to parse JSON"
      );
    });

    it("should throw error for unsupported format", () => {
      expect(() => converter.parse("content", "csv" as any)).toThrow(
        "Unsupported format"
      );
    });

    it("should throw error for invalid conversion", () => {
      expect(() => converter.convert("invalid", "json", "yaml")).toThrow();
    });
  });

  describe("Options", () => {
    it("should respect pretty print option", () => {
      const pretty = converter.stringify(sampleConfig, "json", {
        pretty: true,
        indent: 2,
      });
      const compact = converter.stringify(sampleConfig, "json", {
        pretty: false,
      });

  expect(pretty.length).toBeGreaterThan(compact.length);
      expect(pretty).toContain("\n");
    });

    it("should respect indent size", () => {
      const indent2 = converter.stringify(sampleConfig, "json", { indent: 2 });
      const indent4 = converter.stringify(sampleConfig, "json", { indent: 4 });

      expect(indent4.length).toBeGreaterThan(indent2.length);
    });

    it("should sort keys alphabetically when requested", () => {
      const unsorted = { z: 1, a: 2, m: 3 };
      const sorted = converter.stringify(unsorted, "json", { sort: true });
      const keys = Object.keys(JSON.parse(sorted));

      expect(keys).toEqual(["a", "m", "z"]);
    });
  });

  describe("Special cases", () => {
    it("should handle empty objects", () => {
      const empty = {};
      const json = converter.stringify(empty, "json");
      expect(JSON.parse(json)).toEqual({});
    });

    it("should handle arrays", () => {
      const withArray = { items: [1, 2, 3] };
      const json = JSON.stringify(withArray);
      const yaml = converter.convert(json, "json", "yaml");
      const backToJson = converter.convert(yaml, "yaml", "json");

      expect(JSON.parse(backToJson)).toEqual(withArray);
    });

    it("should handle boolean values", () => {
      const booleans = { enabled: true, disabled: false };
      const json = JSON.stringify(booleans);
      const yaml = converter.convert(json, "json", "yaml");

      expect(yaml).toContain("enabled: true");
      expect(yaml).toContain("disabled: false");
    });

    it("should handle null values", () => {
      const withNull = { value: null };
      const json = JSON.stringify(withNull);
      const yaml = converter.convert(json, "json", "yaml");

      expect(yaml).toContain("value: null");
    });

    it("should handle numbers", () => {
      const numbers = { integer: 42, float: 3.14, negative: -10 };
      const json = JSON.stringify(numbers);
      const toml = converter.convert(json, "json", "toml");

      expect(toml).toContain("integer = 42");
      expect(toml).toContain("float = 3.14");
      expect(toml).toContain("negative = -10");
    });
  });
});








export const BUILD_VERSION = 's5g3gl';


export const BUILD_VERSION = 'n8ae2v';

export const BUILD_VERSION = 'kcnrn';


export const BUILD_VERSION = 'hmeo3';


// Updated: 2026-01-03
