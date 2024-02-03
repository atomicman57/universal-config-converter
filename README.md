# Universal Config Converter (UCC)

One tool to convert between `.yaml`, `.json`, `.toml`, and `.env` seamlessly.

## Features

- 🔄 Convert between YAML, JSON, TOML, and ENV formats
- 💻 Use as CLI tool or Web UI
- 🌐 REST API for programmatic access
- 📦 Use as Node.js library
- 🎨 Pretty printing and formatting options
- 🔑 Sort keys alphabetically
- 🌲 Nested object support (with ENV using underscore notation)
- ⚡ Fast and lightweight
- 🖱️ Drag & drop file upload
- 🔴 Live preview with real-time conversion
- 📋 Copy to clipboard
- 📥 Batch conversion support


### From Source

```bash
git clone https://github.com/atomicman57/universal-config-converter
cd universal-config-converter
npm install
npm run build
```

## Usage

### Web UI

Start the web server:

```bash
npm start
# or
npm run start:server
```

Then open your browser to `http://localhost:3000`

**Features:**
- Dual editor layout with live preview
- Drag & drop file upload
- Copy/paste text directly
- Batch conversion for multiple files
- Download converted files
- Real-time conversion as you type

### CLI Usage

#### Convert Files

```bash
# Basic conversion
ucc convert config.json config.yaml

# With options
ucc convert config.yaml config.json --pretty --sort

# Custom indentation
ucc convert config.json config.yaml --indent 4
```

#### Parse and Display

```bash
# Parse and display in JSON
ucc parse config.yaml

# Parse and display in specific format
ucc parse config.json --format yaml
```

### Library Usage

```typescript
import { UniversalConfigConverter } from 'universal-config-converter';

const converter = new UniversalConfigConverter();

// Convert string content
const yaml = converter.convert(jsonString, 'json', 'yaml', {
  pretty: true,
  indent: 2,
  sort: true
});

// Convert files
converter.convertFile('config.json', 'config.yaml', {
  pretty: true,
  sort: true
});

// Parse config
const data = converter.parse(yamlString, 'yaml');

// Stringify config
const json = converter.stringify(data, 'json', { pretty: true });
```

### API Usage

The web server exposes a REST API:

#### Convert Endpoint

```bash
POST /api/convert
Content-Type: application/json

{
  "content": "database:\n  host: localhost",
  "fromFormat": "yaml",
  "toFormat": "json",
  "options": {
    "pretty": true,
    "indent": 2,
    "sort": false
  }
}
```

Response:
```json
{
  "result": "{\n  \"database\": {\n    \"host\": \"localhost\"\n  }\n}"
}
```

#### Batch Convert Endpoint

```bash
POST /api/convert/batch
Content-Type: multipart/form-data

files: [file1.json, file2.yaml]
toFormat: toml
options: {"pretty": true}
```

#### Get Supported Formats

```bash
GET /api/formats
```

## Format Examples

### JSON
```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "mydb"
  },
  "server": {
    "port": 3000,
    "host": "0.0.0.0"
  },
  "debug": true
}
```

### YAML
```yaml
database:
  host: localhost
  port: 5432
  name: mydb
server:
  port: 3000
  host: 0.0.0.0
debug: true
```

### TOML
```toml
debug = true

[database]
host = "localhost"
port = 5432
name = "mydb"

[server]
port = 3000
host = "0.0.0.0"
```

### ENV
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mydb
SERVER_PORT=3000
SERVER_HOST=0.0.0.0
DEBUG=true
```

## ENV Format Notes

- Nested objects use underscore notation (e.g., `DATABASE_HOST` → `database.host`)
- Keys are automatically converted to SCREAMING_SNAKE_CASE
- Values with spaces or special characters are automatically quoted
- Arrays and objects are stored as JSON strings

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pretty` | boolean | false | Pretty print output (where applicable) |
| `indent` | number | 2 | Indentation size for pretty printing |
| `sort` | boolean | false | Sort keys alphabetically |

