/** Max size per image for admin portfolio uploads (client + server must match). */
export const MAX_ADMIN_IMAGE_BYTES = 2 * 1024 * 1024;

export function formatMaxImageSizeLabel() {
  const mb = MAX_ADMIN_IMAGE_BYTES / (1024 * 1024);
  return `${mb}MB`;
}
