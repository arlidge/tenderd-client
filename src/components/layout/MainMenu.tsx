import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../states/theme.atom';

export type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

interface MainMenuProps {
  items: MenuItem[];
  mode?: 'horizontal' | 'vertical' | 'inline';
}

const MainMenu: React.FC<MainMenuProps> = ({ items, mode = 'inline' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  // Find active menu item based on current route
  const findActiveKey = (path: string, menuItems: MenuItem[]): string => {
    for (const item of menuItems) {
      if (item.path === path) {
        return item.key;
      }
      if (item.children) {
        const activeChildKey = findActiveKey(path, item.children);
        if (activeChildKey) return activeChildKey;
      }
    }
    return '';
  };

  const activeKey = findActiveKey(location.pathname, items);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([activeKey]);

  useEffect(() => {
    setSelectedKeys([findActiveKey(location.pathname, items)]);
  }, [location.pathname, items]);

  // Find path by key to navigate when menu item is clicked
  const findPathByKey = (key: string, menuItems: MenuItem[]): string => {
    for (const item of menuItems) {
      if (item.key === key) {
        return item.path;
      }
      if (item.children) {
        const path = findPathByKey(key, item.children);
        if (path) return path;
      }
    }
    return '';
  };

  const handleClick = (e: any) => {
    const path = findPathByKey(e.key, items);
    setSelectedKeys([e.key]);
    if (path) {
      navigate(path);
    }
  };

  // Recursively render menu items
  const renderMenuItems = (menuItems: MenuItem[]) => {
    return menuItems.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      );
    });
  };

  const menuStyle = {
    width: '100%',
    display: mode === 'horizontal' ? 'flex' : undefined,
    justifyContent: mode === 'horizontal' ? 'flex-start' : undefined,
  };

  return (
    <Menu
      mode={mode}
      selectedKeys={selectedKeys}
      onClick={handleClick}
      style={menuStyle}
      disabledOverflow={true}
    >
      {renderMenuItems(items)}
    </Menu>
  );
};

export default MainMenu;
