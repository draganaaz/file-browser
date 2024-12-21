import { initialData } from './constants/mocks';
import { FileTreeProvider } from './contexts/FileTreeContext';
import FileBrowserPage from './pages/FileBrowserPage';

function App() {
  return (
    <FileTreeProvider value={initialData}>
      <FileBrowserPage />
    </FileTreeProvider>
  );
}

export default App;
