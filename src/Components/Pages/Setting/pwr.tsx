import React, { useState } from "react";
import { Modal, Button, Input, Divider, message } from "antd";
import { CiEdit } from "react-icons/ci";
import { Box } from "@mui/material";
import { MdOutlinePassword } from "react-icons/md";
import axios from 'axios';

interface PwrProps {
  userId: string; // ID ของผู้ใช้ที่จะอัพเดทรหัสผ่าน
}

const Pwr: React.FC<PwrProps> = ({ userId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // ตรวจสอบว่ารหัสผ่านสองช่องตรงกันหรือไม่
    if (password !== confirmPassword) {
      message.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    // ส่งคำร้องขอ PATCH เพื่ออัพเดทรหัสผ่าน
    axios.patch(`/user/${userId}`, { password })
      .then(response => {
        message.success("อัพเดทรหัสผ่านสำเร็จ");
        setIsModalVisible(false);
      })
      .catch(error => {
        message.error("ไม่สามารถอัพเดทรหัสผ่านได้");
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        size="large"
        type="link"
        onClick={showModal}
        style={{ color: '#001268' }}
      >
        <MdOutlinePassword style={{ color: '#001234' }} />
        เปลี่ยนรหัสผ่าน
      </Button>
      <Modal
        title="เปลี่ยนรหัสผ่านของ ...."
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Box className="my-5" />
        <Divider orientation="left" plain>
          เปลี่ยนรหัสผ่าน
        </Divider>
        <Input.Password
          size='large'
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Input.Password
          size='large'
          placeholder="รหัสผ่านอีกครั้ง"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Box className="my-5" />
      </Modal>
    </>
  );
};

export default Pwr;
