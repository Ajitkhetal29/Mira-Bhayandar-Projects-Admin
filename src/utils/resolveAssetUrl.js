/** Full S3/https URL as-is; legacy `uploads/...` paths prefixed with backend. */
export function resolveAssetUrl(path, backendUrl) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const clean = String(path).replace(/^\/+/, "");
  return backendUrl ? `${backendUrl}/${clean}` : `/${clean}`;
}
