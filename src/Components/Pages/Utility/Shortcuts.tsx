import { Box, Typography } from '@mui/material'
import { Button } from 'antd'
import { MdAutorenew, MdCreate, MdExplore } from 'react-icons/md'
import { Link } from 'react-router-dom'

type Props = {}

export default function Shortcuts({ }: Props) {
    return (
        <>
            <Link to="/docs/create">
                <Button type="link" style={{ width: '100%', height: '100%' }} className='my-4'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MdCreate style={{
                            fontSize: '50px',
                            background: '#F6F8FD',
                            color: '#4318FF',
                            marginRight: '8px',
                            padding: '5px 5px',
                            borderRadius: '100px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} />
                        <div>
                            <Typography style={{ display: 'flex', color: '#1B2559' }}>
                                สร้างหนังสือ
                            </Typography>
                            <Typography variant='body2' style={{ color: '#A3AED0' }}>
                                สร้างหนังสือใหม่
                            </Typography>
                        </div>
                    </div>
                </Button>
            </Link>
            <Link to="/explore">
                <Button type="link" style={{ width: '100%', height: '100%' }} className='my-4'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MdExplore style={{
                            fontSize: '50px',
                            background: '#F6F8FD',
                            color: '#01B574',
                            marginRight: '8px',
                            padding: '5px 5px',
                            borderRadius: '100px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} />
                        <div>
                            <Typography style={{ display: 'flex', color: '#1B2559' }}>
                                สำรวจหนังสือ
                            </Typography>
                            <Typography variant='body2' style={{ color: '#A3AED0' }}>
                                สำรวจรายการหนังสือใหม่
                            </Typography>
                        </div>
                    </div>
                </Button>
            </Link>
            <Link to="/docs/draft">
                <Button type="link" style={{ width: '100%', height: '100%' }} className='my-4'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MdAutorenew style={{
                            fontSize: '50px',
                            background: '#F6F8FD',
                            color: '#FFB547',
                            marginRight: '8px',
                            padding: '5px 5px',
                            borderRadius: '100px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} />
                        <div>
                            <Typography style={{ display: 'flex', color: '#1B2559' }}>
                                เอกสารแบบร่าง
                            </Typography>
                            <Typography variant='body2' style={{ color: '#A3AED0' }}>
                                สำรวจเอกสารแบบร่างทั้งหมด
                            </Typography>
                        </div>
                    </div>
                </Button>
            </Link>
            <Box className='my-5' />
        </>
    )
}