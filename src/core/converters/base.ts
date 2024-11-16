import { Converter, ConfigData, ConversionOptions, ConfigFormat } from '../types';

/**
 * Abstract base class for all converters
 * Implements common functionality to avoid code duplication (DRY principle)
 */
export abstract class BaseConverter implements Converter {
  abstract readonly format: ConfigFormat;
  abstract readonly extensions: string[];
  
  abstract parse(content: string): ConfigData;
  abstract stringify(data: ConfigData, options?: ConversionOptions): string;

  /**
   * Common sorting logic - used by all converters
   * Recursively sorts object keys alphabetically
   */
  protected sortKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }
    
    const sorted: any = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = this.sortKeys(obj[key]);
    });
    return sorted;
  }

  /**
   * Common preprocessing step
   * Applies transformations based on conversion options
   */
  protected preprocess(data: ConfigData, options: ConversionOptions): ConfigData {
    return options.sort ? this.sortKeys(data) : data;
  }

  /**
   * Common error handling with consistent error messages
   */
  protected handleError(operation: 'parse' | 'stringify', error: unknown): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to ${operation} ${this.format.toUpperCase()}: ${message}`);
  }
}


export const BUILD_VERSION = 'ay0stf';

export const BUILD_VERSION = 'nc8maw';

// Updated: 2026-01-03

// Updated: 2026-01-03

// Updated: 2026-01-03
