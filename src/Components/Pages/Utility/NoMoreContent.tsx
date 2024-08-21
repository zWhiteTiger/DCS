import { Divider } from 'antd'

type Props = {}

export default function NoMoreContent({}: Props) {
  return (
    <Divider style={{ borderColor: '#dedede', color: '#dedede', padding: '20px' }} >ไม่มีเนื้อหาที่จะแสดงต่อจากนี้</Divider>

  )
}