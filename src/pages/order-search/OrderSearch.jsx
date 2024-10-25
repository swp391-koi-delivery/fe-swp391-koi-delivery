import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Rate,
  Steps,
} from "antd";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import FooterComponent from "../../components/FooterComponent";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function OrderSearchPage() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSearch = async (value) => {
    try {
      const response = await api.get("delivery/progress/each-user");
      setOrders(response.data);
    } catch (err) {
      console.log("Failed to fetch order", err);
    }
  };

  useEffect(() => {
    handleDarkMode();
    fetchOrder();
  }, []);

  const handleDarkMode = () => {
    // ======= Sticky Header and Back-to-Top Button Scroll Behavior
    const handleScroll = () => {
      const ud_header = document.querySelector(".ud-header");
      const logo = document.querySelectorAll(".header-logo");
      const sticky = ud_header ? ud_header.offsetTop : 0;

      if (window.pageYOffset > sticky) {
        ud_header.classList.add("sticky");
      } else {
        ud_header.classList.remove("sticky");
      }

      // Logo Change on Sticky Header
      if (logo.length) {
        const logoSrc = ud_header.classList.contains("sticky")
          ? "assets/images/logo/logo.svg"
          : "assets/images/logo/logo-white.svg";

        document.querySelector(".header-logo").src = logoSrc;
      }

      // Handle logo change for dark mode
      if (document.documentElement.classList.contains("dark")) {
        if (logo.length && ud_header.classList.contains("sticky")) {
          document.querySelector(".header-logo").src =
            "assets/images/logo/logo-white.svg";
        }
      }

      // Show or hide the back-to-top button
      const backToTop = document.querySelector(".back-to-top");
      if (backToTop) {
        if (window.scrollY > 50) {
          backToTop.style.display = "flex";
        } else {
          backToTop.style.display = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // ===== Navbar Toggle Behavior
    const navbarToggler = document.querySelector("#navbarToggler");
    const navbarCollapse = document.querySelector("#navbarCollapse");

    const handleNavbarToggle = () => {
      navbarToggler.classList.toggle("navbarTogglerActive");
      navbarCollapse.classList.toggle("hidden");
    };

    if (navbarToggler) {
      navbarToggler.addEventListener("click", handleNavbarToggle);
    }

    // Close Navbar on Link Click
    const closeNavbarOnClick = () => {
      navbarToggler.classList.remove("navbarTogglerActive");
      navbarCollapse.classList.add("hidden");
    };

    const navbarLinks = document.querySelectorAll(
      "#navbarCollapse ul li:not(.submenu-item) a",
    );
    navbarLinks.forEach((link) =>
      link.addEventListener("click", closeNavbarOnClick),
    );

    // ===== Sub-menu Toggle
    const submenuItems = document.querySelectorAll(".submenu-item");
    submenuItems.forEach((el) => {
      el.querySelector("a").addEventListener("click", () => {
        el.querySelector(".submenu").classList.toggle("hidden");
      });
    });

    // ===== FAQ Accordion
    const faqs = document.querySelectorAll(".single-faq");
    faqs.forEach((el) => {
      el.querySelector(".faq-btn").addEventListener("click", () => {
        el.querySelector(".icon").classList.toggle("rotate-180");
        el.querySelector(".faq-content").classList.toggle("hidden");
      });
    });

    // ===== wow.js for animations
    // new WOW.WOW().init();

    // ===== Scroll-to-Top Functionality
    const scrollTo = (element, to = 0, duration = 500) => {
      const start = element.scrollTop;
      const change = to - start;
      const increment = 20;
      let currentTime = 0;

      const animateScroll = () => {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;

        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        }
      };

      animateScroll();
    };

    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const backToTopButton = document.querySelector(".back-to-top");
    if (backToTopButton) {
      backToTopButton.onclick = () => scrollTo(document.documentElement);
    }

    // ===== Theme Switcher
    const themeSwitcher = document.getElementById("themeSwitcher");
    const userTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const themeCheck = () => {
      if (userTheme === "dark" || (!userTheme && systemTheme)) {
        document.documentElement.classList.add("dark");
      }
    };

    const themeSwitch = () => {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    };

    if (themeSwitcher) {
      themeSwitcher.addEventListener("click", themeSwitch);
    }

    themeCheck();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (navbarToggler) {
        navbarToggler.removeEventListener("click", handleNavbarToggle);
      }
      navbarLinks.forEach((link) =>
        link.removeEventListener("click", closeNavbarOnClick),
      );
    };
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleOpenModal = (values) => {
    setSelectedOrder(values);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDistance = (distance) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(distance) + " km"
    );
  };

  const fetchOrder = async () => {
    try {
      const response = await api.get("/customer/order/each-user");
      setOrders(response.data);
    } catch (err) {
      console.log("Failed to fetch order", err);
    }
  };

  const generateTables = (orderDetails) => {
    return (
      <div className="overflow-x-auto">
        <table className="table-container w-full overflow-hidden text-nowrap rounded-xl text-center text-sm shadow-pricing">
          <thead className="bg-gray-200 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Fish ID
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Farm Name
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Farm Address
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Fish Species
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Number of Fish
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Size of Fish (cm)
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Total Box
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Total Volume (L)
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Price ($)
                </span>
              </th>
              <th className="px-3 py-2">
                <span className="block py-3 text-base font-medium text-dark dark:text-white">
                  Health Status
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="text-base text-dark dark:text-white">
            {orderDetails.map((detail, index) => (
              <tr
                key={index}
                className="text-center hover:table-row hover:scale-105 dark:hover:table-row"
              >
                <td className="whitespace-nowrap px-6 py-2 font-medium">
                  {detail.id}
                </td>
                <td className="text-wrap px-6 py-2">{detail.nameFarm}</td>
                <td className="text-wrap px-6 py-2">{detail.farmAddress}</td>
                <td className="px-6 py-2">{detail.fishSpecies}</td>
                <td className="px-6 py-2">{detail.numberOfFish}</td>
                <td className="px-6 py-2">{detail.sizeOfFish}</td>
                <td className="px-6 py-2">{detail.totalBox}</td>
                <td className="px-6 py-2">{detail.totalVolume}</td>
                <td className="px-6 py-2">{detail.priceOfFish}</td>
                <td className="px-6 py-2">{detail.healthFishStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleFeedback = async (values) => {
    try {
      setLoading(true);
      const response = await api.post("feedback", values);
      toast.success("Successfully send feedback");
    } catch (err) {
      toast.error(err.response.data || "Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (values) => {
    try {
      setLoading(true);
      const response = await api.post("/customer/payment", values);
      console.log(response);
      window.open(response.data);
      toast.success("Successfully pay for order");
    } catch (err) {
      toast.error(err.response.data || "Failed to pay for order");
    } finally {
      setLoading(false);
    }
  };

  const { Step } = Steps;

  const Order = ({ order }) => {
    return (
      <>
        <div className="order my-8">
          <div className="-mx-4 flex flex-wrap rounded-sm p-6 shadow-pricing">
            <div className="mx-auto w-full px-4 md:px-5 lg:px-5">
              <div className="inline-flex w-full flex-col items-start justify-start gap-4">
                <div className="flex w-full flex-row items-center justify-between gap-4">
                  <div className="inline-flex w-full flex-col justify-center gap-1 md:w-1/2 md:items-start md:justify-start">
                    <h2 className="mb-2 text-2xl font-semibold leading-9 text-dark dark:text-white">
                      Order ID:{" "}
                      <span className="text-dark dark:text-white">
                        {order?.id}
                      </span>
                    </h2>
                    <span className="text-base font-medium leading-relaxed text-dark dark:text-white">
                      {order?.orderDate}
                    </span>
                  </div>
                  <div className="flex w-full flex-col items-end justify-between md:w-1/2">
                    {(order?.orderStatus === "PAID" ||
                      order?.orderStatus === "DELIVERED") && (
                      <p className="mb-3 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-0.5 text-sm font-medium leading-6 text-emerald-600 lg:mt-3">
                        {order?.orderStatus}
                      </p>
                    )}
                    {order?.orderStatus === "PENDING" && (
                      <p className="mb-3 whitespace-nowrap rounded-full bg-indigo-50 px-3 py-0.5 text-sm font-medium leading-6 text-indigo-600 lg:mt-3">
                        {order?.orderStatus}
                      </p>
                    )}
                    {order?.orderStatus === "REJECTED" && (
                      <p className="mb-3 whitespace-nowrap rounded-full bg-red-50 px-3 py-0.5 text-sm font-medium leading-6 text-red-600 lg:mt-3">
                        {order?.orderStatus}
                      </p>
                    )}
                    {order?.orderStatus === "AWAITING_PAYMENT" && (
                      <p className="mb-3 whitespace-nowrap rounded-full bg-yellow-50 px-3 py-0.5 text-sm font-medium leading-6 text-yellow-600 lg:mt-3">
                        {order?.orderStatus}
                      </p>
                    )}
                    <button className="primaryButton flex w-full items-center justify-center rounded-lg py-2 transition-all duration-700 ease-in-out sm:w-fit md:w-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        className="fill-current"
                      >
                        <path
                          d="M14.25 9V5.25C14.25 3.83579 14.25 3.12868 13.8107 2.68934C13.3713 2.25 12.6642 2.25 11.25 2.25H6.75C5.33579 2.25 4.62868 2.25 4.18934 2.68934C3.75 3.12868 3.75 3.83579 3.75 5.25V9M6.75 5.25H11.25M6.75 7.5H11.25M12 12.2143C12 12.0151 12 11.9155 12.0188 11.8331C12.0829 11.5522 12.3022 11.3329 12.5831 11.2688C12.6655 11.25 12.7651 11.25 12.9643 11.25H14.25C14.9571 11.25 15.3107 11.25 15.5303 11.4697C15.75 11.6893 15.75 12.0429 15.75 12.75V14.25C15.75 14.9571 15.75 15.3107 15.5303 15.5303C15.3107 15.75 14.9571 15.75 14.25 15.75H3.75C3.04289 15.75 2.68934 15.75 2.46967 15.5303C2.25 15.3107 2.25 14.9571 2.25 14.25V12.75C2.25 12.0429 2.25 11.6893 2.46967 11.4697C2.68934 11.25 3.04289 11.25 3.75 11.25H5.03571C5.23491 11.25 5.3345 11.25 5.41689 11.2688C5.69776 11.3329 5.91709 11.5522 5.9812 11.8331C6 11.9155 6 12.0151 6 12.2143C6 12.4135 6 12.5131 6.0188 12.5955C6.08291 12.8763 6.30224 13.0957 6.58311 13.1598C6.6655 13.1786 6.76509 13.1786 6.96429 13.1786H11.0357C11.2349 13.1786 11.3345 13.1786 11.4169 13.1598C11.6978 13.0957 11.9171 12.8763 11.9812 12.5955C12 12.5131 12 12.4135 12 12.2143Z"
                          stroke="white"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="whitespace-nowrap px-1.5 text-sm font-medium leading-6">
                        Print Invoice
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex w-full flex-row items-center justify-between gap-4">
                  <Form layout="vertical">
                    <div className="flex w-full flex-wrap justify-between">
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Origin Location
                          </span>
                        }
                        initialValue={order?.originLocation}
                        name="originLocation"
                        className="mb-1 w-full md:w-1/2 md:pr-4"
                      >
                        <Input
                          readOnly
                          placeholder="Origin Location"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Destination Location
                          </span>
                        }
                        initialValue={order?.destinationLocation}
                        name="destinationLocation"
                        className="mb-1 w-full md:w-1/2 md:pl-4"
                      >
                        <Input
                          readOnly
                          placeholder="Destination Location"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Customer Notes
                          </span>
                        }
                        initialValue={order?.customerNotes}
                        name="customerNotes"
                        className="mb-1 w-full md:w-1/2 md:pr-4"
                      >
                        <Input.TextArea
                          readOnly
                          placeholder="Customer Notes"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Recipient Info
                          </span>
                        }
                        initialValue={order?.recipientInfo}
                        name="recipientInfo"
                        className="mb-1 w-full md:w-1/2 md:pl-4"
                      >
                        <Input.TextArea
                          readOnly
                          placeholder="Recipient Info"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Transport Method
                          </span>
                        }
                        initialValue={order?.methodTransPort}
                        name="methodTransport"
                        className="mb-1 w-full md:w-1/2 md:pr-4"
                      >
                        <Input
                          readOnly
                          placeholder="Method Transport"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Payment Method
                          </span>
                        }
                        initialValue={order?.paymentMethod}
                        name="paymentMethod"
                        className="mb-1 w-full md:w-1/2 md:pl-4"
                      >
                        <Input
                          readOnly
                          placeholder="Payment Method"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Total Distance (Km)
                          </span>
                        }
                        initialValue={formatDistance(order?.totalDistance)}
                        name="totalDistance"
                        className="mb-1 w-full md:w-1/2 md:pr-4"
                      >
                        <Input
                          readOnly
                          placeholder="Total Distance"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </div>
                <div className="inline-flex w-full items-start justify-end gap-4">
                  <div className="inline-flex w-full flex-col items-start justify-start gap-4">
                    <div className="flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-white dark:bg-dark md:items-start md:justify-start">
                      <h2 className="font-manrope w-full border-b border-gray-200 pb-5 text-center text-2xl font-semibold leading-9 text-dark dark:text-white md:text-start">
                        Order Tracking
                      </h2>
                      <div className="w-full flex-col items-center justify-center md:flex-row">
                        <Steps current={4}>
                          <Step
                            title={
                              <span className="dark:text-white">
                                In Progress
                              </span>
                            }
                            description={
                              <span className="dark:text-white">hello</span>
                            }
                            subTitle={
                              <span className="dark:text-white">hello</span>
                            }
                            icon={
                              <LoadingOutlined
                                style={{
                                  color: " rgb(59 130 246)",
                                }}
                              />
                            }
                          />
                          <Step
                            title={
                              <span className="dark:text-white">Waiting</span>
                            }
                            subTitle={
                              <span className="dark:text-white">hello</span>
                            }
                            description={
                              <div>
                                <span className="dark:text-white">hello</span>
                                <img
                                  src="./assets/images/blog/blog-01.jpg"
                                  alt="Waiting"
                                  className="mt-2"
                                />
                              </div>
                            }
                            icon={
                              <ClockCircleOutlined
                                style={{ color: "rgb(107 114 128)" }}
                              />
                            }
                          />
                          <Step
                            title={
                              <span className="dark:text-white">Waiting</span>
                            }
                            subTitle={
                              <span className="dark:text-white">hello</span>
                            }
                            description={
                              <span className="dark:text-white">hello</span>
                            }
                            icon={
                              <ClockCircleOutlined
                                style={{ color: "rgb(107 114 128)" }}
                              />
                            }
                          />
                          <Step
                            title={
                              <span className="dark:text-white">Rejected</span>
                            }
                            subTitle={
                              <span className="dark:text-white">hello</span>
                            }
                            description={
                              <span className="dark:text-white">hello</span>
                            }
                            icon={
                              <CloseCircleOutlined
                                style={{ color: "rgb(239 68 68)" }}
                              />
                            }
                          />
                          <Step
                            title={
                              <span className="dark:text-white">Done</span>
                            }
                            subTitle={
                              <span className="dark:text-white">hello</span>
                            }
                            description={
                              <span className="dark:text-white">hello</span>
                            }
                            icon={
                              <CheckCircleOutlined
                                style={{ color: "rgb(16 185 129)" }}
                              />
                            }
                          />
                        </Steps>
                      </div>
                    </div>
                    <div className="flex w-full flex-row items-end justify-end gap-1.5">
                      {order?.orderStatus === "DELIVERED" && (
                        <div className="">
                          <Modal
                            title="Feedback"
                            loading={loading}
                            onOk={() => form.submit()}
                            open={openModal}
                            onCancel={handleCloseModal}
                          >
                            <Form
                              labelCol={{ span: 24 }}
                              onFinish={handleFeedback}
                            >
                              <Alert
                                message={`Feedback for ${selectedOrder?.id}`}
                                type="info"
                              />
                              <Form.Item
                                label="Order Id"
                                name="orderId"
                                initialValue={selectedOrder?.id}
                              >
                                <Input hidden />
                              </Form.Item>
                              <Form.Item
                                label="Rating Score"
                                name="ratingScore"
                              >
                                <Rate></Rate>
                              </Form.Item>
                              <Form.Item label="Comment" name="comment">
                                <Input.TextArea />
                              </Form.Item>
                            </Form>
                          </Modal>
                          <Button onClick={() => handleOpenModal(order)}>
                            Feedback
                          </Button>
                        </div>
                      )}
                      {order?.orderStatus === "AWAITING_PAYMENT" && (
                        <Button
                          onClick={() => handlePayment(order?.id)}
                          loading={loading}
                        >
                          Payment
                        </Button>
                      )}
                    </div>
                    <div className="flex w-full flex-col items-start justify-start gap-1.5">
                      <h6 className="text-right text-base font-medium leading-relaxed text-dark dark:text-white">
                        Order Note:
                      </h6>
                      <p className="text-sm font-normal leading-normal text-dark dark:text-dark-6">
                        Make sure to ship all the ordered items together by
                        Friday. I`ve emailed you the details, so please check it
                        an review it. Thank You!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="relative z-10 overflow-hidden pb-[60px] pt-[120px] dark:bg-dark md:pt-[130px] lg:pt-[160px]">
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3"></div>
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Login Page
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  There are many variations of passages of Lorem Ipsum
                  available.
                </p>

                <ul className="flex items-center justify-center gap-[10px]">
                  <li>
                    <Link
                      to="/"
                      className="flex items-center gap-[10px] text-base font-medium text-dark dark:text-white"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      href="javascript:void(0)"
                      className="flex items-center gap-[10px] text-base font-medium text-body-color"
                    >
                      <span className="text-body-color dark:text-dark-6">
                        {" "}
                        /{" "}
                      </span>
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 overflow-hidden pb-[60px] pt-[120px] dark:bg-dark md:pt-[130px] lg:pt-[160px]">
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3"></div>
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Order List Page
                </h1>
                <div className="flex w-full items-center justify-center py-2">
                  <div className="flex w-1/2">
                    <Input
                      placeholder="Search..."
                      allowClear
                      onPressEnter={(e) => handleSearch(e.target.value)}
                      className="w-full"
                    />
                    <Button
                      style={{ marginLeft: "0" }}
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={() =>
                        handleSearch(document.querySelector("input").value)
                      }
                    >
                      Search
                    </Button>
                  </div>
                </div>
                <ul className="flex items-center justify-center gap-[10px]">
                  <Link>
                    <a
                      to="/"
                      className="flex items-center gap-[10px] text-base font-medium text-dark dark:text-white"
                    >
                      Home Page
                    </a>
                  </Link>
                  <li>
                    <Link
                      to="/order-list"
                      href="javascript:void(0)"
                      className="flex items-center gap-[10px] text-base font-medium text-body-color"
                    >
                      <span className="text-body-color dark:text-dark-6">
                        {" "}
                        /{" "}
                      </span>
                      Order List Page
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section
        id="order-detail"
        className="relative bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]"
      >
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              {/*  */}
              <div className="order-list">
                {orders.map((order) => (
                  <Order key={order.id} order={order} />
                ))}
              </div>
              {/*  */}
              <div className="flex justify-end">
                <Pagination defaultCurrent={1} total={50} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterComponent />
    </>
  );
}

export default OrderSearchPage;
