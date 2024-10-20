import React, { useState } from "react";
import { Modal, Button, Input, Select, Divider, message } from "antd";
import { CiEdit } from "react-icons/ci";
import { Box } from "@mui/material";
import axios from "axios";

interface UserEditorProps {
    userId: string;
}

const UserEditor: React.FC<UserEditorProps> = ({ userId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleUpdateInfo = () => {
        // Prepare data for user info update
        const updateData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            role: selectedPosition,
            department: selectedBranch
        };

        // Make a PATCH request to update user info
        axios.patch(`/user/${userId}`, updateData)
            .then(() => {
                message.success("User information updated successfully");
                setIsModalVisible(false);
            })
            .catch((error) => {
                message.error("Failed to update user information");
            });
    };

    const handleUpdatePassword = () => {
        // Check if passwords match
        if (password !== confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        // Make a PATCH request to update password
        axios.patch(`/user/p/${userId}`, { password })
            .then(() => {
                message.success("Password updated successfully");
                setPassword("");
                setConfirmPassword("");
                setIsModalVisible(false);
            })
            .catch((error) => {
                message.error("Failed to update password");
            });
    };

    const handleChangePosition = (value: string) => {
        setSelectedPosition(value);
    };

    const handleChangeBranch = (value: string) => {
        setSelectedBranch(value);
    };

    return (
        <>
            <Button size="large" type="primary" onClick={showModal} style={{ background: "#4318FF", color: "#FFF" }}>
                <CiEdit />แก้ไขข้อมูล
            </Button>
            <Modal
                title="แก้ไขข้อมูล ของ ...."
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Box className="my-5" />
                <Divider orientation="left" plain>
                    แก้ไขข้อมูลส่วนตัว
                </Divider>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Input
                        size="large"
                        placeholder="ชื่อ"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ marginBottom: 10 }}
                    />
                    <Input
                        size="large"
                        placeholder="นามสกุล"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ marginBottom: 10 }}
                    />
                </div>
                <Divider orientation="left" plain>
                    แก้ไขตำแหน่งและสาขา
                </Divider>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Select
                        size="large"
                        placeholder="ตำแหน่ง"
                        value={selectedPosition}
                        onChange={handleChangePosition}
                        style={{ width: "100%", fontFamily: "Kanit" }}
                        options={[
                            { value: "student", label: "นักศึกษา" },
                            { value: "counselor", label: "ที่ปรึกษาสโมสรนักศึกษา" },
                            { value: "head_of_student_affairs", label: "หัวหน้าฝ่ายกิจการนักศึกษา" },
                            { value: "vice_dean", label: "รองคณบดี" },
                            { value: "dean", label: "คณบดี" }
                        ]}
                    />
                    <Select
                        size="large"
                        placeholder="สาขาวิชา"
                        value={selectedBranch}
                        onChange={handleChangeBranch}
                        style={{ width: "100%", fontFamily: "Kanit" }}
                        options={[
                            { value: "CE", label: "วิศวกรรมคอมพิวเตอร์" },
                            { value: "LE", label: "วิศวกรรมโลจิสติกส์และเทคโนโลยีขนส่ง" },
                            { value: "IEA", label: "วิศวกรรมอุตสาหการ" },
                            { value: "ME", label: "วิศวกรรมเครื่องกล" },
                            { value: "IDA", label: "นวัตกรรมการออกแบบและสถาปัตยกรรม" },
                            { value: "AME", label: "วิศวกรรมเครื่องจักรกลเกษตร" }
                        ]}
                    />
                </div>
                <Box className="my-5 flex justify-end">
                    <Button
                        style={{ background: "#4318FF", color: "#FFF", fontFamily: "Kanit" }}
                        size="large"
                        onClick={handleUpdateInfo}
                    >
                        เปลี่ยนข้อมูล
                    </Button>
                </Box>

                <Divider orientation="left" plain>
                    เปลี่ยนรหัสผ่าน
                </Divider>
                <Input.Password
                    size="large"
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Input.Password
                    size="large"
                    placeholder="รหัสผ่านอีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Box className="my-5 flex justify-end">
                    <Button
                        style={{ background: "#4318FF", color: "#FFF", fontFamily: "Kanit" }}
                        size="large"
                        onClick={handleUpdatePassword}
                    >
                        เปลี่ยนรหัสผ่าน
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default UserEditor;
