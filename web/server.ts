import express, { Request, Response } from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import archiver from "archiver";

const app = express();
const upload = multer({ dest: "uploads/" });

// Serve frontend
app.use(express.static("public"));

// Convert endpoint
app.post("/convert", upload.single("file"), (req: Request, res: Response) => {
  const inputPath = req.file?.path;
  const outputDir = path.join(__dirname, "output");

  if (!inputPath) {
    return res.status(400).send("No file uploaded");
  }

  // Clean output folder
  if (fs.existsSync(outputDir)) {
    fs.rmdirSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir);

  const command = `node ../dist/yarle.js --input ${inputPath} --output ${outputDir}`;

  exec(command, (error) => {
    if (error) {
      return res.status(500).send("Conversion failed");
    }

    const zipPath = path.join(__dirname, "result.zip");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip");

    archive.pipe(output);
    archive.directory(outputDir, false);
    archive.finalize();

    output.on("close", () => {
      fs.unlinkSync(inputPath);
      res.download(zipPath);
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});