import React, { useState, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { GrFormPrevious, GrFormNext } from 'react-icons/gr'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { AutoComplete, Button, Col, Input, Row } from 'antd'
import { FaPenNib } from 'react-icons/fa'
import Draggable from 'react-draggable'
import { ImCross } from 'react-icons/im'
import axios from 'axios'
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
  priority: number
  height: number
  page: number // Page where the card was created
  firstName: string
  lastName: string
}

type OptionType = {
  id: string
  value: string // Email
  firstName: string
  lastName: string
}

interface Card {
  id: string
  email: string
  firstName: string
  lastName: string
  position: { x: number; y: number }[]
  page: number
}

const PDFServices: React.FC<PDFServicesProps> = ({ fileUrl, docId }) => {
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
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null) // Track selected card
  const [shapes, setShapes] = useState<Shape[]>([]) // Track added shapes
  const [selectedEmail, setSelectedEmail] = useState('')
  const [autoCompleteValue, setAutoCompleteValue] = useState<string>('')
  const [options, setOptions] = useState<OptionType[]>([])
  const docPath = fileUrl?.split('/').pop() // จะได้ <filename>.pdf
  const [loading, setLoading] = useState(false);

  const [initialDocName, setInitialDocName] = useState(''); // Store the initial value to compare

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

  // ---------------------------------------การ์ด----------------------------------------
  const handleUserSelector = (value: string) => {
    setSelectedEmail(value)
  }

  const fetchDocId = async () => {
    try {
      const response = await axios.get(`/doc/${docPath}`)
      return response.data._id // Assuming the doc_id is returned from this endpoint
    } catch (error) {
      console.error('Error fetching document ID:', error)
      throw error // Throw an error if the doc_id can't be fetched
    }
  }

  const updateShapePosition = async (
    id: string,
    x: number,
    y: number,
    page: number,
  ) => {
    try {
      const doc_id = await fetchDocId() // Fetch the doc_id

      // Ensure the id is not null
      if (id) {
        await httpClient.patch(`/approval/${id}`, {
          doc_id, // Use the fetched doc_id
          position: [{ x, y }], // Position should be an array of coordinates
          page, // Pass the page number
        })

        // Update the shape's position locally
        setShapes((prevShapes) =>
          prevShapes.map((shape) =>
            shape.id === id ? { ...shape, x, y } : shape,
          ),
        )
        console.log('Shape position updated successfully')
      }
    } catch (error) {
      console.error('Error updating shape position:', error)
    }
  }

  const addRectangle = async () => {
    try {
      const doc_id = await fetchDocId(); // Fetch the doc_id from the document collection

      // Calculate the next priority based on the current shapes
      const nextPriority = shapes.length; // Current shapes length will be the next available priority

      const response = await httpClient.post('/approval/create', {
        doc_id, // Use the fetched doc_id
        email: selectedEmail,
        position: [{ x: 445, y: 600 }], // Initial card position as an array
        page: pageNumber, // The page number where the card is created
        priority: nextPriority, // Set the initial priority
      });

      const cardId = response.data._id; // Use the _id from MongoDB

      const newShape: Shape = {
        id: cardId, // Use the card ID directly
        type: 'rectangle',
        x: 445,
        y: 1000,
        width: 200,
        height: 100,
        page: pageNumber,
        priority: nextPriority, // Assign the current priority
        firstName: response.data.firstName || 'N/A',
        lastName: response.data.lastName || 'N/A',
      };

      setShapes((prevShapes) => [...prevShapes, newShape]); // Add new shape
      console.log('Card created successfully with ID:', cardId);

      // Clear the state and input field
      setSelectedEmail(''); // Clear the selected email
      setAutoCompleteValue(''); // Clear the AutoComplete input value
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      // Remove the card from the frontend state
      setShapes((prevShapes) => {
        const updatedShapes = prevShapes.filter((shape) => shape.id !== id); // Remove the selected card

        // Reassign priorities to maintain sequential order
        return updatedShapes.map((shape, index) => ({
          ...shape,
          priority: index, // Assign new priority sequentially
        }));
      });

      // Delete the approval in the backend
      await axios.delete(`/approval/${id}`);
      console.log(`Card with ID ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting approval:', error);
    }
  };

  const fetchUsers = async (searchTerm: string) => {
    try {
      const response = await axios.get(`/user/search?term=${searchTerm}`)
      return response.data // Return the list of users
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  // AutoComplete options logic
  const getPanelValue = async (text: string) => {
    const users = await fetchUsers(text) // Fetch users from the backend
    return users.map((user: any) => ({
      value: user.email, // Use email as the value
      label: `${user.firstName} ${user.lastName} (${user.email})`, // Display name and email as the label
      id: user._id, // Store the user ID
    }))
  }

  // Handle clicking to select the card
  const handleCardClick = (id: string) => {
    setSelectedCardId(id) // Set the selected card
  }

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
          priority: card.priority,
          height: 100,
          page: card.page,
          firstName: card.firstName,
          lastName: card.lastName,
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

  const [docName, setDocName] = useState("");

  // Specify the type of the event parameter correctly
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocName(e.target.value);
  };

  // Correctly typing the event parameter
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.patch(`${import.meta.env.VITE_URL}/doc/${docId}`, {
        doc_name: docName,
      });

      console.log("Patch success:", response.data);
    } catch (error) {
      console.error("Patch error:", error);
    }

    // Set a timeout to reset loading state after 3 seconds
    setTimeout(() => {
      setLoading(false); // Stop loading after 3 seconds
    }, 3000);
  };

  const isButtonDisabled = docName.trim() === '' || docName === initialDocName;

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
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

              <form onSubmit={handleSubmit}>
                <Input
                  className='w-full'
                  placeholder='ชื่อเรื่อง'
                  prefix={<FaPenNib />}
                  size='large'
                  style={{ width: '400px' }}
                  onChange={handleInputChange} // This is correct
                  onFocus={() => setInitialDocName(docName)} // Set initial value on focus
                />
                <Button
                  size="large"
                  className="mx-5"
                  style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit', border: 'none' }}
                  htmlType="submit"
                  loading={loading}
                  disabled={isButtonDisabled}
                >
                  ยืนยัน
                </Button>
              </form>

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
                .filter((shape) => shape.page === pageNumber) // แสดงการ์ดเฉพาะหน้าปัจจุบัน
                .map((shape) => (
                  <Draggable
                    key={shape.id}
                    bounds={{
                      left: 0,
                      top: 0,
                      right: containerRef.current
                        ? containerRef.current.scrollWidth - shape.width
                        : 0,
                      bottom: containerRef.current
                        ? containerRef.current.scrollHeight - shape.height
                        : 0,
                    }}
                    defaultPosition={{ x: shape.x, y: shape.y }}
                    onStop={(_e, data) => {
                      // Update the shape position and send the data to server
                      updateShapePosition(shape.id, data.x, data.y, pageNumber)
                    }}
                    onMouseDown={(e: MouseEvent) => {
                      e.stopPropagation() // ป้องกันการลาก PDF
                    }}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick(shape.id) // เลือกการ์ด
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
                        <Typography
                          style={{
                            color: '#4318FF',
                            fontWeight: 'bold',
                            fontSize: '16px',
                          }}
                        >
                          ผู้ลงนาม
                        </Typography>

                        <Typography
                          style={{
                            color: '#FFF',
                            fontSize: '12px',
                            marginTop: '10px',
                          }}
                        >
                          {shape.firstName} {shape.lastName}
                        </Typography>
                      </Box>

                      {selectedCardId === shape.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCard(shape.id)
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
      </Grid>
      <Grid item xs={3}>
        <Typography variant='h5'>เพิ่มผู้ลงนาม</Typography>
        <Row gutter={16} align='middle'>
          <Col span={24}>
            <Box className='my-2'>
              <AutoComplete
                size='large'
                options={options}
                style={{ width: '100%' }} // Full width
                placeholder='ค้นหาโดยใช้ชื่อ หรือ อีเมล'
                onSearch={async (text) => setOptions(await getPanelValue(text))}
                onSelect={handleUserSelector} // Update selected email on selection
                value={autoCompleteValue} // Control the input field value
                onChange={(value) => setAutoCompleteValue(value)} // Update input value as the user types
              />
            </Box>
          </Col>
          <Col>
            <Box className='my-2'>
              <Button
                size='large'
                style={{ color: 'white', backgroundColor: '#4318FF', fontFamily: 'Kanit' }}
                type='primary'
                onClick={addRectangle} // Trigger the addRectangle function on click
              >
                เพิ่มผู้ลงนาม
              </Button>
            </Box>
          </Col>
        </Row>
      </Grid>
    </Grid>
  )
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
  background: 'none',
  color: 'white',
  fontSize: '80px',
  cursor: 'pointer',
}

export default PDFServices
