// Stockage des images par URL (pas besoin de Firebase Storage payant)
// L'admin colle directement les liens des photos

export function validateImageUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
