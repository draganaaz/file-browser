import { FileNode } from '../types/FileNode';
import { FILE_TYPE } from './fileTree';

export const initialData: FileNode[] = [
  {
    id: '1',
    name: 'public',
    type: FILE_TYPE.FOLDER,
    children: [
      {
        id: '1-1',
        name: 'exus-logo.png',
        type: FILE_TYPE.FILE,
        fileContent: '/exus.png',
      },
    ],
  },
  {
    id: '2',
    name: 'server',
    type: FILE_TYPE.FOLDER,
    children: [
      {
        id: '2-1',
        name: 'config.json',
        type: FILE_TYPE.FILE,
        fileContent: '{"key": "value"}',
      },
      {
        id: '2-2',
        name: 'notes.txt',
        type: FILE_TYPE.FILE,
        fileContent: 'This is a sample text file.',
      },
    ],
  },
  {
    id: '3',
    name: 'src',
    type: FILE_TYPE.FOLDER,
    children: [],
  },
];
