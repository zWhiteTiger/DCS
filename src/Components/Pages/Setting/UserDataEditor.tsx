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
            style={{ maxWidth: 600, width: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                name="firstName"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input placeholder='ชื่อจริง' />
            </Form.Item>

            <Form.Item<FieldType>
                name="lastName"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input placeholder='นามสกุล' />
            </Form.Item>

            {/* <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder='' />
            </Form.Item> */}


            <Form.Item wrapperCol={{ offset: 13, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    บันทึก
                </Button>
            </Form.Item>
        </Form>
    )
}