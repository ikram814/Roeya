import React from 'react';
import CircularVideoPlayer from './components/CircularVideoPlayer';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <CircularVideoPlayer />
      </div>
    </ThemeProvider>
  );
}

export default App;