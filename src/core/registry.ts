import { Converter, ConfigFormat } from "./types";

/**
 * Singleton Registry for managing format converters
 * Implements the Registry and Singleton patterns for centralized converter management
 * Enables plugin architecture - converters can be registered at runtime
 */
export class ConverterRegistry {
  private static instance: ConverterRegistry;
  private converters: Map<ConfigFormat, Converter> = new Map();
  private extensionMap: Map<string, ConfigFormat> = new Map();

  // Private constructor ensures singleton pattern
  private constructor() {}

  /**
   * Get the singleton instance of the registry
   */
  static getInstance(): ConverterRegistry {
    if (!ConverterRegistry.instance) {
      ConverterRegistry.instance = new ConverterRegistry();
    }
    return ConverterRegistry.instance;
  }

  /**
   * Register a new converter
   * Automatically maps all file extensions to the converter's format
   */
  register(converter: Converter): void {
    this.converters.set(converter.format, converter);

    // Register all file extensions for this converter
    converter.extensions.forEach((ext) => {
      this.extensionMap.set(ext.toLowerCase(), converter.format);
    });
  }

  /**
   * Get a converter by format
   */
  get(format: ConfigFormat): Converter | undefined {
    return this.converters.get(format);
  }

  /**
   * Get a converter by file extension
   * Automatically handles case-insensitive lookups
   */
  getByExtension(extension: string): Converter | undefined {
    const format = this.extensionMap.get(extension.toLowerCase());
    return format ? this.converters.get(format) : undefined;
  }

  /**
   * Get all supported formats
   */
  getSupportedFormats(): ConfigFormat[] {
    return Array.from(this.converters.keys());
  }

  /**
   * Get all supported file extensions
   */
  getSupportedExtensions(): string[] {
    return Array.from(this.extensionMap.keys());
  }

  /**
   * Check if a format is supported
   */
  isSupported(format: ConfigFormat): boolean {
    return this.converters.has(format);
  }

  /**
   * Unregister a converter (useful for testing or plugin management)
   */
  unregister(format: ConfigFormat): void {
    const converter = this.converters.get(format);
    if (converter) {
      // Remove all extension mappings for this converter
      converter.extensions.forEach((ext) => {
  this.extensionMap.delete(ext.toLowerCase());
      });
      this.converters.delete(format);
    }
  }

  /**
   * Clear all converters (useful for testing)
   */
  clear(): void {
    this.converters.clear();
    this.extensionMap.clear();
  }
}

// Updated: 2026-01-03

export const BUILD_VERSION = '3mxcd7';
