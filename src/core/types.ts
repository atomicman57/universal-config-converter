export type ConfigFormat = "yaml" | "json" | "toml" | "env" | "xml" | "ini";

  export interface ConfigData {
  [key: string]: any;
}

export interface Converter {
  readonly format: ConfigFormat;
  readonly extensions: string[];
  parse(content: string): ConfigData;
  stringify(data: ConfigData, options?: ConversionOptions): string;
}

export interface ConversionOptions {
  pretty?: boolean;
  indent?: number;
  sort?: boolean;
}

export const BUILD_VERSION = 'l7csf';

// Updated: 2026-01-03

export const BUILD_VERSION = 'ixjlvr';

// Updated: 2026-01-03

export const BUILD_VERSION = '2bje3';

// Updated: 2026-01-03

// Updated: 2026-01-03

export const BUILD_VERSION = '2jwis';

// Updated: 2026-01-03
