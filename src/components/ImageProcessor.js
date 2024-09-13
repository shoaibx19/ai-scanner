import React, { useEffect, useState } from 'react';
import { createWorker, createScheduler } from 'tesseract.js';

function ImageProcessor({ file, onDataExtracted }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const processImage = async () => {
      try {
        setStatus('Initializing OCR...');
        const scheduler = createScheduler();
        const worker1 = await createWorker();
        const worker2 = await createWorker();
        await worker1.loadLanguage('eng');
        await worker2.loadLanguage('eng');
        await worker1.initialize('eng');
        await worker2.initialize('eng');
        scheduler.addWorker(worker1);
        scheduler.addWorker(worker2);

        setStatus('Processing image...');
        const [fullResult, segmentedResults] = await Promise.all([
          scheduler.addJob('recognize', file),
          processImageSegments(file, scheduler)
        ]);

        await scheduler.terminate();

        const fullExtractedData = extractInformation(fullResult.data.text);
        const segmentedExtractedData = combineSegmentResults(segmentedResults);
        
        const finalExtractedData = combineResults(fullExtractedData, segmentedExtractedData);
        console.log('Final extracted data:', finalExtractedData);

        if (finalExtractedData.vin || finalExtractedData.desc || finalExtractedData.yrMdl) {
          onDataExtracted(finalExtractedData);
          setStatus('Processing complete');
        } else {
          setStatus('Failed to extract information. Please try a different image.');
        }
      } catch (error) {
        console.error('Error processing image:', error);
        setStatus('Error processing image. Please try again.');
      }
    };

    if (file) {
      processImage();
    }
  }, [file, onDataExtracted]);

  const processImageSegments = async (file, scheduler) => {
    const img = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const segments = [
      { x: 0, y: 0, width: img.width, height: img.height / 3 },
      { x: 0, y: img.height / 3, width: img.width, height: img.height / 3 },
      { x: 0, y: 2 * img.height / 3, width: img.width, height: img.height / 3 }
    ];

    const segmentResults = await Promise.all(segments.map(async (segment) => {
      const segmentCanvas = document.createElement('canvas');
      segmentCanvas.width = segment.width;
      segmentCanvas.height = segment.height;
      const segmentCtx = segmentCanvas.getContext('2d');
      segmentCtx.drawImage(canvas, segment.x, segment.y, segment.width, segment.height, 0, 0, segment.width, segment.height);
      const blob = await new Promise(resolve => segmentCanvas.toBlob(resolve));
      return scheduler.addJob('recognize', blob);
    }));

    return segmentResults;
  };

  const combineSegmentResults = (segmentResults) => {
    let combinedText = segmentResults.map(result => result.data.text).join(' ');
    return extractInformation(combinedText);
  };

  const extractInformation = (text) => {
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    return {
      vin: extractVIN(cleanedText),
      desc: extractDESC(cleanedText),
      yrMdl: extractYRMDL(cleanedText)
    };
  };

  const extractVIN = (text) => {
    const vinPatterns = [
      /VIN:\s*([A-HJ-NPR-Z0-9]{17})/i,
      /\b([A-HJ-NPR-Z0-9]{17})\b/,
      /VEHICLE\s+ID\s+NUMBER:\s*([A-HJ-NPR-Z0-9]{17})/i
    ];

    for (const pattern of vinPatterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  const extractDESC = (text) => {
    const descPatterns = [
      /DESC\.?:?\s*(COROLLA\s+LE)/i,
      /DESC\.?:?\s*(\w+(?:\s+\w+)?)/i,
      /TOYOTA\s+(COROLLA\s+LE)/i,
      /TOYOTA\s+(\w+(?:\s+\w+)?)/i
    ];

    for (const pattern of descPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().toUpperCase();
      }
    }

    return '';
  };

  const extractYRMDL = (text) => {
    const yrMdlPatterns = [
      /YR\/MDL:\s*(\d{4}\/\d+[A-Z]?)/i,
      /(\d{4})\/(\d+[A-Z]?)/
    ];

    for (const pattern of yrMdlPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[2]) {
          return `${match[1]}/${match[2]}`;
        }
        return match[1];
      }
    }

    return '';
  };

  const combineResults = (result1, result2) => {
    return {
      vin: result1.vin || result2.vin,
      desc: result1.desc || result2.desc,
      yrMdl: result1.yrMdl || result2.yrMdl
    };
  };

  return (
    <div>
      <p>{status}</p>
    </div>
  );
}

export default ImageProcessor;