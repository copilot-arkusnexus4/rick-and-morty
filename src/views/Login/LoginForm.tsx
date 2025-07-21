import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { isValidEmail } from './utils';
import styles from './Login.module.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../thunks/authThunks';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Login | Rick & Morty Explorer';
  }, []);

  const onValuesChange = () => {
    const email = form.getFieldValue('email');
    const password = form.getFieldValue('password');
    setIsButtonDisabled(!(isValidEmail(email) && password));
  };

  const onFinish = async (values: { email: string; password: string }) => {
    const result = await dispatch(loginUser(values.email, values.password));
    if (result && typeof result === 'object' && 'success' in result) {
      const r = result as { success: boolean; error?: string };
      if (r.success) {
        setError('');
        navigate('/home');
      } else {
        setError(r.error || 'Login failed');
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Enter your email' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Enter your password' }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block disabled={isButtonDisabled}>
          Sign In
        </Button>
      </Form.Item>

      {error && <div className={styles.error}>{error}</div>}

    </Form>
  );
};

export default LoginForm;