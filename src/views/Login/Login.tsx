import React from 'react';
import { Typography } from 'antd';
import LoginForm from './LoginForm';
import styles from './Login.module.scss';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={1} className={styles.title}>
            Welcome
          </Title>
          <Text className={styles.subtitle}>
            Login to your account
          </Text>
        </div>
        
        <div className={styles.formContainer}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
