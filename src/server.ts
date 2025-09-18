import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { UniversalConfigConverter } from "./core/index";
import { ConfigFormat } from "./core/types";

const app = express();
const converter = new UniversalConfigConverter();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
  app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", version: "1.0.0" });
});

// Convert endpoint
app.post("/api/convert", (req: Request, res: Response) => {
  try {
    const { content, fromFormat, toFormat, options } = req.body;

    if (!content || !fromFormat || !toFormat) {
      return res.status(400).json({
        error: "Missing required fields: content, fromFormat, toFormat",
      });
    }

    const validFormats: ConfigFormat[] = [
      "json",
      "yaml",
      "toml",
      "env",
      "xml",
      "ini",
    ];
    if (
      !validFormats.includes(fromFormat) ||
      !validFormats.includes(toFormat)
    ) {
      return res.status(400).json({
        error:
          "Invalid format. Supported formats: json, yaml, toml, env, xml, ini",
      });
    }

    const result = converter.convert(
      content,
      fromFormat as ConfigFormat,
      toFormat as ConfigFormat,
      options || {}
    );

    res.json({ result });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Conversion failed",
    });
  }
});

// Batch convert endpoint
app.post(
  "/api/convert/batch",
  upload.array("files"),
  (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const { toFormat, options } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      if (!toFormat) {
        return res.status(400).json({ error: "Missing toFormat parameter" });
      }

      const results = files.map((file) => {
        try {
          const content = file.buffer.toString("utf-8");
          const ext = path.extname(file.originalname).toLowerCase();

          let fromFormat: ConfigFormat;
          switch (ext) {
  case ".json":
              fromFormat = "json";
              break;
            case ".yaml":
            case ".yml":
              fromFormat = "yaml";
              break;
            case ".toml":
              fromFormat = "toml";
              break;
            case ".xml":
  fromFormat = "xml";
              break;
            case ".ini":
              fromFormat = "ini";
              break;
            case ".env":
              fromFormat = "env";
              break;
            default:
              throw new Error(`Unsupported file extension: ${ext}`);
          }

          const converted = converter.convert(
            content,
            fromFormat,
            toFormat as ConfigFormat,
            JSON.parse(options || "{}")
          );

          // Generate new filename
          const baseName = path.basename(file.originalname, ext);
          const newExt = toFormat === "yaml" ? ".yaml" : `.${toFormat}`;
          const newFilename = `${baseName}${newExt}`;

          return {
            originalName: file.originalname,
            newName: newFilename,
            content: converted,
            success: true,
          };
        } catch (error) {
          return {
            originalName: file.originalname,
            error: error instanceof Error ? error.message : "Conversion failed",
            success: false,
          };
        }
      });

      res.json({ results });
    } catch (error) {
      res.status(400).json({
        error:
  error instanceof Error ? error.message : "Batch conversion failed",
      });
    }
  }
);

// Get supported formats
app.get("/api/formats", (req: Request, res: Response) => {
  res.json({
    formats: ["json", "yaml", "toml", "env", "xml", "ini"],
    description: {
      json: "JavaScript Object Notation",
      yaml: "YAML Ain't Markup Language",
      toml: "Tom's Obvious, Minimal Language",
      xml: "eXtensible Markup Language",
      ini: "INI Configuration Format",
      env: "Environment Variables",
    },
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `🚀 Universal Config Converter server running on http://localhost:${PORT}`
  );
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Web UI available at http://localhost:${PORT}`);
});




export const BUILD_VERSION = 'xurr69';

export const BUILD_VERSION = '3492c5';

export const BUILD_VERSION = 'xbfllb';

export const BUILD_VERSION = 't6q1rc';

export const BUILD_VERSION = 'v858b';



export const BUILD_VERSION = 'r92mn9';



// Updated: 2026-01-03

// Updated: 2026-01-03

export const BUILD_VERSION = 'ja3mbh';

// Updated: 2026-01-03

// Updated: 2026-01-03

// Updated: 2026-01-03
