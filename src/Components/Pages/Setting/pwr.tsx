import React, { useState } from "react";
import { Modal, Button, Input, Select, Divider } from "antd";
import { CiEdit } from "react-icons/ci";
import { Box, Typography } from "@mui/material";
import { MdOutlinePassword } from "react-icons/md";

const { Option } = Select;

const Pwr = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log("Input1:", input1, "Input2:", input2, "Selected:", selectedValue);
    setIsModalVisible(false);
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
        <Input
          size='large'
          placeholder="รหัสผ่าน"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Input
          size='large'
          placeholder="รหัสผ่านอีกครั้ง"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Box className="my-5" />
      </Modal>
    </>
  );
};

export default Pwr;
