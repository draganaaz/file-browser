import Header from './components/Header/Header';
import FileTreeView from './components/FileTreeView/FileTreeView';
import FileViewer from './components/FileViewer/FileViewer';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <div className="w-1/3 border-r">
          <FileTreeView />
        </div>
        <div className="w-2/3">
          <FileViewer />
        </div>
      </div>
    </div>
  );
}

export default App;
