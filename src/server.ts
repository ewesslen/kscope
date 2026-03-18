import express from "express";
import multer from "multer";
import { analyzeImage } from "./analyzer";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided. Send a file as 'image' field." });
      return;
    }

    const maxColors = req.body?.maxColors ? parseInt(req.body.maxColors, 10) : 5;

    const colors = await analyzeImage(req.file.buffer, {
      maxColors: Math.min(Math.max(maxColors, 1), 20),
    });

    res.json({
      filename: req.file.originalname,
      totalColors: colors.length,
      colors,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export { app };

export function startServer(port = 3000) {
  return app.listen(port, () => {
    console.log(`kscope brand color analyzer running on port ${port}`);
  });
}
