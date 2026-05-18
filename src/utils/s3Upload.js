import axios from "axios";

const UPLOAD_TIMEOUT_MS = 600_000;

/**
 * Presign + PUT files directly to S3 (bypasses Vercel body size limit).
 * @param {string} backendUrl
 * @param {string} projectName
 * @param {{ field: string, file: File }[]} entries
 * @returns {Promise<{ field: string, publicUrl: string, file: File }[]>}
 */
export async function uploadProjectFilesToS3(backendUrl, projectName, entries) {
  if (!entries.length) return [];

  const { data } = await axios.post(
    `${backendUrl}/api/project/presignUploads`,
    {
      projectName,
      files: entries.map(({ field, file }) => ({
        field,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      })),
    },
    { timeout: 30_000 }
  );

  if (!data?.success || !Array.isArray(data.uploads)) {
    throw new Error(data?.message || "Could not get upload URLs");
  }

  if (data.uploads.length !== entries.length) {
    throw new Error("Upload URL count mismatch");
  }

  await Promise.all(
    data.uploads.map((upload, i) => {
      const file = entries[i].file;
      return axios.put(upload.uploadUrl, file, {
        headers: { "Content-Type": file.type || "application/octet-stream" },
        timeout: UPLOAD_TIMEOUT_MS,
      });
    })
  );

  return data.uploads.map((upload, i) => ({
    field: upload.field,
    publicUrl: upload.publicUrl,
    file: entries[i].file,
  }));
}

export function galleryTitleFromFile(file) {
  return file.name.replace(/\s+/g, "_").split(".")[0];
}
