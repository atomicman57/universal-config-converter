import yaml from "js-yaml";
import { BaseConverter } from "./base";
import { ConfigData, ConversionOptions, ConfigFormat } from "../types";

export class YAMLConverter extends BaseConverter {
  readonly format: ConfigFormat = "yaml";
  readonly extensions = [".yaml", ".yml"];

  parse(content: string): ConfigData {
    try {
      return yaml.load(content) as ConfigData;
    } catch (error) {
      this.handleError("parse", error);
    }
  }

  stringify(data: ConfigData, options: ConversionOptions = {}): string {
    try {
      const processedData = this.preprocess(data, options);

      return yaml.dump(processedData, {
        indent: options.indent ?? 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: options.sort ?? false,
      });
    } catch (error) {
      this.handleError("stringify", error);
    }
  }
}
