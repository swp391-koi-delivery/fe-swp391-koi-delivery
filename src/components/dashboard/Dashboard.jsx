import React, { useState } from "react";
import "./index.css";
import {
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ProductOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon:  React.cloneElement(icon, {
      style: { fontSize: '30px', marginRight: '5px' }, // Tăng kích thước icon và thêm khoảng cách giữa chữ và icon
    }),
    children,
    label: (
      <Link
        to={`/dashboard/${key}`}
        className="text-gray-700 hover:text-blue-500 text-xl font-semibold flex items-center"
        // style={{ gap: '10px', padding: '50px 0', fontSize: '22px', fontWeight: 'bold' }} // Tăng kích thước chữ và thêm khoảng cách giữa các phần tử
      >
        {label}
      </Link>
    ),
  };
}

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const user = useSelector((store) => store.user);
  const role = user.role; // assuming `role` is inside user


  const location = useLocation(); // Dùng để lấy URL hiện tại
  const pathSnippets = location.pathname.split("/").filter((i) => i); // Tách URL thành từng phần

  // Tạo các breadcrumb items từ path snippets
  const breadcrumbItems = [
    <Breadcrumb.Item>
      <Link to="/dashboard">
        {/* <DesktopOutlined style={{ fontSize: '20px' }} /> */}
      </Link>
    </Breadcrumb.Item>,
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`; // Tạo URL cho từng breadcrumb

      return (
        <Breadcrumb.Item key={url} className="breadcrumb-link">
          <Link to={url}>{snippet}</Link>
        </Breadcrumb.Item>
      );
    }),
  ];
  let items = [];

  if (role === "MANAGER") {
    items = [
      getItem("Analytics", "statistic", <BarChartOutlined />),
      getItem("Manage User", "user", <UserOutlined />),
      getItem("Manage Order", "order", <ProductOutlined />),
      getItem("Log out", "", <LogoutOutlined />),
    ];
  } else if (role === "SALESSTAFF") {
    items = [getItem("Manage Order", "orderList", <ProductOutlined />)];
  }
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
      className="min-h-screen"
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={300}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="bg-gray-100">
      <Header className="bg-white shadow-md">
          <Breadcrumb separator=">" style={{ padding: '10px 20px' }}>
            {breadcrumbItems}
          </Breadcrumb>
        </Header>
        <Content className="m-4">
          <Breadcrumb className="mb-4">
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          <div className="rounded-lg bg-white p-6 shadow-md overflow-auto">
            <Outlet />
          </div>
        </Content>
        <Footer className=" py-4 text-center">
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
