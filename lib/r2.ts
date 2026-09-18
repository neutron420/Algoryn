import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "algroyn";
const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "") || "";

export const r2Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
  forcePathStyle: true,
});

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

/**
 * Uploads a file buffer directly to Cloudflare R2 and returns its public URL.
 */
export async function uploadToR2(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  folder = "discussions"
): Promise<UploadResult> {
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 environment variables are missing.");
  }
  
  const sanitizedName = fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");
  const uniqueKey = `${folder}/${Date.now()}-${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueKey,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  const url = `${publicBaseUrl}/${uniqueKey}`;

  return {
    url,
    key: uniqueKey,
    bucket: bucketName,
  };
}
