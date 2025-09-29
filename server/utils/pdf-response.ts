import { Response } from 'express';

export interface PdfResultLike {
  buffer: Buffer;
  byteLength: number;
  fileName: string;
  contentType?: string; // default application/pdf
}

export function sendPdf(res: Response, result: PdfResultLike) {
  res.setHeader('Content-Type', result.contentType || 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
  res.setHeader('Content-Length', result.byteLength);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(result.buffer);
}