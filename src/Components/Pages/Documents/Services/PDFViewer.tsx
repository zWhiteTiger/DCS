import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { Card, CardContent, Typography } from '@mui/material';

type PDFServicesProps = {
  fileUrl: string | null;
};

const PDFViewer: React.FC<PDFServicesProps> = ({ fileUrl }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const goToPreviousPage = () => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    if (numPages) {
      setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const dx = e.clientX - startPosition.x;
      const dy = e.clientY - startPosition.y;

      containerRef.current.scrollLeft = scrollPosition.x - dx;
      containerRef.current.scrollTop = scrollPosition.y - dy;
    }
  };

  const handleMouseUp = () => {
    if (containerRef.current) {
      setScrollPosition({ x: containerRef.current.scrollLeft, y: containerRef.current.scrollTop });
    }
    setIsDragging(false);
  };

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1); // Default scale is 1
  const [containerWidth, setContainerWidth] = useState<number>(1077); // Initial width of 1077px
  const containerRef = useRef<HTMLDivElement>(null);

  const maxWidth = 2000;
  const minWidth = 1077; // Start from 1077px

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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setContainerWidth(1077); // รีเซ็ตความกว้างเป็น 1077
    setScale(1); // รีเซ็ตค่า scale เป็น 1
  };

  // Handle CTRL + Scroll Zoom
  useEffect(() => {
    const handleWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setScale((prev) => {
          let newScale = prev;
          if (e.deltaY > 0) {
            newScale = Math.max(prev - 0.1, 1); // Zoom out
          } else {
            newScale = Math.min(prev + 0.1, 3); // Zoom in
          }
          const width = 1077 * newScale; // Starting width of 1077px
          if (width >= minWidth && width <= maxWidth) {
            return newScale;
          }
          return prev; // Keep previous scale if out of bounds
        });
      }
    };

    const pdfContainer = containerRef.current;
    if (pdfContainer) {
      pdfContainer.addEventListener('wheel', handleWheelZoom);
    }

    return () => {
      if (pdfContainer) {
        pdfContainer.removeEventListener('wheel', handleWheelZoom);
      }
    };
  }, []);



  return (
    <Card style={{ background: '#000', color: '#FFF', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          <Typography variant='h5' style={{ padding: 7 }}>
            FileName
          </Typography>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">{`หน้า ${pageNumber} ของ ${numPages || 1}`}</Typography>
            <div style={{ display: 'flex', marginLeft: '20px' }}>
              <button onClick={goToPreviousPage} disabled={pageNumber === 1} style={buttonStyle}>
                <GrFormPrevious />
              </button>
              <button onClick={goToNextPage} disabled={pageNumber === numPages} style={buttonStyle}>
                <GrFormNext />
              </button>
            </div>
          </div>
        </div>
        <div
          ref={containerRef}
          style={{
            marginTop: '20px',
            position: 'relative',
            width: '100%',
            height: '750px',
            maxHeight: '750px',
            overflow: 'auto',
            scrollbarWidth: 'thin', // For Firefox
            scrollbarColor: '#5D5D5D #333', // For Firefox
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="custom-scrollbar" // For Chrome, Edge, and Safari
        >
          <Document file={`${import.meta.env.VITE_URL}${fileUrl}`} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              renderAnnotationLayer={false}
              renderTextLayer={false}
              pageNumber={pageNumber}
              scale={scale}
              width={containerWidth}
            />
          </Document>
        </div>
      </CardContent>
    </Card>
  );
};

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
  background: 'none',
  color: 'white',
  fontSize: '80px',
  cursor: 'pointer',
};

export default PDFViewer;