## CLI Options

- `--pretty, -p`: Pretty print output (where applicable)
- `--indent <number>, -i`: Set indentation size (default: 2)
- `--sort, -s`: Sort keys alphabetically
- `--format <format>, -f`: Output format for parse command

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Development Mode

```bash
# Watch mode for TypeScript compilation
npm run dev

# In another terminal, start the server
npm run start:server
```

### Project Structure

```
github-backdate/
├── src/
│   ├── core/                    # Core converter library
│   │   ├── index.ts            # Main converter class
│   │   ├── types.ts            # Type definitions
│   │   └── converters/         # Format converters
│   │       ├── json.ts
│   │       ├── yaml.ts
│   │       ├── toml.ts
│   │       └── env.ts
│   ├── cli.ts                  # CLI implementation
│   └── server.ts               # Web server
├── public/                     # Static web UI files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── tests/                      # Test files
│   └── converter.test.ts
└── dist/                       # Compiled output
```

## Examples

### Convert JSON to YAML

**Input (config.json):**
```json
{
  "app": {
    "name": "MyApp",
    "version": "1.0.0"
  }
}
```

**Command:**
```bash
ucc convert config.json config.yaml --pretty
```

**Output (config.yaml):**
```yaml
app:
  name: MyApp
  version: 1.0.0
```

### Convert ENV to JSON

**Input (.env):**
```env
APP_NAME=MyApp
APP_VERSION=1.0.0
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

**Command:**
```bash
ucc convert .env config.json --pretty --sort
```

**Output (config.json):**
```json
{
  "app": {
    "name": "MyApp",
    "version": "1.0.0"
  },
  "database": {
    "host": "localhost",
    "port": 5432
  }
}
```

### Programmatic Usage

```typescript
import { UniversalConfigConverter } from 'universal-config-converter';

const converter = new UniversalConfigConverter();

// Example 1: Convert between formats
const yamlConfig = `
database:
  host: localhost
  port: 5432
`;

const jsonConfig = converter.convert(yamlConfig, 'yaml', 'json', {
  pretty: true,
  indent: 2
});

console.log(jsonConfig);

// Example 2: Parse and manipulate
const data = converter.parse(yamlConfig, 'yaml');
data.database.port = 3306; // Modify the data

const toml = converter.stringify(data, 'toml');
console.log(toml);

// Example 3: File conversion
converter.convertFile('input.yaml', 'output.json', {
  pretty: true,
  sort: true
});
```

## Deployment

### Deploy Web UI

#### Vercel/Netlify

1. Build the project: `npm run build`
2. Set the output directory to `dist` and public directory to `public`
3. Configure the start command: `node dist/server.js`

#### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t universal-config-converter .
docker run -p 3000:3000 universal-config-converter
```

#### Environment Variables

- `PORT`: Server port (default: 3000)

## Troubleshooting

### Common Issues

**Issue: "Cannot detect format from extension"**
- Make sure your file has a valid extension (.json, .yaml, .yml, .toml, or .env)

**Issue: "Failed to parse [FORMAT]"**
- Verify your input file has valid syntax for the specified format
- Use online validators to check your config syntax

**Issue: Port already in use**
- Change the port: `PORT=8080 npm start`

### Getting Help

If you encounter any issues:
1. Check the error message in the console
2. Verify your input format is valid
3. Try with a simpler config first
4. Check the examples in this README

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Supported Formats

| Format | Extensions | Description |
|--------|-----------|-------------|
| JSON | `.json` | JavaScript Object Notation |
| YAML | `.yaml`, `.yml` | YAML Ain't Markup Language |
| TOML | `.toml` | Tom's Obvious, Minimal Language |
| ENV | `.env` | Environment Variables |

## Acknowledgments

Built with:
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML parser
- [@iarna/toml](https://github.com/iarna/iarna-toml) - TOML parser
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Express](https://expressjs.com/) - Web server
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

Made with ❤️ | [Report Issues](https://github.com/atomicman57/universal-config-converter/issues)

