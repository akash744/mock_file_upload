const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const validateFile = (file: File | null): boolean => {
  if (!file) {
    console.log("No file selected");
    return false;
  }

  if (!ALLOWED_MIME_TYPES.some((type) => file.type.startsWith(type))) {
    console.log(
      `Invalid file type. Only PDF and image files (${ALLOWED_MIME_TYPES.join(
        ", "
      )}) are allowed.`
    );
    return false;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    console.log(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
    return false;
  }

  return true;
};
