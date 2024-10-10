import React, { useState } from "react";
import "./index.css";
import {
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: (
      <Link
        to={`/dashboard/${key}`}
        className="text-gray-700 hover:text-blue-500"
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

  let items = [];

  if (role === "MANAGER") {
    items = [
      getItem("Analytics", "statistic", <BarChartOutlined />),
      getItem("Manage User", "user", <UserOutlined />),
      getItem("Manage Order", "order", <ProductOutlined />),
      getItem("Log out", "", <LogoutOutlined />),
    ];
  } else if (role === "SALESTAFF") {
    items = [getItem("Feedback", "feedback", <BarChartOutlined />)];
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
        className="bg-gray-800"
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
        <Header className="bg-white shadow-md" />
        <Content className="m-4">
          <Breadcrumb className="mb-4">
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <Outlet />
          </div>
        </Content>
        <Footer className="bg-gray-50 py-4 text-center">
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
