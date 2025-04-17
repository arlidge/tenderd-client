// src/components/layout/NavBar.tsx
import { Layout } from 'antd';
import MainMenu, { MenuItem } from './MainMenu';
import { theme } from 'antd';
const { useToken } = theme;
const { Header } = Layout;

interface NavBarProps {
  menuItems: MenuItem[];
  logo?: React.ReactNode;
  extraContent?: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ menuItems, logo, extraContent }) => {
  const { token } = useToken();

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0px',
        width: '100%',
        background: token.colorBgContainer,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {logo && <div className="logo">{logo}</div>}

        <div style={{ flex: 1, overflowX: 'auto' }}>
          <MainMenu items={menuItems} mode="horizontal" />
        </div>
      </div>

      {extraContent && <div>{extraContent}</div>}
    </Header>
  );
};

export default NavBar;
