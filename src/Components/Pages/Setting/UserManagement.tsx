import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { Button, Input } from 'antd'; // Import Input from antd
import { useEffect, useState } from 'react';
import axios from 'axios';
import Pwr from './pwr';
import { MdOutlinePassword } from 'react-icons/md';
import { AiOutlineDelete } from "react-icons/ai";
import NoMoreContent from '../Utility/NoMoreContent';
import UserEditor from './UserEditor';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  role?: string;
  department?: string;
};

type Props = {};

export default function UserManagement({ }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const cardStyles = {
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0)',
  };

  const departmentNames: Record<string, string> = {
    CE: "วิศวกรรมคอมพิวเตอร์",
    LE: "วิศวกรรมโลจิสติกส์และเทคโนโลยีขนส่ง",
    IEA: "วิศวกรรมอุตสาหการ",
    ME: "วิศวกรรมเครื่องกล",
    IDA: "นวัตกรรมการออกแบบและสถาปัตยกรรม",
    AME: "วิศวกรรมเครื่องจักรกลเกษตร"
  };

  const roleName: Record<string, string> = {
    student: "นักศึกษา",
    counselor: "ที่ปรึกษาสโมสรนักศึกษา",
    head_of_student_affairs: "หัวหน้าฝ่ายกิจการนักศึกษา",
    vice_dean: "รองคณบดี",
    dean: "คณบดี",
    admin: "ผู้ดูแลระบบ",
  };

  const roleColors: Record<string, string> = {
    admin: "#ffeded",
    dean: "#FFFAEF",
    vice_dean: "#ebffff",
    head_of_student_affairs: "#fffff5",
    counselor: "#EFF4FB",
    student: "#F1FBEF",
    null: "#F3F3F3"
  };

  const roleOrder: string[] = ['admin', 'dean', 'vice_dean', 'head_of_student_affairs', 'counselor', 'student'];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL}/user/`)
      .then((response) => {
        console.log(response.data); // ตรวจสอบข้อมูล
        setUsers(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Sort users based on the roleOrder
  const sortedUsers = [...users].sort((a, b) => {
    const aIndex = roleOrder.indexOf(a.role || '');
    const bIndex = roleOrder.indexOf(b.role || '');
    return aIndex - bIndex;
  });

  // Filter users based on the search term
  const filteredUsers = sortedUsers.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card sx={cardStyles}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" className="my-2 mx-5 mb-5">
            <Typography
              style={{ color: "#001234", fontWeight: "bold", fontSize: "20px" }}
            >
              ผู้ใช้งาน
            </Typography>
            <Input
              size="large"
              variant='filled'
              placeholder="ค้นหา"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '200px' }} // Adjust width as needed
            />
          </Box>

          {filteredUsers.map((user) => {
            const imageSrc = user.picture
              ? `${import.meta.env.VITE_URL}${user.picture}`
              : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

            return (
              <Card
                key={user._id}
                sx={{ ...cardStyles, backgroundColor: roleColors[user.role || 'null'] }}
                className="my-2"
              >
                <CardContent className="mt-2">
                  <Grid container xs={12} spacing={2}>
                    <Grid item xs={1}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                      >
                        <img
                          src={imageSrc}
                          alt="User Avatar"
                          style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: '7px',
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Box
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          style={{
                            color: '#001234',
                            fontSize: '18px',
                            fontWeight: 'bold',
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography className='mt-2'>{user.email}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Box
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          style={{
                            color: '#001234',
                            fontSize: '18px',
                            fontWeight: 'bold',
                          }}
                        >
                          รหัสผ่าน
                        </Typography>
                        <Button
                          size="large"
                          type="link"
                          onClick={openModal}
                          style={{ color: '#001268' }}
                        >
                          <MdOutlinePassword style={{ color: '#001234' }} />
                          เปลี่ยนรหัสผ่าน
                        </Button>

                        <Pwr isOpen={isModalOpen} toggleModal={closeModal} />
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Box
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          style={{
                            color: '#001234',
                            fontSize: '18px',
                            fontWeight: 'bold',
                          }}
                        >
                          ตำแหน่ง
                        </Typography>
                        <Typography className='mt-2'>
                          {user.role
                            ? roleName[user.role] || "ว่าง"
                            : "ว่าง"
                          }
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          style={{
                            color: '#001234',
                            fontSize: '18px',
                            fontWeight: 'bold',
                          }}
                        >
                          สาขาวิชา
                        </Typography>
                        <Typography className='mt-2'>
                          {user.department
                            ? departmentNames[user.department] || "ไม่มีสาขาวิชา"
                            : "ไม่มีสาขาวิชา"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                      >
                        {/* <Button style={{ background: '#4318FF', color: '#FFF' }} size="large">
                          <CiEdit />
                          แก้ไข
                        </Button> */}
                        <UserEditor />
                        <Box className="mx-2" />
                        <Button style={{ background: '#FE3636', color: '#FFF' }} size="large">
                          <AiOutlineDelete />
                          ลบ
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <NoMoreContent />
    </>
  );
}
