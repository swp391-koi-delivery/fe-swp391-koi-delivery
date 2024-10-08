import React, { useState, useEffect } from "react";
import { Button, Drawer, Menu, notification } from "antd"; // Import notification from antd
import {
  WechatOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "../Dashboard_DS/DeliveryStaff.css";
import { Link, Outlet, useNavigate } from "react-router-dom";

function DeliveryStaff() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const navigate = useNavigate();

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const handleMenuClick = (key) => {
    setSelectedKey(key);
    closeDrawer();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const items = [
    {
      key: "1",
      icon: <UnorderedListOutlined />,
      label: (
        <Link to="listOrders" onClick={() => handleMenuClick("1")}>
          List Order
        </Link>
      ),
    },
    {
      key: "2",
      icon: <WechatOutlined />,
      label: (
        <Link to="chat" onClick={() => handleMenuClick("2")}>
          Chat
        </Link>
      ),
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: (
        <Link to="orderRequest" onClick={() => handleMenuClick("3")}>
          Order Request
        </Link>
      ),
    },
    {
      key: "4",
      icon: <LogoutOutlined />,
      label: (
        <Link onClick={handleLogout}>
          Log Out
        </Link>
      ),
    },
  ];

  return (
    <div className="container_1">
      {/* Menu button */}
      <Button
        className="btn-menu"
        onClick={openDrawer}
        icon={<MenuOutlined />}
      />

      {/* Menu Item */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ backgroundColor: "#2c2c2c" }}
      >
        <Menu
          style={{ backgroundColor: "#2c2c2c" }}
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items.map(item => ({
            ...item,
            label: (
              <span style={{ color: "#ffffff" }}>
                {item.label}
              </span>
            ),
          }))}
        />
      </Drawer>

      {/* This is where child components will render */}
      <Outlet />  
    </div>
  );
}

export default DeliveryStaff;
