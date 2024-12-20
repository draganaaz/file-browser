export const isValidFileName = (name: string): boolean => {
  const invalidChars = /[&"<>#{}%~/\\]/g;
  return !invalidChars.test(name) && name.trim().length > 0;
};
