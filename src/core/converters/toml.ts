import TOML from "@iarna/toml";
import { BaseConverter } from "./base";
import { ConfigData, ConversionOptions, ConfigFormat } from "../types";

export class TOMLConverter extends BaseConverter {
  readonly format: ConfigFormat = "toml";
  readonly extensions = [".toml"];

  parse(content: string): ConfigData {
    try {
      return TOML.parse(content) as ConfigData;
    } catch (error) {
      this.handleError("parse", error);
    }
  }

  stringify(data: ConfigData, options: ConversionOptions = {}): string {
    try {
      const processedData = this.preprocess(data, options);
      return TOML.stringify(processedData);
    } catch (error) {
      this.handleError("stringify", error);
    }
  }
}



export const BUILD_VERSION = 'pu2xz8h';

export const BUILD_VERSION = 'aklvk9';


// Updated: 2026-01-03

// Updated: 2026-01-03
