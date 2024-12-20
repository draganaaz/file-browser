# File Browser Application

## Overview

This project is a web-based **File Browser** application implemented using **React**, **TypeScript**, and **Tailwind CSS**. It allows users to interact with a file system-like structure to perform operations such as viewing, creating, renaming, and deleting files and folders. The application also supports breadcrumb navigation, file filtering, and editing for text and JSON files.

The supported file types are:

- **PNG**: Displays images directly in the viewer.
- **TXT**: Displays plain text with an editing option.
- **JSON**: Displays structured JSON content with an editing option.

Unit tests are written with **Jest** to ensure key functionalities are covered.

---

## Features

### Core Functionalities

#### 1. File Browser Tree

- Expandable folders showing nested files and subfolders.
- Context menus for actions such as "Add New", "Rename", "Delete", and "Details".
- Real-time updates when adding, renaming, or deleting files and folders.
- Input validation to ensure unique and valid file/folder names.

#### 2. Viewer/Editor

- **PNG Files**: Displayed as images in the viewer.
- **TXT and JSON Files**:
  - Editable using a rich-text editor.
  - Save or discard changes.
- Folder contents are displayed as lists.

#### 3. Breadcrumb Navigation

- Displays the current path in the folder hierarchy.
- Allows navigation to any parent folder by clicking on a breadcrumb segment.
- Automatically updates the treeview and viewer.

#### 4. Header and Search

- A search bar filters the file tree recursively.
- Matching files and their ancestor folders are displayed.
- Debounced input handling optimizes performance.

### Additional Features

- **Validation and Error Handling**:
  - Ensures valid file names and extensions.
  - Provides clear error messages for invalid operations.
- **Modal Support**:
  - Displays detailed information about files and folders in a modal.

---

## Design and Data Modeling

### File Tree Data Structure

The file tree is modeled as a recursive structure:

```typescript
interface FileNode {
  id: string;
  name: string;
  type: FILE_TYPE; // Either 'FILE' or 'FOLDER'
  fileContent?: string; // For file nodes only
  children?: FileNode[]; // For folder nodes only
  createdAt?: Date; // Metadata for details
}
```
