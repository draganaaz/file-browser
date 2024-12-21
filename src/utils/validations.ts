import { FILE_TYPE, VALID_EXTENSIONS } from '../constants/fileTree';

// Validates if a file or folder name contains invalid characters
// and is not empty or whitespace only.
export const isValidFileName = (name: string): boolean => {
  const invalidChars = /[&"<>#{}%~/\\]/g;
  return !invalidChars.test(name) && name.trim().length > 0;
};

// Validates a file or folder name and its extension.
// Returns an object indicating whether the name and extension are valid,
// an error message if invalid, and the processed name if valid.
export const validateNameAndExtension = (
  name: string,
  type: FILE_TYPE,
  currentExtension: string | null
): { valid: boolean; error?: string; processedName?: string } => {
  const nameParts = name.trim().split('.');
  const baseName = nameParts.slice(0, -1).join('.') || nameParts[0];
  const extension = nameParts.length > 1 ? nameParts.pop() : currentExtension;

  // Validate folder names without extensions
  if (type === FILE_TYPE.FILE) {
    if (extension && !Object.values(VALID_EXTENSIONS).includes(extension)) {
      return { valid: false, error: 'Invalid file extension.' };
    }
    return { valid: true, processedName: `${baseName}.${extension}` };
  }

  // For folders, ensure no extensions and validate base name
  if (!isValidFileName(baseName)) {
    return {
      valid: false,
      error: 'Invalid name. Please avoid special characters.',
    };
  }

  return { valid: true, processedName: baseName };
};
