import React, { useState } from "react";
import "./index.css";
import {
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ProductOutlined,
  DesktopOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
const { Header, Content, Footer, Sider } = Layout;
import { FaWarehouse, FaIdCard, } from "react-icons/fa";
function getItem(label, key, icon, children, onClick = null) {
  return {
    key,
    icon: React.cloneElement(icon, {
      style: { fontSize: "30px", marginRight: "5px" }, // Tăng kích thước icon và thêm khoảng cách giữa chữ và icon
    }),
    children,
    label: onClick ? (
      <div
        onClick={onClick}
        className="flex items-center text-xl font-semibold text-gray-700  cursor-pointer"
      >
        {label}
      </div>
    ) : (
      <Link
        to={`/dashboard/${key}`}
        className="flex items-center text-xl font-semibold text-gray-700 "
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

  const dispathch = useDispatch();

  const navigate = useNavigate();
  const handleLogout = () => {
    dispathch(logout());
    navigate("/");
    toast.success("Logout successfully");
  };

  // Tạo các breadcrumb items từ path snippets
  // const breadcrumbItems = [
  //   <Breadcrumb.Item>
  //     <Link to="/dashboard">
  //       {/* <DesktopOutlined style={{ fontSize: '20px' }} /> */}
  //     </Link>
  //   </Breadcrumb.Item>,
  //   ...pathSnippets.map((snippet, index) => {
  //     const url = `/${pathSnippets.slice(0, index + 1).join("/")}`; // Tạo URL cho từng breadcrumb

  //     return (
  //       <Breadcrumb.Item key={url} className="breadcrumb-link">
  //         <Link to={url}>{snippet}</Link>
  //       </Breadcrumb.Item>
  //     );
  //   }),
  // ];
  let items = [];
  items.push(getItem("Logout", "logout", <LogoutOutlined />, null, handleLogout));

  if (role === "MANAGER") {
    items = [
      getItem("My Profile", "profile", <FaIdCard />),
      getItem("Analytics", "statistic", <BarChartOutlined />),
      getItem("Manage User", "user", <UserOutlined />),
      getItem("Manage Order", "order", <ProductOutlined />),
      getItem("Manage Box", "box", <InboxOutlined />),
      getItem("Manage Warehouse", "warehouse", <FaWarehouse />),
      getItem("Logout", "logout", <LogoutOutlined />, null, handleLogout),
    ];
  } else if (role === "SALE_STAFF") {
    items = [
      getItem("My Profile", "profileStaff", <FaIdCard />),
      getItem("Manage Order", "orderListManagement", <ProductOutlined />),
      getItem("Warehouse", "listWarehouse", <FaWarehouse />),
      getItem("Logout", "logout", <LogoutOutlined />, null, handleLogout),
    ];
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
        {/* <div onClick={handleLogout} style={{fontSize: "30px", marginRight: "5px" }}>
          <LogoutOutlined /> <span>Logout</span>
        </div> */}
      </Sider>
      <Layout className="bg-gray-100">
        {/* <Header className="bg-white shadow-md">
          <Breadcrumb separator=">" style={{ padding: "10px 20px" }}>
            {breadcrumbItems}
          </Breadcrumb>
        </Header> */}
        <Content className="m-4">
          <Breadcrumb className="mb-4">
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          <div className="overflow-auto rounded-lg bg-white p-6 shadow-md">
            <Outlet />
          </div>
        </Content>
        {/* <Footer className="py-4 text-center">
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Dashboard;
