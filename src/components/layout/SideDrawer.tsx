import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import MainMenu, { MenuItem } from './MainMenu';
import { useTheme } from '../../states/theme.atom';

const { Sider } = Layout;

interface SideDrawerProps {
  menuItems: MenuItem[];
  logo?: React.ReactNode;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ menuItems, logo }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { theme: activeTheme, toggleTheme } = useTheme();

  return (
    <Sider
      theme={activeTheme}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      {logo && <div className="text-center">{logo}</div>}
      <MainMenu items={menuItems} mode="inline" />
    </Sider>
  );
};

export default SideDrawer;
