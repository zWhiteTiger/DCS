import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Button, Input } from 'antd';
import { FaPenNib } from 'react-icons/fa';
import Draggable from 'react-draggable';
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { docSelector } from '../../../../Store/Slices/DocSlice';

type PDFServicesProps = {
  fileUrl: string | null;
  approvers: string[];
  setApprovers: (approvers: string[]) => void;
};

type Shape = {
  id: number;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  page: number; // เพิ่มข้อมูลหน้าที่การ์ดถูกสร้าง
};

const PDFServices: React.FC<PDFServicesProps> = ({ fileUrl, approvers, setApprovers }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1); // Default scale is 1
  const [containerWidth, setContainerWidth] = useState<number>(1077); // Initial width of 1077px
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // Track selected card
  const [shapes, setShapes] = useState<Shape[]>([]); // Track added shapes

  const docReducer = useSelector(docSelector)

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


  // ---------------------------------------การ์ด----------------------------------------


  // Add the "parent" card when button is clicked
  const addRectangle = () => {
    const newShape: Shape = {
      id: shapes.length + 1,
      type: 'rectangle',
      x: 445,
      y: 600,
      width: 200,
      height: 100,
      page: pageNumber, // บันทึกหมายเลขหน้าปัจจุบัน
    };
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  // Update position of the card
  const updateShapePosition = (id: number, x: number, y: number) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) => (shape.id === id ? { ...shape, x, y } : shape))
    );

    // ส่งตำแหน่งที่อัปเดตไปยังเซิร์ฟเวอร์
    // await axios.post('/approval/${id}', { id, x, y });
  };

  // Handle clicking to select the card
  const handleCardClick = (id: number) => {
    setSelectedCardId(id); // Set the selected card
  };

  // Delete card by clicking the delete button on the card
  const handleDeleteCard = (id: number) => {
    // await axios.delete(`/approval/${id}`);

    setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== id));
  };

  // Handle pressing the Delete key to remove the selected card
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedCardId !== null) {
        handleDeleteCard(selectedCardId); // Delete the selected card
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCardId]);

  return (
    <Card style={{ background: '#000', color: '#FFF', position: 'relative', overflow: 'hidden' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          <Input
            placeholder='Rename'
            prefix={<FaPenNib />}
            size='large'
            style={{ width: '300px' }}
            defaultValue={docReducer.result?.docName} />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">{`หน้า ${pageNumber} ของ ${numPages || 1}`}</Typography>
            <div style={{ display: 'flex', marginLeft: '20px' }}>
              <button onClick={goToPreviousPage} disabled={pageNumber === 1} style={buttonStyle}>
                <GrFormPrevious />
              </button>
              <button onClick={goToNextPage} disabled={pageNumber === numPages} style={buttonStyle}>
                <GrFormNext />
              </button>
              <button onClick={addRectangle}>Add Draggable Card</button>
            </div>
          </div>
        </div>
        <div
          ref={containerRef}
          style={{
            marginTop: '20px',
            position: 'relative', // Required for bounds to work
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
          <Document file={`http://localhost:4444${fileUrl}`} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              renderAnnotationLayer={false}
              renderTextLayer={false}
              pageNumber={pageNumber}
              scale={scale}
              width={containerWidth}
            />
          </Document>

          {/* Render each draggable card */}
          {shapes
            .filter((shape) => shape.page === pageNumber) // แสดงการ์ดเฉพาะหน้าปัจจุบัน
            .map((shape) => (
              <Draggable
                key={shape.id}
                bounds={{
                  left: 0,
                  top: 0,
                  right: containerRef.current ? containerRef.current.scrollWidth - shape.width : 0,
                  bottom: containerRef.current ? containerRef.current.scrollHeight - shape.height : 0,
                }}
                defaultPosition={{ x: shape.x, y: shape.y }}
                onStop={(_e, data) => {
                  // ปรับพิกัดเมื่อหยุดลาก
                  updateShapePosition(shape.id, data.x, data.y);
                }}
                onMouseDown={(e: MouseEvent) => {
                  e.stopPropagation(); // ป้องกันการลาก PDF
                }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(shape.id); // เลือกการ์ด
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: `${shape.width}px`,
                    height: `${shape.height}px`,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '2px dashed #8000FF',
                    borderRadius: '7px',
                    cursor: 'grab',
                  }}
                >
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      gap: '10px',
                    }}
                  >
                    <Typography style={{ color: "#4318FF", fontWeight: "bold", fontSize: "16px" }}>
                      ผู้ลงนาม
                    </Typography>
                    <Button type="primary" style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}>
                      เพิ่มผู้ลงนาม
                    </Button>
                  </Box>

                  {selectedCardId === shape.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(shape.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '0px',
                        color: '#FF0000',
                        border: 'none',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                      }}
                    >
                      <ImCross />
                    </button>
                  )}
                </div>
              </Draggable>
            ))}
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

export default PDFServices;