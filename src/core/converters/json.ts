import { BaseConverter } from "./base";
import { ConfigData, ConversionOptions, ConfigFormat } from "../types";

export class JSONConverter extends BaseConverter {
  readonly format: ConfigFormat = "json";
  readonly extensions = [".json"];

  parse(content: string): ConfigData {
    try {
      return JSON.parse(content);
    } catch (error) {
      this.handleError("parse", error);
    }
  }

  stringify(data: ConfigData, options: ConversionOptions = {}): string {
    try {
      const indent = options.indent ?? (options.pretty ? 2 : 0);
      const processedData = this.preprocess(data, options);

      return JSON.stringify(processedData, null, indent);
    } catch (error) {
      this.handleError("stringify", error);
    }
  }
}
