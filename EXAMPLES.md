# Usage Examples

## CLI Examples

### Basic Conversion

```bash
# JSON to YAML
node dist/cli.js convert config.json config.yaml

# YAML to TOML
node dist/cli.js convert config.yaml config.toml

# TOML to ENV
node dist/cli.js convert config.toml .env

# ENV to JSON
node dist/cli.js convert .env config.json
```

### With Options

```bash
# Pretty print and sort keys
node dist/cli.js convert config.json config.yaml --pretty --sort

# Custom indentation (4 spaces)
node dist/cli.js convert config.json config.yaml --indent 4

# All options combined
node dist/cli.js convert config.json config.yaml --pretty --sort --indent 4
```

### Parse Command

```bash
# Parse and display as JSON
node dist/cli.js parse config.yaml

# Parse and convert to different format
node dist/cli.js parse config.yaml --format toml

# Parse with pretty print
node dist/cli.js parse config.json --format yaml --pretty
```

## Library Examples

### Node.js/JavaScript

```javascript
const { UniversalConfigConverter } = require('universal-config-converter');

const converter = new UniversalConfigConverter();

// Example 1: Simple conversion
const jsonConfig = '{"database": {"host": "localhost", "port": 5432}}';
const yamlConfig = converter.convert(jsonConfig, 'json', 'yaml', {
  pretty: true,
  indent: 2
});
console.log(yamlConfig);
// Output:
// database:
//   host: localhost
//   port: 5432

// Example 2: Parse and manipulate
const data = converter.parse(yamlConfig, 'yaml');
data.database.port = 3306;
const updatedYaml = converter.stringify(data, 'yaml');
console.log(updatedYaml);

// Example 3: File conversion
converter.convertFile('input.json', 'output.toml', {
  pretty: true,
  sort: true
});

// Example 4: Multiple conversions
const formats = ['yaml', 'toml', 'env'];
formats.forEach(format => {
  const result = converter.convert(jsonConfig, 'json', format, {
    pretty: true
  });
  console.log(`\n=== ${format.toUpperCase()} ===`);
  console.log(result);
});
```

### TypeScript

```typescript
import { 
  UniversalConfigConverter, 
  ConfigFormat, 
  ConfigData,
  ConversionOptions 
} from 'universal-config-converter';

const converter = new UniversalConfigConverter();

// Type-safe conversion
function convertConfig(
  content: string,
  from: ConfigFormat,
  to: ConfigFormat,
  options?: ConversionOptions
): string {
  try {
    return converter.convert(content, from, to, options);
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
}

// Example with error handling
async function processConfig(filePath: string): Promise<ConfigData> {
  const fs = require('fs').promises;
  const content = await fs.readFile(filePath, 'utf-8');
  
  const ext = filePath.split('.').pop() as ConfigFormat;
  return converter.parse(content, ext);
}

// Example: Config transformation
const config: ConfigData = {
  database: {
    host: 'localhost',
    port: 5432
  }
};

// Convert to all formats
const json = converter.stringify(config, 'json', { pretty: true, indent: 2 });
const yaml = converter.stringify(config, 'yaml', { pretty: true });
const toml = converter.stringify(config, 'toml');
const env = converter.stringify(config, 'env', { sort: true });
```

## API Examples

### cURL Examples

```bash
# Simple conversion
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "content": "{\"name\":\"MyApp\",\"version\":\"1.0.0\"}",
    "fromFormat": "json",
    "toFormat": "yaml",
    "options": {"pretty": true}
  }'

# With all options
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "content": "name: MyApp\nversion: 1.0.0",
    "fromFormat": "yaml",
    "toFormat": "json",
    "options": {
      "pretty": true,
      "indent": 4,
      "sort": true
    }
  }'

# Get supported formats
curl http://localhost:3000/api/formats

# Health check
curl http://localhost:3000/api/health
```

### JavaScript Fetch

```javascript
// Simple conversion
async function convertConfig(content, fromFormat, toFormat) {
  const response = await fetch('http://localhost:3000/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content,
      fromFormat,
      toFormat,
      options: { pretty: true, indent: 2 }
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error);
  }
  
  return data.result;
}

// Example usage
convertConfig('{"name":"test"}', 'json', 'yaml')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Python Example

```python
import requests
import json

def convert_config(content, from_format, to_format, options=None):
    url = 'http://localhost:3000/api/convert'
    
    payload = {
        'content': content,
        'fromFormat': from_format,
        'toFormat': to_format,
        'options': options or {'pretty': True}
    }
    
    response = requests.post(url, json=payload)
    response.raise_for_status()
    
    return response.json()['result']

