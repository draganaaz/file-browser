import { FILE_TYPE } from '../constants/enums';

export interface FileNode {
  id: string;
  name: string;
  type: FILE_TYPE;
  children?: FileNode[];
}
