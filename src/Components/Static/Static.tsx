import { Card, CardContent, Grid, Typography, useMediaQuery } from '@mui/material';
import { Statistic, StatisticProps } from 'antd';
import { BiSolidUpArrow } from 'react-icons/bi';
import { LuFile, LuFileDown, LuFileSpreadsheet, LuFileSymlink } from 'react-icons/lu';
import CountUp from 'react-countup';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";


type Props = {};

const cardData = [
    { title: 'เสร็จสิ้น', content: '15', icons: <LuFile style={{ color: '#05CD99', marginRight: '0.5rem' }} /> },
    { title: 'รอดำเนินการ', content: '20', icons: <LuFileDown style={{ color: '#5BBCFF', marginRight: '0.5rem' }} /> },
    { title: 'ยังไม่อ่าน', content: '5', icons: <LuFileSymlink style={{ color: '#DD5746', marginRight: '0.5rem' }} /> },
    { title: 'เอกสารทั้งหมด', content: '40', icons: <LuFileSpreadsheet style={{ color: '#B3C8CF', marginRight: '0.5rem' }} /> },
];

const cardStyles = {
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)', // Drop shadow with color #FFF
};

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
);

export default function Static({ }: Props) {
    const isMobile = useMediaQuery('(max-width:960px)');

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
        ],
    };

    return (
        <div>
            {isMobile ? (
                <Slider {...sliderSettings}>
                    {cardData.map((card, index) => (
                        <div key={index}>
                            <Card sx={cardStyles}>
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" className="text-slate-500 text-sm">{card.title}</Typography>
                                            <Typography style={{ display: 'flex', alignItems: 'center' }} className="text-3xl">
                                                {card.icons}
                                                <Statistic
                                                    title=""
                                                    value={card.content}
                                                    formatter={formatter}
                                                    style={{ fontFamily: 'Kanit' }}
                                                    className='font-bold text-4xl'
                                                />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} className='flex justify-center'>
                                            <Typography style={{ display: 'flex', alignItems: 'center', color: '#05CD99' }} className=" text-lm">
                                                <BiSolidUpArrow style={{ color: '#05CD99', marginRight: '0.5rem' }} />
                                                +100.00%
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </Slider>
            ) : (
                <Grid container spacing={4}>
                    {cardData.map((card, index) => (
                        <Grid item xs={12} md={3} key={index}>
                            <Card sx={cardStyles}>
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" className="text-slate-500 text-sm">{card.title}</Typography>
                                            <Typography style={{ display: 'flex', alignItems: 'center' }} className="text-3xl">
                                                {card.icons}
                                                <Statistic
                                                    title=""
                                                    value={card.content}
                                                    formatter={formatter}
                                                    style={{ fontFamily: 'Kanit' }}
                                                    className='font-bold text-4xl'
                                                />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} className='flex justify-center'>
                                            <Typography style={{ display: 'flex', alignItems: 'center', color: '#05CD99' }} className=" text-lm">
                                                <BiSolidUpArrow style={{ color: '#05CD99', marginRight: '0.5rem' }} />
                                                +100.00%
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}
