import React, { useState, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { GrFormPrevious, GrFormNext } from 'react-icons/gr'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { httpClient } from '../../Utility/HttpClient'

type PDFServicesProps = {
  fileUrl: string | null
  docId?: string | null
}

type Shape = {
  id: string
  type: 'rectangle' | 'circle'
  x: number
  y: number
  width: number
  height: number
  page: number // Page where the card was created
  firstName: string
  lastName: string
  isApproved: string // String field for approval status
  signaturePath?: string // Optional signature path if approved
}

interface Card {
  id: string
  email: string
  firstName: string
  lastName: string
  position: { x: number; y: number }[]
  page: number
  isApproved: string // Approval status
  signaturePath?: string // Signature path if approved
}


const PDFViewer: React.FC<PDFServicesProps> = ({ fileUrl, docId }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [scrollPosition, setScrollPosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1) // Default scale is 1
  const [containerWidth, setContainerWidth] = useState<number>(1077) // Initial width of 1077px
  const containerRef = useRef<HTMLDivElement>(null)
  const [shapes, setShapes] = useState<Shape[]>([]) // Track added shapes

  const goToPreviousPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1))
  }

  const goToNextPage = () => {
    if (numPages) {
      setPageNumber((prevPage) => Math.min(prevPage + 1, numPages))
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const dx = e.clientX - startPosition.x
      const dy = e.clientY - startPosition.y

      containerRef.current.scrollLeft = scrollPosition.x - dx
      containerRef.current.scrollTop = scrollPosition.y - dy
    }
  }

  const handleMouseUp = () => {
    if (containerRef.current) {
      setScrollPosition({
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop,
      })
    }
    setIsDragging(false)
  }

  const maxWidth = 1980
  const minWidth = 1077 // Start from 1077px

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)

    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setContainerWidth(1077) // รีเซ็ตความกว้างเป็น 1077
    setScale(1) // รีเซ็ตค่า scale เป็น 1
  }

  // Handle CTRL + Scroll Zoom
  useEffect(() => {
    const handleWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        setScale((prev) => {
          let newScale = prev
          if (e.deltaY > 0) {
            newScale = Math.max(prev - 0.1, 1) // Zoom out
          } else {
            newScale = Math.min(prev + 0.1, 3) // Zoom in
          }
          const width = 1077 * newScale // Starting width of 1077px
          if (width >= minWidth && width <= maxWidth) {
            return newScale
          }
          return prev // Keep previous scale if out of bounds
        })
      }
    }

    const pdfContainer = containerRef.current
    if (pdfContainer) {
      pdfContainer.addEventListener('wheel', handleWheelZoom)
    }

    return () => {
      if (pdfContainer) {
        pdfContainer.removeEventListener('wheel', handleWheelZoom)
      }
    }
  }, [])

  // Fetch cards for the current document
  const fetchCards = async () => {
    try {
      const response = await httpClient.get(`/approval/${docId}`)
      const cards: Card[] = response.data
      console.log(cards)
      // Map the cards to the Shape type
      setShapes(
        cards.map((card: any) => ({
          id: card._id, // Now the string id will work
          type: 'rectangle',
          x: card.position[0].x,
          y: card.position[0].y,
          width: 200,
          height: 100,
          page: card.page,
          firstName: card.firstName,
          lastName: card.lastName,
          isApproved: card.isApproved,
        })),
      )
    } catch (error) {
      console.error('Error fetching cards:', error)
    }
  }

  useEffect(() => {
    console.log(`doc id: ${docId}`)
    if (docId) {
      fetchCards()
    }
  }, [docId])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card
          style={{
            background: '#000',
            color: '#FFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CardContent>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography className="p-2" variant='h5'>FILENAME</Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='h6'>{`หน้า ${pageNumber} ของ ${numPages || 1
                  }`}</Typography>
                <div style={{ display: 'flex', marginLeft: '20px' }}>
                  <button
                    onClick={goToPreviousPage}
                    disabled={pageNumber === 1}
                    style={buttonStyle}
                  >
                    <GrFormPrevious />
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={pageNumber === numPages}
                    style={buttonStyle}
                  >
                    <GrFormNext />
                  </button>
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
              className='custom-scrollbar' // For Chrome, Edge, and Safari
            >
              <Document
                file={`${import.meta.env.VITE_URL}${fileUrl}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
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
                .filter((shape) => shape.page === pageNumber)
                .map((shape) =>
                  shape.isApproved === 'Approved' ? (
                    <img
                      key={shape.id}
                      src={`${import.meta.env.VITE_URL}/signature/1728983339668-700468440.png`} // ใช้เส้นทางของลายเซ็นเมื่ออนุมัติแล้ว
                      alt="Signature"
                      style={{
                        position: 'absolute',
                        left: shape.x * scale,
                        top: shape.y * scale,
                        width: `${shape.width * scale}px`,
                        height: `${shape.height * scale}px`,
                      }}
                    />
                  ) : (
                    <div
                      key={shape.id}
                      style={{
                        position: 'absolute',
                        left: shape.x * scale, // Scale the x coordinate
                        top: shape.y * scale,  // Scale the y coordinate
                        width: `${shape.width * scale}px`, // Scale the width
                        height: `${shape.height * scale}px`, // Scale the height
                        border: '2px solid rgba(0, 0, 0, 0.8)', // To make the card visible
                        borderRadius: '7px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 10,
                        transform: `scale(${scale})`, // Apply scaling transformation
                        transformOrigin: 'top left',  // Set the scaling origin to the top left corner
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="center"
                        flexDirection={"column"}
                        alignItems="center"
                        height="100%"
                      >
                        <Typography style={{ color: '#ff1f1f', fontSize: "20px", fontWeight: 'bold' }}>
                          Rejected
                        </Typography>
                        <Typography className="mt-2">
                          {shape.firstName} {shape.lastName}
                        </Typography>

                      </Box>
                    </div>
                  )
                )}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid >
  )
}

const buttonStyle = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '30px',
  color: '#FFF',
}

export default PDFViewer
