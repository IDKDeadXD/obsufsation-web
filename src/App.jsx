import React, { useState } from 'react';
import { Upload, Folder } from 'lucide-react';
import backgroundImage from './images/background.png';

const App = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const fileArray = Array.from(event.target.files).filter(file => 
      file.name.endsWith('.js') || file.name.endsWith('.jsx')
    );
    setFiles(fileArray);
    setResult(null);
  };

  const handleObfuscate = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await fetch('https://203.161.56.90:3002/api/obfuscate-folder', {
        method: 'POST',
        body: formData,
      });
      
      

      if (!response.ok) {
        throw new Error('Obfuscation failed');
      }

      const blob = await response.blob();
      setResult({
        blob,
        fileName: 'obfuscated_scripts.zip'
      });
    } catch (error) {
      console.error('Error during obfuscation:', error);
      alert('Failed to obfuscate files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center py-8 px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for backdrop blur */}
      <div className="absolute inset-0" style={{ backdropFilter: 'blur(8px)' }} />

      <div className="w-full max-w-2xl relative z-10">
        <div className="backdrop-blur-sm bg-white/30 rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">
            JavaScript File Obfuscator
          </h1>
          
          <div className="space-y-6">
            <div className="border-2 border-white/30 rounded-xl p-8 text-center backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300">
              <input
                type="file"
                webkitdirectory="true"
                directory="true"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="folder-upload"
              />
              <label 
                htmlFor="folder-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Folder className="w-16 h-16 text-white/80 mb-4" />
                <span className="text-lg text-white/80 mb-2">
                  {files.length > 0 
                    ? `${files.length} JavaScript files selected` 
                    : 'Click to upload a folder'}
                </span>
                <span className="text-sm text-white/60">
                  Only .js and .jsx files will be processed
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="bg-white/10 rounded-lg p-4 max-h-40 overflow-y-auto">
                <h3 className="text-white/80 font-semibold mb-2">Selected files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="text-white/70 text-sm">
                    {file.name}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleObfuscate}
                disabled={files.length === 0 || isProcessing}
                className={`px-8 py-3 rounded-lg text-white text-lg font-semibold transition-all duration-300 ${
                  files.length === 0 || isProcessing
                    ? 'bg-gray-400/50 cursor-not-allowed'
                    : 'bg-blue-500/80 hover:bg-blue-600/80 hover:shadow-lg'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Obfuscate All Files'}
              </button>
            </div>

            {result && (
              <div className="mt-8">
                <div className="flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-green-500/80 text-white rounded-lg hover:bg-green-600/80 transition-all duration-300 hover:shadow-lg"
                  >
                    Download Obfuscated Files (ZIP)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
