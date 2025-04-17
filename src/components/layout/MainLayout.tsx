import React from 'react';
import { Button, Layout } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import SideDrawer from './SideDrawer';
import Footer from './Footer';
import { MenuItem } from './MainMenu';
import { useTheme } from '../../states/theme.atom';
import { theme } from 'antd';
const { useToken } = theme;
interface MainLayoutProps {
  menuItems: MenuItem[];
  showDrawer: boolean;
  showNav: boolean;
  logo?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  menuItems,
  showDrawer,
  showNav,
  logo,
  footerContent,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { token } = useToken();

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      {showDrawer && <SideDrawer menuItems={menuItems} logo={logo} />}

      {showNav && (
        <NavBar
          logo={logo}
          menuItems={menuItems}
          extraContent={
            <Button
              type="text"
              icon={theme === 'dark' ? <BulbFilled /> : <BulbOutlined />}
              onClick={toggleTheme}
            />
          }
        />
      )}

      <Layout>
        <Layout.Content
          style={{
            padding: showDrawer ? '10px 24px 24px' : '24px',
            minHeight: 280,
          }}
        >
          <Outlet />
        </Layout.Content>

        <Layout.Footer style={{}}>
          <Footer content={footerContent} />
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
