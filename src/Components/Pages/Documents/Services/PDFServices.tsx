import { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import pdf from '../../../../1722508011417.pdf';
import { GrZoomIn, GrZoomOut, GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { Card, CardContent, Typography } from '@mui/material';

type Props = {}

export default function PDFServices({ }: Props) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0); // Default scale to be set
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    if (containerWidth > 0) {
      // Set default scale to fit 800px width
      setScale(800 / containerWidth);
    }
  }, [containerWidth]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const maxWidth = 1075; // Maximum width in pixels
  const minWidth = 800; // Minimum width in pixels

  const handleZoomIn = () => {
    // Calculate the new scale to achieve a width within the limits
    const newScale = Math.min(scale + 0.1, maxWidth / containerWidth);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    // Calculate the new scale to achieve a width within the limits
    const newScale = Math.max(scale - 0.1, minWidth / containerWidth);
    setScale(newScale);
  };

  const goToPreviousPage = () => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    if (numPages) {
      setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
    }
  };

  return (
    <Card style={{ background: '#000', color: '#FFF', width: '100%', position: 'relative' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">ชื่อไฟล์ PDF</Typography>
          <Typography variant="h6">{`หน้า ${pageNumber} ของ ${numPages || 1}`}</Typography>
        </div>
        <div
          ref={containerRef}
          style={{ marginTop: '20px', position: 'relative', width: '100%' }}
        >
          <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              renderAnnotationLayer={false}
              renderTextLayer={false}
              pageNumber={pageNumber}
              scale={scale}
              width={containerWidth}
            />
          </Document>
          <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column' }}>
            <button onClick={handleZoomIn} style={buttonStyle}><GrZoomIn /></button>
            <button onClick={handleZoomOut} style={buttonStyle}><GrZoomOut /></button>
            <button onClick={goToPreviousPage} disabled={pageNumber === 1} style={buttonStyle}>
              <GrFormPrevious />
            </button>
            <button onClick={goToNextPage} disabled={pageNumber === numPages} style={buttonStyle}>
              <GrFormNext />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '5px',
  padding: '10px',
  borderRadius: '12px',
  border: 'none',
  width: '50px',
  height: '50px',
  background: '#007bff',
  color: 'white',
  fontSize: '18px',
  cursor: 'pointer',
};
