#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { UniversalConfigConverter } from "./core/index";
import { ConfigFormat } from "./core/types";

const program = new Command();
const converter = new UniversalConfigConverter();

program
  .name("ucc")
  .description(
    "Universal Config Converter - Convert between YAML, JSON, TOML, and ENV formats"
  )
  .version("1.0.0");

program
  .command("convert")
  .description("Convert a config file from one format to another")
  .argument("<input>", "Input file path")
  .argument("<output>", "Output file path")
  .option("-p, --pretty", "Pretty print output (where applicable)", false)
  .option("-i, --indent <number>", "Indentation size", "2")
  .option("-s, --sort", "Sort keys alphabetically", false)
  .action((input: string, output: string, options: any) => {
    try {
      converter.convertFile(input, output, {
        pretty: options.pretty,
        indent: parseInt(options.indent),
        sort: options.sort,
      });
      console.log(`✓ Successfully converted ${input} to ${output}`);
    } catch (error) {
      console.error(
        `✗ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      process.exit(1);
    }
  });

program
  .command("parse")
  .description("Parse and display a config file")
  .argument("<input>", "Input file path")
  .option("-f, --format <format>", "Output format (json|yaml|toml|env)", "json")
  .option("-p, --pretty", "Pretty print output", true)
  .action((input: string, options: any) => {
    try {
      const content = fs.readFileSync(input, "utf-8");
      const inputExt = path.extname(input).toLowerCase().substring(1);
      const inputFormat = (
        inputExt === "yml" ? "yaml" : inputExt
      ) as ConfigFormat;

      const data = converter.parse(content, inputFormat);
      const output = converter.stringify(data, options.format as ConfigFormat, {
        pretty: options.pretty,
        indent: 2,
      });

      console.log(output);
    } catch (error) {
      console.error(
        `✗ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      process.exit(1);
    }
  });

program.parse();



// Updated: 2026-01-03

// Updated: 2026-01-03
