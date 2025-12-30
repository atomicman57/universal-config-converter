import ini from "ini";
import { BaseConverter } from "./base";
import { ConfigData, ConversionOptions, ConfigFormat } from "../types";

export class INIConverter extends BaseConverter {
  readonly format: ConfigFormat = "ini";
  readonly extensions = [".ini"];

  parse(content: string): ConfigData {
    try {
      return ini.parse(content);
    } catch (error) {
      this.handleError("parse", error);
    }
  }

  stringify(data: ConfigData, options: ConversionOptions = {}): string {
    try {
      const processedData = this.preprocess(data, options);

      // INI stringify options
      const iniOptions = {
        section: undefined, // No section prefix
        whitespace: options.pretty !== false, // Add whitespace by default
      };

      return ini.stringify(processedData, iniOptions);
    } catch (error) {
      this.handleError("stringify", error);
    }
  }
}
