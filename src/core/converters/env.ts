import { BaseConverter } from "./base";
import { ConfigData, ConversionOptions, ConfigFormat } from "../types";

export class ENVConverter extends BaseConverter {
  readonly format: ConfigFormat = "env";
  readonly extensions = [".env"];

  parse(content: string): ConfigData {
    const result: ConfigData = {};
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const equalIndex = trimmed.indexOf("=");
      if (equalIndex === -1) {
        continue;
      }

      const key = trimmed.substring(0, equalIndex).trim();
      let value = trimmed.substring(equalIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }

      // Parse nested keys (e.g., DATABASE_HOST -> database.host)
      this.setNestedValue(result, key, value);
    }

    return result;
  }

  stringify(data: ConfigData, options: ConversionOptions = {}): string {
    const lines: string[] = [];
    const processedData = this.preprocess(data, options);

    this.flattenObject(processedData, "", lines);
    return lines.join("\n");
  }

  private setNestedValue(obj: ConfigData, key: string, value: string): void {
    // Convert SCREAMING_SNAKE_CASE to nested object
    const parts = key.split("_").map((p) => p.toLowerCase());

    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    // Try to parse value as JSON for arrays/objects
    try {
      current[parts[parts.length - 1]] = JSON.parse(value);
    } catch {
      // If not valid JSON, store as string
      current[parts[parts.length - 1]] = value;
    }
  }

  private flattenObject(obj: any, prefix: string, lines: string[]): void {
    for (const [key, value] of Object.entries(obj)) {
      const envKey = prefix ? `${prefix}_${key}` : key;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        this.flattenObject(value, envKey.toUpperCase(), lines);
      } else {
        const envValue = this.formatValue(value);
        lines.push(`${envKey.toUpperCase()}=${envValue}`);
      }
    }
  }

  private formatValue(value: any): string {
    if (typeof value === "string") {
      // Quote if contains spaces or special characters
      if (value.includes(" ") || value.includes("#") || value.includes('"')) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    return JSON.stringify(value);
  }
}
