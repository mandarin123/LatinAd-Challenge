import React, { useState, useEffect, useCallback } from 'react';
import { Layout as AntLayout, Menu, theme, Button, Badge } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  HomeOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { clearSearchResults } from './store/slices/searchSlice';

const { Header, Sider, Content } = AntLayout;

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { totalItems } = useAppSelector(state => state.cart);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    dispatch(clearSearchResults());
  }, [location.pathname, dispatch]);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Inicio',
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: (
        <div className="flex justify-between items-center w-full pr-2">
          Carrito
          {totalItems > 0 && (
            <Badge 
              count={totalItems} 
              size="default"
              style={{ 
                marginLeft: 'auto',
              }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <AntLayout className="min-h-screen m-0 p-0">
      <Sider 
        theme="light"
        trigger={null} 
        collapsible
        collapsedWidth='50'
        collapsed={collapsed}
        breakpoint="lg"
        className={`
          fixed h-full z-50 transition-all duration-300 
          lg:relative left-0 top-0 bottom-0
          max-lg:absolute
          max-md:transform
          max-md:translate-x-0
          max-md:shadow-lg
        `}
      >
        <Header className="p-0 bg-transparent sticky top-0 z-40 flex items-center flex-col">
          {!isMobile && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="w-16 h-16 text-lg flex items-center justify-center"
            />
          )}
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="border-r-0 h-full"
          />
        </Header>
      </Sider>
      
      <AntLayout className={`transition-all duration-300 ${
        collapsed ? 'lg:ml-[80px]' : 'lg:ml-[200px]'
      }`}>
        
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};