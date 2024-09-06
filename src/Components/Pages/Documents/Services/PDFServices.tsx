import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { GrZoomIn, GrZoomOut, GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { Card, CardContent, Typography } from '@mui/material';
import { Input } from 'antd';
import { FaPenNib } from 'react-icons/fa';

type PDFServicesProps = {
  fileUrl: string | null;
  approvers: string[];
  setApprovers: (approvers: string[]) => void;
};

const PDFServices: React.FC<PDFServicesProps> = ({ fileUrl, approvers, setApprovers }) => {
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
  const [containerWidth, setContainerWidth] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxWidth = 2000;
  const minWidth = 1075;

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

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.2, 1); // Minimum scale of 1
      const width = 1000 * newScale; // Assuming the original document width is 1000px
      return width >= minWidth ? newScale : prev;
    });
  };

  const handleZoomIn = () => {
    setScale((prev) => {
      const newScale = Math.min(prev + 0.2, 3); // Maximum scale of 3
      const width = 1000 * newScale; // Assuming the original document width is 1000px
      return width <= maxWidth ? newScale : prev;
    });
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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
          const width = 1000 * newScale; // Assuming the original document width is 1000px
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

          <Input
            placeholder='Rename'
            prefix={<FaPenNib />}
            size='large'
            style={{ width: '300px' }}
            defaultValue="26888888" />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">{`หน้า ${pageNumber} ของ ${numPages || 1}`}</Typography>
            <div style={{ display: 'flex', marginLeft: '20px' }}>
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
            // cursor: isDragging ? 'grabbing' : 'grab',
            scrollbarWidth: 'thin', // For Firefox
            scrollbarColor: '#5D5D5D #333', // For Firefox
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="custom-scrollbar" // For Chrome, Edge, and Safari
        >
          <Document file={`http://localhost:4444${fileUrl}`} onLoadSuccess={onDocumentLoadSuccess}>
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
  background: '#007bff',
  color: 'white',
  fontSize: '18px',
  cursor: 'pointer',
};

export default PDFServices;






// // ฟังก์ชันที่ใช้เพื่อทำ zoom เมื่อกด CTRL + เลื่อนลูกกลิ้ง
// const handleWheelZoom = (e: WheelEvent) => {
//   if (e.ctrlKey) { // ตรวจสอบว่าปุ่ม CTRL ถูกกดอยู่หรือไม่
//     e.preventDefault();
//     if (e.deltaY < 0) {
//       // เลื่อนขึ้น -> ขยาย
//       handleZoomIn();
//     } else {
//       // เลื่อนลง -> ลดขนาด
//       handleZoomOut();
//     }
//   }
// };

// useEffect(() => {
//   const containerElement = containerRef.current;

//   if (containerElement) {
//     containerElement.addEventListener('wheel', handleWheelZoom);
//   }

//   return () => {
//     if (containerElement) {
//       containerElement.removeEventListener('wheel', handleWheelZoom);
//     }
//   };
// }, [scale]);


// const containerRef = useRef<HTMLDivElement>(null);

// useEffect(() => {
//   const updateWidth = () => {
//     if (containerRef.current) {
//       setContainerWidth(containerRef.current.clientWidth);
//     }
//   };

//   updateWidth();
//   window.addEventListener('resize', updateWidth);

//   return () => {
//     window.removeEventListener('resize', updateWidth);
//   };
// }, []);

// useEffect(() => {
//   if (containerWidth > 0) {
//     setScale(minWidth / containerWidth);
//   }
// }, [containerWidth]);

// function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
//   setNumPages(numPages);
// }

// const handleZoomIn = () => {
//   const newScale = Math.min(scale + 0.1, maxWidth / containerWidth);
//   setScale(newScale);
// };

// const handleZoomOut = () => {
//   const newScale = Math.max(scale - 0.1, minWidth / containerWidth);
//   setScale(newScale);
// };