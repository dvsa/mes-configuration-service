export const removeTrailingSlash = (str: string): string => {
  const expr = /\/+$/;
  return String(str).replace(expr, '');
};
