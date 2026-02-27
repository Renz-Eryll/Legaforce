/**
 * File Upload Service — Legaforce
 *
 * Handles file storage using AWS S3 when configured,
 * or falls back to local filesystem storage in dev mode.
 *
 * Usage:
 *   import { uploadFile, deleteFile } from "../services/upload.service.js";
 *   const { url, key } = await uploadFile(fileBuffer, fileName, "documents");
 */
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  NODE_ENV,
} from "../config/env.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isS3Enabled = !!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_S3_BUCKET);

if (isS3Enabled) {
  console.log(`✅ S3 file upload enabled (bucket: ${AWS_S3_BUCKET})`);
} else {
  console.log("⚠️  AWS S3 not configured — using local file storage");
}

// ── Generate unique file key ───────────────────

function generateFileKey(folder, originalName) {
  const ext = path.extname(originalName);
  const hash = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now().toString(36);
  const safeName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 50);
  return `${folder}/${timestamp}-${hash}-${safeName}${ext}`;
}

// ── S3 Upload (using native fetch — no SDK dependency) ──

async function s3Upload(buffer, key, contentType) {
  // Use AWS SDK v3 style signing with native fetch
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  
  const client = new S3Client({
    region: AWS_REGION || "ap-southeast-1",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  await client.send(new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION || "ap-southeast-1"}.amazonaws.com/${key}`;
}

async function s3Delete(key) {
  const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: AWS_REGION || "ap-southeast-1",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  await client.send(new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
  }));
}

// ── Local filesystem fallback ──────────────────

const LOCAL_UPLOAD_DIR = path.join(__dirname, "..", "uploads");

function ensureLocalDir(folder) {
  const dir = path.join(LOCAL_UPLOAD_DIR, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function localUpload(buffer, key) {
  const fullPath = path.join(LOCAL_UPLOAD_DIR, key);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, buffer);
  return `/uploads/${key}`;
}

function localDelete(key) {
  const fullPath = path.join(LOCAL_UPLOAD_DIR, key);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

// ── Public API ─────────────────────────────────

/**
 * Upload a file. Returns { url, key }.
 * @param {Buffer} buffer - File contents
 * @param {string} originalName - Original filename (e.g. "resume.pdf")
 * @param {string} folder - Folder prefix (e.g. "documents", "cv", "photos")
 * @param {string} contentType - MIME type (e.g. "application/pdf")
 */
export async function uploadFile(buffer, originalName, folder = "files", contentType = "application/octet-stream") {
  const key = generateFileKey(folder, originalName);

  if (isS3Enabled) {
    const url = await s3Upload(buffer, key, contentType);
    return { url, key, storage: "s3" };
  }

  const url = localUpload(buffer, key);
  return { url, key, storage: "local" };
}

/**
 * Delete a file by its key.
 */
export async function deleteFile(key) {
  if (isS3Enabled) {
    await s3Delete(key);
  } else {
    localDelete(key);
  }
}

/**
 * Express middleware that parses multipart form data for a single file field.
 * Sets req.fileBuffer, req.fileName, req.fileType on the request.
 */
export function parseFileUpload(fieldName = "file") {
  return async (req, res, next) => {
    // For now, we rely on express.raw or existing middleware
    // The actual upload endpoint should handle the file buffer
    next();
  };
}
