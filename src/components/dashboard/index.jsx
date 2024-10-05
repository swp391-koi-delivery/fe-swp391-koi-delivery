import React, { useState } from 'react';
import "./index.css";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  BarChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  ProductOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`} className="text-gray-700 hover:text-blue-500">{label}</Link>
  };
}
const items = [
  getItem('Analytics', '1', <BarChartOutlined />),
  getItem('Manage User', 'user', <UserOutlined />),
  getItem('Manage Order', 'order', <ProductOutlined />),
  getItem('Log out', '', <LogoutOutlined />),
];
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }} className="min-h-screen"
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className="bg-gray-800">
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="bg-gray-100">
        <Header
          className="bg-white shadow-md"
        />
        <Content
          className="m-4"
        >
          <Breadcrumb
           className="mb-4"
          >
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          <div
            className="bg-white rounded-lg shadow-md p-6"
          >
            <Outlet/>
          </div>
        </Content>
        <Footer
          className="text-center bg-gray-50 py-4"
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;