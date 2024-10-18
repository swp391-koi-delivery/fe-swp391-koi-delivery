import React, { useState, useEffect } from "react";
import { Button, Drawer, Menu, notification } from "antd";
import {
  WechatOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  MenuOutlined,
  LogoutOutlined,
  CarOutlined 
} from "@ant-design/icons";
import "../Dashboard_DS/DeliveryStaff.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/userSlice";

function DeliveryStaff() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const navigate = useNavigate();
  const dispathch = useDispatch();

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const handleMenuClick = (key) => {
    setSelectedKey(key);
    closeDrawer();
  };


  const handleLogout = () => {
    dispathch(logout());
    navigate("/");
    toast.success("Logout successfully");
  };

  const items = [
    {
      key: "1",
      icon: <UnorderedListOutlined />,
      label: (
        <Link to="listOrders_Deli" onClick={() => handleMenuClick("1")}>
          List Order
        </Link>
      ),
    },
    {
      key: "2",
      icon: <WechatOutlined />,
      label: (
        <Link to="chat_Deli" onClick={() => handleMenuClick("2")}>
          Chat
        </Link>
      ),
    },
    {
      key: "3",
      icon:  <CarOutlined />,
      label: (
        <Link to="orderRouting_Deli" onClick={() => handleMenuClick("3")}>
          Order Routing
        </Link>
      ),
    },
    {
      key: "4",
      icon:<CalendarOutlined />,
      label: (
        <Link to="orderRequest_Deli" onClick={() => handleMenuClick("4")}>
          Order Request
        </Link>
      ),
    },
    {
      key: "5",
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
          items={items.map((item) => ({
            ...item,
            label: <span style={{ color: "#ffffff" }}>{item.label}</span>,
          }))}
        />
      </Drawer>

      {/* This is where child components will render */}
      <Outlet />
    </div>
  );
}

export default DeliveryStaff;
