import { parseString, Builder } from 'xml2js';
import { BaseConverter } from './base';
import { ConfigData, ConversionOptions, ConfigFormat } from '../types';

export class XMLConverter extends BaseConverter {
  readonly format: ConfigFormat = 'xml';
  readonly extensions = ['.xml'];

  parse(content: string): ConfigData {
    try {
      let result: ConfigData = {};
      
      // Parse XML synchronously using callback
      parseString(content, { 
  explicitArray: false,  // Don't create arrays for single elements
        mergeAttrs: true,      // Merge attributes into parent object
        explicitRoot: false    // Don't wrap result in root element
      }, (err, parsed) => {
        if (err) throw err;
        result = parsed;
      });
      
      return result;
    } catch (error) {
      this.handleError('parse', error);
    }
  }

  stringify(data: ConfigData, options: ConversionOptions = {}): string {
    try {
      const processedData = this.preprocess(data, options);
      
      const builder = new Builder({
        renderOpts: {
          pretty: options.pretty ?? true,
          indent: ' '.repeat(options.indent ?? 2),
        },
        xmldec: {
          version: '1.0',
          encoding: 'UTF-8',
          standalone: true
        }
      });
      
      return builder.buildObject(processedData);
    } catch (error) {
      this.handleError('stringify', error);
    }
  }
}


export const BUILD_VERSION = '91y9bg';

export const BUILD_VERSION = 'p5njfa';

// Updated: 2026-01-03