# Example usage
json_config = '{"database": {"host": "localhost", "port": 5432}}'
yaml_result = convert_config(json_config, 'json', 'yaml')
print(yaml_result)
```

## Web UI Examples

### Single File Conversion

1. Open http://localhost:3000 in your browser
2. Paste your config in the left editor:
   ```json
   {
     "app": {
       "name": "MyApp",
       "version": "1.0.0"
     }
   }
   ```
3. Select source format: `JSON`
4. Select target format: `YAML`
5. See the live conversion in the right editor
6. Click "Download" to save the file

### Drag & Drop

1. Open http://localhost:3000
2. Drag a `.json`, `.yaml`, `.toml`, or `.env` file onto the left editor
3. The format is auto-detected
4. Select your target format
5. See the conversion instantly

### Batch Conversion

1. Click the "Batch Conversion" tab
2. Drag multiple config files onto the drop zone
3. Select the target format (e.g., `YAML`)
4. Click "Convert All Files"
5. Download individual files or all at once

## Real-World Use Cases

### 1. Migrate Docker Compose to Kubernetes

```bash
# Convert docker-compose.yml to JSON for processing
node dist/cli.js convert docker-compose.yml config.json --pretty

# Process the JSON (custom script)
node process-config.js

# Convert back to YAML
node dist/cli.js convert config.json kubernetes.yaml --pretty
```

### 2. Environment Variables Management

```bash
# Convert .env to JSON for version control
node dist/cli.js convert .env env.json --pretty --sort

# Convert back when needed
node dist/cli.js convert env.json .env
```

### 3. Config File Migration

```javascript
const fs = require('fs');
const { UniversalConfigConverter } = require('universal-config-converter');

const converter = new UniversalConfigConverter();

// Migrate all configs from JSON to YAML
const configDir = './configs';
const files = fs.readdirSync(configDir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const inputPath = `${configDir}/${file}`;
    const outputPath = inputPath.replace('.json', '.yaml');
    
    converter.convertFile(inputPath, outputPath, {
      pretty: true,
      sort: true
    });
    
    console.log(`✓ Converted ${file} to YAML`);
  }
});
```

### 4. Configuration Validation

```javascript
const { UniversalConfigConverter } = require('universal-config-converter');

function validateConfig(content, format) {
  const converter = new UniversalConfigConverter();
  
  try {
    const data = converter.parse(content, format);
    
    // Validate required fields
    if (!data.app || !data.app.name) {
      throw new Error('Missing app.name');
    }
    
    console.log('✓ Config is valid');
    return true;
  } catch (error) {
    console.error('✗ Config is invalid:', error.message);
    return false;
  }
}

// Validate a YAML config
const yamlContent = `
app:
  name: MyApp
  version: 1.0.0
`;

validateConfig(yamlContent, 'yaml');
```

### 5. Multi-Format Config Generator

```javascript
const { UniversalConfigConverter } = require('universal-config-converter');
const fs = require('fs');

const converter = new UniversalConfigConverter();

// Base configuration
const config = {
  app: {
    name: 'MyApp',
    version: '1.0.0',
    port: 3000
  },
  database: {
    host: 'localhost',
    port: 5432
  }
};

// Generate in all formats
const formats = ['json', 'yaml', 'toml', 'env'];

formats.forEach(format => {
  const content = converter.stringify(config, format, {
    pretty: true,
    sort: true
  });
  
  const ext = format === 'yaml' ? '.yaml' : `.${format}`;
  fs.writeFileSync(`config${ext}`, content);
  
  console.log(`✓ Generated config${ext}`);
});
```

## Tips & Tricks

### Tip 1: Chaining Conversions

```bash
# Convert through multiple formats
node dist/cli.js convert config.json temp.yaml
node dist/cli.js convert temp.yaml temp.toml
node dist/cli.js convert temp.toml final.env
rm temp.yaml temp.toml
```

### Tip 2: Pretty Print Existing Files

```bash
# Reformat JSON with consistent style
node dist/cli.js convert config.json config.json --pretty --sort --indent 2
```

### Tip 3: Environment-Specific Configs

```javascript
const converter = new UniversalConfigConverter();

// Load base config
const baseConfig = converter.parse(
  fs.readFileSync('config.yaml', 'utf-8'),
  'yaml'
);

// Override with environment variables
const envConfig = converter.parse(
  fs.readFileSync('.env', 'utf-8'),
  'env'
);

// Merge configs
const finalConfig = { ...baseConfig, ...envConfig };

// Output in desired format
const output = converter.stringify(finalConfig, 'json', { pretty: true });
console.log(output);
```

## More Examples

See the `example.json`, `example.yaml`, `example.toml`, and `example.env` files in the repository for sample configurations.

For more information, see the [README.md](README.md).


## Version History

- 2026-01-03: Updated


## Updated 2026-01-03

Minor improvements.
