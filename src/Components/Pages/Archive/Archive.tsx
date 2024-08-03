import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Button, Tooltip } from "antd";
import { MdFileOpen } from "react-icons/md";
import Static from "../../Static/Static";
import Loader from "../Loader/Loader";
import axios from "axios";

type Props = {};

const cardStyles = {
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
};

export default function Archive({ }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const apifunc = async () => {
    try {
      const response = await axios.get('https://66349c759bb0df2359a21751.mockapi.io/book/book');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    apifunc();
  }, []);

  const tooltipStyle = {
    fontFamily: 'Kanit'
  };

  return (
    <>
      <Static />

      <div className="mt-5">
        <Card sx={cardStyles}>
          <CardContent>
            <Typography style={{ display: 'flex', color: '#1B2559' }} className='text-xl font-bold'>
              เอกสาร
            </Typography>
            {loading ? (
              <div className="mx-auto w-full flex justify-center items-center h-[80%]">
                <Loader />
              </div>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {data.map((item: any, index: number) => {
                    let book = {
                      ...item,
                      status: 'Unread'
                    };
                    let cardBackgroundColor;
                    switch (book.status) {
                      case 'Read':
                        cardBackgroundColor = '#F1FBEF'; // Light green
                        break;
                      case 'Unread':
                        cardBackgroundColor = '#EFF4FB'; // Light blue
                        break;
                      case 'Reject':
                        cardBackgroundColor = '#FBF0EF'; // Light red
                        break;
                      default:
                        cardBackgroundColor = 'inherit';
                    }

                    return (
                      <Card key={index} style={{ marginBottom: '5px', backgroundColor: cardBackgroundColor, ...cardStyles }}>
                        <CardContent>
                          <Grid container spacing={3} alignItems="start">
                            <Grid item xs={0}>
                              <div style={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '20%' }}>
                                <img src='https://www.bing.com/th?id=OIP.zb2bMkSw2aP62F8liqmASQHaE8&w=202&h=200&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2' alt="User Avatar" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                              </div>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography className="font-bold">
                                {book.title}
                              </Typography>
                              <Typography>
                                12345678
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography className="font-bold">
                                {book.name}
                              </Typography>
                              <Typography>
                                {book.email}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography className="font-bold">
                                วันที่
                              </Typography>
                              <Typography>
                                {book.date}
                              </Typography>
                            </Grid>
                            <Grid item xs={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <Typography className="font-bold" style={{ marginBottom: '4px' }}>
                                สถานะ
                              </Typography>
                              <div style={{
                                backgroundColor:
                                  book.status === 'Read' ? '#AFFFEA' : book.status === 'Unread' ? '#CFC1FF' : book.status === 'Reject' ? '#FFC1C1' : '#6A50A7',
                                color: book.status === 'Read' ? '#05CD99' : book.status === 'Unread' ? '#4318FF' : book.status === 'Reject' ? '#960000' : 'white',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {book.status}
                              </div>
                            </Grid>
                            <Grid item xs={1} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                              <Tooltip title={<span style={tooltipStyle}>Open this file</span>}>
                                <Button
                                  className="mt-2"
                                  type="primary"
                                  icon={<MdFileOpen />}
                                  size="large"
                                  style={{
                                    fontFamily: 'Kanit',
                                    color: 'white',
                                    backgroundColor: '#4318FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  เปิดไฟล์
                                </Button>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
