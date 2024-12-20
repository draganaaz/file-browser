import { FILE_TYPE } from '../constants/fileTree';

export interface FileNode {
  id: string;
  name: string;
  type: FILE_TYPE;
  children?: FileNode[];
  fileContent?: string;
  createdAt?: Date;
}
