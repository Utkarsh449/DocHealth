// Create URL for navigating between pages
export function createPageUrl(pageName) {
  if (!pageName) return "/";
  return `/${pageName}`;
}

// Optional helper function in case Base44 generated slug-based routes
export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}
