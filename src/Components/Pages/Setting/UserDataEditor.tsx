import { Button, Form, FormProps, Input } from 'antd'

type Props = {}

type FieldType = {
    firstName?: string;
    lastName?: string;
    remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export default function UserDataEditor({ }: Props) {
    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                name="firstName"
                rules={[{ required: true, message: 'กรองชื่อที่จะแก้ไข' }]}
            >
                <Input placeholder='ชื่อจริง' />
            </Form.Item>

            <Form.Item<FieldType>
                name="lastName"
                rules={[{ required: true, message: 'กรองนามสกุลที่จะแก้ไข' }]}
            >
                <Input placeholder='นามสกุล' />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    บันทึก
                </Button>
            </Form.Item>
        </Form>
    )
}