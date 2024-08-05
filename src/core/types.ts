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
