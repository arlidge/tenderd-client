// src/components/layout/Footer.tsx
import React from 'react';
import { Layout } from 'antd';
import { theme } from 'antd';
const { useToken } = theme;
const { Footer: AntFooter } = Layout;

interface FooterProps {
  content?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({
  content = '©2025 Your Company Name. All Rights Reserved.',
}) => {
  const { token } = useToken();
  return (
    <AntFooter
      style={{
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {content}
    </AntFooter>
  );
};

export default Footer;
