import React, { useState } from "react";
import { Modal, Button, Input, Select } from "antd";
import { CiEdit } from "react-icons/ci";

const { Option } = Select;

const UserEditor = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [selectedValue, setSelectedValue] = useState("");

    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");

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

    const handleChange = (value: string) => {
        console.log(`Selected: ${value}`);
    };

    return (
        <>
            <Button size="large" type="primary" onClick={showModal} style={{ background: "#4318FF", color: "#FFF" }}>
                <CiEdit />แก้ไขข้อมูล
            </Button>
            <Modal
                title="แก้ไขข้อมูล ของ ...."
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="บันทึก"
                cancelText="ยกเลิก"
            >
                <div style={{ display: "flex", gap: "10px" }}>
                    <Input
                        placeholder="ชื่อ"
                        value={input1}
                        onChange={(e) => setInput1(e.target.value)}
                        style={{ marginBottom: 10 }}
                    />
                    <Input
                        placeholder="นามสกุล"
                        value={input2}
                        onChange={(e) => setInput2(e.target.value)}
                        style={{ marginBottom: 10 }}
                    />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Select
                        size='large'
                        placeholder="ตำแหน่ง"
                        style={{ width: '100%', fontFamily: 'Kanit' }}
                        onChange={handleChange}
                        options={[
                            { value: 'standard', label: 'Standard' },
                            { value: 'express', label: 'Express' },
                        ]}
                    />
                    <Select
                        size='large'
                        placeholder="สาขาวิชา"
                        style={{ width: '100%', fontFamily: 'Kanit' }}
                        onChange={handleChange}
                        options={[
                            { value: 'standard', label: 'Standard' },
                            { value: 'express', label: 'Express' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    );
};

export default UserEditor;
