import * as crypto from "crypto";

const algorithm = "aes-256-ctr";
const secretKey = process.env.ENCRYPTION_SECRET_KEY || "";
const iv = process.env.ENCRYPTION_IV || "";

if (!secretKey || secretKey.length !== 32) {
  throw new Error("ENCRYPTION_SECRET_KEY must be exactly 32 characters");
}

if (!iv || iv.length !== 32) {
  throw new Error("ENCRYPTION_IV must be exactly 32 hex characters");
}

// Decrypt helper
export const apsisDecrypt = (encryptedData: string): string => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(String(encryptedData), "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

// Encrypt helper (optional)
export const apsisEncrypt = (data: string): string => {
  const cipher = crypto.createCipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return encrypted.toString("hex");
};
