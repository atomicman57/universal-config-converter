import fs from "fs";
import path from "path";
import { ConverterRegistry } from "./registry";
import { JSONConverter } from "./converters/json";
import { YAMLConverter } from "./converters/yaml";
import { TOMLConverter } from "./converters/toml";
import { ENVConverter } from "./converters/env";
import { XMLConverter } from "./converters/xml";
import { INIConverter } from "./converters/ini";
import {
  ConfigFormat,
  ConfigData,
  Converter,
  ConversionOptions,
} from "./types";

export class UniversalConfigConverter {
  private registry: ConverterRegistry;

  constructor() {
    this.registry = ConverterRegistry.getInstance();
    this.registerDefaultConverters();
  }

  /**
   * Register all default converters
   * Private method to maintain encapsulation
   */
  private registerDefaultConverters(): void {
    this.registry.register(new JSONConverter());
    this.registry.register(new YAMLConverter());
    this.registry.register(new TOMLConverter());
    this.registry.register(new ENVConverter());
    this.registry.register(new XMLConverter());
    this.registry.register(new INIConverter());
  }

  /**
   * Register a custom converter (Plugin support!)
   * Enables third-party format support
   */
  registerConverter(converter: Converter): void {
    this.registry.register(converter);
  }

  /**
   * Convert config from one format to another
   */
  convert(
    content: string,
    fromFormat: ConfigFormat,
    toFormat: ConfigFormat,
    options: ConversionOptions = {}
  ): string {
    const fromConverter = this.registry.get(fromFormat);
    const toConverter = this.registry.get(toFormat);

    if (!fromConverter) {
      throw new Error(
        `Unsupported source format: ${fromFormat}. ` +
          `Supported formats: ${this.registry.getSupportedFormats().join(", ")}`
      );
    }
    if (!toConverter) {
      throw new Error(
        `Unsupported target format: ${toFormat}. ` +
          `Supported formats: ${this.registry.getSupportedFormats().join(", ")}`
      );
    }

    const data = fromConverter.parse(content);
    return toConverter.stringify(data, options);
  }

  /**
   * Convert file from one format to another
   */
  convertFile(
    inputPath: string,
    outputPath: string,
    options: ConversionOptions = {}
  ): void {
    const fromFormat = this.detectFormat(inputPath);
    const toFormat = this.detectFormat(outputPath);

    const content = fs.readFileSync(inputPath, "utf-8");
    const converted = this.convert(content, fromFormat, toFormat, options);
    fs.writeFileSync(outputPath, converted, "utf-8");
  }

  /**
   * Detect format from file extension using registry
   * Much cleaner than switch statement!
   */
  private detectFormat(filePath: string): ConfigFormat {
    const ext = path.extname(filePath).toLowerCase();
    const converter = this.registry.getByExtension(ext);

    if (!converter) {
      throw new Error(
        `Cannot detect format from extension: ${ext}. ` +
          `Supported extensions: ${this.registry
            .getSupportedExtensions()
            .join(", ")}`
      );
    }

    return converter.format;
  }

  /**
   * Parse config from string
   */
  parse(content: string, format: ConfigFormat): ConfigData {
    const converter = this.registry.get(format);
    if (!converter) {
      throw new Error(`Unsupported format: ${format}`);
    }
    return converter.parse(content);
  }

  /**
   * Stringify config data to format
   */
  stringify(
    data: ConfigData,
    format: ConfigFormat,
    options: ConversionOptions = {}
  ): string {
    const converter = this.registry.get(format);
    if (!converter) {
      throw new Error(`Unsupported format: ${format}`);
    }
    return converter.stringify(data, options);
  }

  /**
   * Get all supported formats
   */
  getSupportedFormats(): ConfigFormat[] {
    return this.registry.getSupportedFormats();
  }

  /**
   * Get all supported file extensions
   */
  getSupportedExtensions(): string[] {
    return this.registry.getSupportedExtensions();
  }
}

export * from "./types";
export { BaseConverter } from "./converters/base";
export { ConverterRegistry } from "./registry";
export {
  JSONConverter,
  YAMLConverter,
  TOMLConverter,
  ENVConverter,
  XMLConverter,
  INIConverter,
};

export const BUILD_VERSION = 'nr0m3m';


export const BUILD_VERSION = 'h51q7u';

// Updated: 2026-01-03

export const BUILD_VERSION = '8l5f9';
