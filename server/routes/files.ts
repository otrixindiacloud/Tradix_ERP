import type { Express } from "express";
import multer, { type StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadsDir = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

export function registerFileRoutes(app: Express) {
  // File upload endpoint - support both single and multiple files
  app.post("/api/files/upload", upload.array('files', 10), async (req, res) => {
    try {
      console.log('File upload request received');
      console.log('Content-Type:', req.headers['content-type']);
      console.log('req.files:', req.files);
      
      let files: any[] = [];
      
      // Handle multiple files upload
      if (req.files && Array.isArray(req.files)) {
        files = req.files;
      }
      // Handle single file upload as array
      else if (req.file) {
        files = [req.file];
      }
      
      console.log('Files processed:', files.length);
      
      if (files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedFiles = files.map((file: any) => ({
        id: path.parse(file.filename).name, // UUID without extension
        name: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: `/api/files/download/${file.filename}`,
        uploadedAt: new Date().toISOString(),
      }));

      console.log('Responding with uploaded files:', uploadedFiles);

      res.json({
        message: "Files uploaded successfully",
        files: uploadedFiles,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ message: "Failed to upload files", error: (error as Error).message });
    }
  });

  // File download endpoint
  app.get("/api/files/download/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsDir, filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Security check: ensure the file is within uploads directory
      const realPath = fs.realpathSync(filePath);
      const realUploadsDir = fs.realpathSync(uploadsDir);
      if (!realPath.startsWith(realUploadsDir)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Set appropriate headers
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // File info endpoint
  app.get("/api/files/info/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsDir, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      const stats = fs.statSync(filePath);
      
      res.json({
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      });
    } catch (error) {
      console.error("Error getting file info:", error);
      res.status(500).json({ message: "Failed to get file info" });
    }
  });

  // Delete file endpoint
  app.delete("/api/files/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsDir, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Security check
      const realPath = fs.realpathSync(filePath);
      const realUploadsDir = fs.realpathSync(uploadsDir);
      if (!realPath.startsWith(realUploadsDir)) {
        return res.status(403).json({ message: "Access denied" });
      }

      fs.unlinkSync(filePath);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });
}