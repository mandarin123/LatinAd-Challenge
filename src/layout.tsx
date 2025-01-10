import React from 'react';
import { Layout as AntLayout, Menu, Badge, Image, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  MoreOutlined 
} from '@ant-design/icons';
import { useAppSelector } from './hooks/redux';
import { Footer } from 'antd/lib/layout/layout';
import { Link } from 'react-router-dom';

const { Header, Content } = AntLayout;

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useAppSelector(state => state.cart);

  const handleClick = (e: any) => {
    navigate(e.key);
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Inicio'
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: 'Buscar'
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: (
        <>
          Carrito
          {totalItems > 0 && (
            <Badge count={totalItems} size="small" style={{ marginLeft: 8 }} />
          )}
        </>
      )
    }
  ];

  const mobileMenu = (
    <Menu onClick={handleClick} selectedKeys={[location.pathname]}>
      {menuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <AntLayout className="min-h-screen" style={{ background: 'linear-gradient(0deg, rgb(57, 150, 243), rgb(66, 165, 245))' }}>
      <Header
        style={{ 
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: 0,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          margin: '10px',
          borderRadius: '10px',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="px-4">
            <Link to="/">
              <Image 
                src="https://latinad.com/static/media/latinad.c0f35902.svg" 
                alt="logo" 
                width={80} 
                preview={false}
              />
            </Link>
          </div>
          
          <Menu 
            onClick={handleClick}
            selectedKeys={[location.pathname]}
            mode="horizontal"
            style={{ width: '100%', border: 'none', borderRadius: '10px' }}
            className="hidden md:flex"
          >
            {menuItems.map(item => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>

          <div className="md:hidden px-2 py-1">
            <Dropdown 
              overlay={mobileMenu} 
              trigger={['click']}
              placement="bottomRight"
            >
              <MoreOutlined style={{ fontSize: '24px' }} />
            </Dropdown>
          </div>
        </div>
      </Header>
      
      <Content>
          <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        LatinAd Challenge {new Date().getFullYear()} by Martin Abel ©
      </Footer>
    </AntLayout>
  );
};