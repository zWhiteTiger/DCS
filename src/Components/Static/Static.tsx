import { Card, CardContent, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { Statistic, StatisticProps } from 'antd';
import { BiSolidUpArrow, BiSolidDownArrow } from 'react-icons/bi';
import { TbClockHour2Filled } from "react-icons/tb";
import CountUp from 'react-countup';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoRemoveOutline } from 'react-icons/io5';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { BsFileEarmarkFill, BsFillFileEarmarkCheckFill, BsFillLightningChargeFill } from 'react-icons/bs';

dayjs.extend(isBetween);

type Props = {}

interface Document {
    created_at: string; // Added created_at field
    isProgress: 'complete' | 'pending';
    isStatus: 'standard' | 'draft' | 'express' | 'reject';
    public: boolean;
}

export default function Static({ }: Props) {
    const isMobile = useMediaQuery('(max-width:960px)');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [_loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);

    const cardStyles = {
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
    };

    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );

    const fetchDocuments = async (): Promise<Document[]> => {
        const response = await axios.get('/doc');
        return response.data;
    };

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const data = await fetchDocuments();
                setDocuments(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
                setError('Failed to load documents.');
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, []);

    const getDocumentCounts = (docs: Document[]) => {
        const currentMonthStart = dayjs().startOf('month');
        const previousMonthStart = dayjs().subtract(1, 'month').startOf('month');
        const previousMonthEnd = dayjs().subtract(1, 'month').endOf('month');

        let completeCount = 0, pendingCount = 0, ExpressCount = 0, totalCount = 0;
        let prevCompleteCount = 0, prevPendingCount = 0, prevExpressCount = 0, prevTotalCount = 0;

        docs.forEach(doc => {
            const createdAt = dayjs(doc.created_at);

            // Current month counts
            if (createdAt.isSame(currentMonthStart, 'month')) {
                if (doc.isProgress === 'complete' && doc.isStatus !== 'draft') completeCount++;
                if (doc.isProgress === 'pending' && doc.isStatus !== 'draft') pendingCount++;
                if (doc.isStatus === 'express') ExpressCount++;
                totalCount++;
            }

            // Previous month counts
            if (createdAt.isBetween(previousMonthStart, previousMonthEnd, null, '[]') && doc.isStatus !== 'draft') {
                if (doc.isProgress === 'complete') prevCompleteCount++;
                if (doc.isProgress === 'pending') prevPendingCount++;
                if (doc.isStatus === 'express') prevExpressCount++;
                prevTotalCount++;
            }
        });

        return {
            current: { completeCount, pendingCount, ExpressCount, totalCount },
            previous: { completeCount: prevCompleteCount, pendingCount: prevPendingCount, ExpressCount: prevExpressCount, totalCount: prevTotalCount }
        };
    };

    const { current, previous } = getDocumentCounts(documents);

    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous * 100).toFixed(2);
    };

    const cardData = [
        {
            title: 'เสร็จสิ้น',
            current: current.completeCount,
            previous: previous.completeCount,
            percentageChange: calculatePercentageChange(current.completeCount, previous.completeCount),
            icon: <BsFillFileEarmarkCheckFill style={{ color: '#05CD99', marginRight: '0.5rem' }} />
        },
        {
            title: 'รอดำเนินการ',
            current: current.pendingCount,
            previous: previous.pendingCount,
            percentageChange: calculatePercentageChange(current.pendingCount, previous.pendingCount),
            icon: <TbClockHour2Filled style={{ color: '#5BBCFF', marginRight: '0.5rem' }} />
        },
        {
            title: 'เอกสารด่วน',
            current: current.ExpressCount,
            previous: previous.ExpressCount,
            percentageChange: calculatePercentageChange(current.ExpressCount, previous.ExpressCount),
            icon: <BsFillLightningChargeFill style={{ color: '#DD5746', marginRight: '0.5rem' }} />
        },
        {
            title: 'เอกสารทั้งหมด',
            current: current.totalCount,
            previous: previous.totalCount,
            percentageChange: calculatePercentageChange(current.totalCount, previous.totalCount),
            icon: <BsFileEarmarkFill style={{ color: '#B3C8CF', marginRight: '0.5rem' }} />
        },
    ];

    const getChangeIndicator = (current: number, previous: number) => {
        if (current > previous) {
            return { color: '#05CD99', icon: <BiSolidUpArrow /> };
        } else if (current < previous) {
            return { color: '#DD5746', icon: <BiSolidDownArrow /> };
        } else {
            return { color: '#B3B3B3', icon: <IoRemoveOutline /> };
        }
    };

    return (
        <div>
            {isMobile ? (
                <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                    {cardData.map((card, index) => {
                        const { color, icon } = getChangeIndicator(card.current, card.previous);
                        return (
                            <div key={index}>
                                <Card sx={cardStyles}>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <Typography variant="h5" className="text-slate-500 text-sm">{card.title}</Typography>
                                                <Typography style={{ display: 'flex', alignItems: 'center', color }} className="text-3xl">
                                                    {card.icon}
                                                    <Statistic
                                                        title=""
                                                        value={card.current}
                                                        formatter={formatter}
                                                        style={{ fontFamily: 'Kanit' }}
                                                        className='font-bold text-4xl'
                                                    />
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} className='flex justify-end'>
                                                <Stack direction="column" spacing={1}>
                                                    <Typography style={{ display: 'flex', alignItems: 'center', color }} className="text-lm">
                                                        {icon}
                                                        {card.percentageChange}%
                                                    </Typography>
                                                    <Typography style={{ display: 'flex', alignItems: 'center', }} className="text-slate-500 text-lm">
                                                        เดือนก่อน {card.previous}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </Slider>
            ) : (
                <Grid container spacing={4}>
                    {cardData.map((card, index) => {
                        const { color, icon } = getChangeIndicator(card.current, card.previous);
                        return (
                            <Grid item xs={12} md={3} key={index}>
                                <Card sx={cardStyles}>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <Typography variant="h5" className="text-slate-500 text-sm">{card.title}</Typography>
                                                <Typography style={{ display: 'flex', alignItems: 'center', color }} className="text-3xl">
                                                    {card.icon}
                                                    <Statistic
                                                        title=""
                                                        value={card.current}
                                                        formatter={formatter}
                                                        style={{ fontFamily: 'Kanit' }}
                                                        className='font-bold text-4xl'
                                                    />
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} className='flex justify-end'>
                                                <Stack direction="column" spacing={1}>
                                                    <Typography style={{ display: 'flex', alignItems: 'center', color }} className="text-lm">
                                                        {icon}
                                                        {card.percentageChange}%
                                                    </Typography>
                                                    <Typography style={{ display: 'flex', alignItems: 'center', }} className="text-slate-500 text-lm">
                                                        เดือนก่อน {card.previous}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </div>
    );
}
