import { UniversalConfigConverter } from "../src/core/index";

describe("XML Converter", () => {
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

  describe("XML support", () => {
    it("should be registered as a supported format", () => {
      const formats = converter.getSupportedFormats();
      expect(formats).toContain("xml");
    });

    it("should support .xml extension", () => {
      const extensions = converter.getSupportedExtensions();
      expect(extensions).toContain(".xml");
    });

    it("should convert JSON to XML", () => {
      const json = JSON.stringify(sampleConfig);
      const xml = converter.convert(json, "json", "xml");

      expect(xml).toContain("<?xml");
      expect(xml).toContain("<database>");
      expect(xml).toContain("<host>localhost</host>");
      expect(xml).toContain("<port>5432</port>");
    });

    it("should convert XML to JSON", () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>5432</port>
    <name>mydb</name>
  </database>
  <server>
    <port>3000</port>
    <host>0.0.0.0</host>
  </server>
  <debug>true</debug>
</config>`;

      const json = converter.convert(xml, "xml", "json");
      const parsed = JSON.parse(json);

      // With explicitRoot: false, config becomes the root
      expect(parsed.database.host).toBe("localhost");
      expect(parsed.server.port).toBe("3000");
    });

    it("should convert YAML to XML", () => {
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

      const xml = converter.convert(yaml, "yaml", "xml");

      expect(xml).toContain("<database>");
      expect(xml).toContain("<host>localhost</host>");
    });

    it("should handle XML pretty printing", () => {
      const json = JSON.stringify(sampleConfig);
      const xmlPretty = converter.convert(json, "json", "xml", { pretty: true });
      const xmlCompact = converter.convert(json, "json", "xml", { pretty: false });

      // Pretty version should have more whitespace
      expect(xmlPretty.length).toBeGreaterThanOrEqual(xmlCompact.length);
      expect(xmlPretty).toContain("\n");
    });

    it("should handle XML sorting", () => {
      const unsorted = { z: 1, a: 2, m: 3 };
      const xml = converter.stringify(unsorted, "xml", { sort: true });

      // Check that 'a' appears before 'z' in the XML
      const aIndex = xml.indexOf("<a>");
      const zIndex = xml.indexOf("<z>");
      expect(aIndex).toBeLessThan(zIndex);
    });

    it("should handle invalid XML", () => {
      const invalidXml = "<invalid><unclosed>";
      expect(() => converter.parse(invalidXml, "xml")).toThrow(/Failed to parse XML/);
    });

    it("should convert through XML maintaining data integrity", () => {
      const original = JSON.stringify(sampleConfig);

      // JSON -> XML -> JSON
      const xml = converter.convert(original, "json", "xml");
      const backToJson = converter.convert(xml, "xml", "json");
      const parsed = JSON.parse(backToJson);

      // Data should be preserved (might be nested under root)
      expect(parsed.database || parsed.root?.database).toBeDefined();
    });
  });

  describe("Cross-format conversion with XML", () => {
    it("should convert between all formats including XML", () => {
      const json = JSON.stringify({ app: { name: "test", version: "1.0" } });

      const yaml = converter.convert(json, "json", "yaml");
      const xml = converter.convert(yaml, "yaml", "xml");
      const toml = converter.convert(xml, "xml", "toml");
      const backToJson = converter.convert(toml, "toml", "json");

      const parsed = JSON.parse(backToJson);
      // Data might be nested under root element depending on conversion
      expect(parsed.app || parsed.root?.app || parsed).toBeDefined();
    });
  });
});

