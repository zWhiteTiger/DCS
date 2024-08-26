import { Link } from 'react-router-dom'; // import Link จาก react-router-dom
import { Button, Result } from 'antd';

export default function ERR404() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="เหย๋ย ดูเหมือน Path ที่จะเข้าถึงอยู่นอกขอบเขตของเรา"
      style={{fontFamily: 'Kanit'}}
      extra={
        <Link to="/"><Button
          size='large'
          style={{ color: 'white', backgroundColor: 'black', fontFamily: 'Kanit' }}
        >
          กลับไปยัง ดาร์ชบอร์ด
        </Button>
        </Link>
      }
    />
          );
}
