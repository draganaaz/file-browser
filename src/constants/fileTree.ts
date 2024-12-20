export enum FILE_TYPE {
  FOLDER = 'folder',
  FILE = 'file',
}

export const VALID_EXTENSIONS = {
  TEXT: 'txt',
  JSON: 'json',
  IMAGE: 'png',
};

export const MENU_ITEMS = [
  { label: 'New Folder', type: FILE_TYPE.FOLDER },
  {
    label: 'New Text Document',
    type: FILE_TYPE.FILE,
    extension: VALID_EXTENSIONS.TEXT,
  },
  {
    label: 'New JSON Document',
    type: FILE_TYPE.FILE,
    extension: VALID_EXTENSIONS.JSON,
  },
  {
    label: 'New Image',
    type: FILE_TYPE.FILE,
    extension: VALID_EXTENSIONS.IMAGE,
  },
];
