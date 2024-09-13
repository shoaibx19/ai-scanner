import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

function FileUpload({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <div className="dropzone-content">
        {isDragActive ? (
          <p>Drop the image file here...</p>
        ) : (
          <>
            <p>Drag and drop an image file here, or click to select a file</p>
            <button className="select-file-btn">Select File</button>
          </>
        )}
      </div>
    </div>
  );
}

export default FileUpload;