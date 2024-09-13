import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ImageProcessor from './components/ImageProcessor';
import Invoice from './components/Invoice';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(1);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setExtractedData(null);
  };

  const handleDataExtraction = (data) => {
    setExtractedData(data);
    setInvoiceNumber(prevNumber => prevNumber + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Scanner</h1>
      </header>
      <main className="App-main">
        <div className="left-panel">
          <FileUpload onFileUpload={handleFileUpload} />
          {file && !extractedData && <ImageProcessor file={file} onDataExtracted={handleDataExtraction} />}
        </div>
        <div className="right-panel">
          {extractedData && <Invoice data={extractedData} invoiceNumber={invoiceNumber - 1} />}
        </div>
      </main>
    </div>
  );
}

export default App;