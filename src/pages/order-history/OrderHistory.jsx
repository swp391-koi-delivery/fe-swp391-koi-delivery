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
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  HomeOutlined,
  LoadingOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

function OrderHistoryPage() {
  const [form] = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const { Step } = Steps;

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

  const formatVND = (amount) => {
    // Ensure amount is a valid number
    if (typeof amount !== "number" || isNaN(amount)) {
      return "0"; // or return a default value like "0" or "N/A"
    }

    // Convert the number to a string without decimals
    const amountString = amount.toFixed(0);

    // Check if the number is less than 1000
    if (amountString.length <= 3) {
      return amountString; // No need for dot or comma formatting
    }

    // Separate the number into the last three digits and the rest
    const lastThree = amountString.slice(-3);
    const beforeLastThree = amountString.slice(0, -3);

    // Format the first part with commas every three digits
    const formattedBeforeLastThree = beforeLastThree.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ",",
    );

    // Combine with a dot before the last three digits
    const formattedVND = `${formattedBeforeLastThree}.${lastThree}`;

    return formattedVND;
  };

  const formatDistance = (distance) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(distance) + " km"
    );
  };

  const generateTable = (orderDetails) => {
    return (
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="container w-full table-auto overflow-hidden text-nowrap rounded-xl text-center shadow-pricing">
          <thead className="bg-gray-200 dark:bg-slate-600">
            <tr>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Fish ID
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Farm Name
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Farm Address
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Fish Species
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Number of Fish
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Size of Fish (cm)
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Total Box
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Total Volume (L)
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
                  Price ($)
                </span>
              </th>
              <th className="px-3 py-1">
                <span className="block text-wrap py-1 text-base font-medium text-dark dark:text-white">
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
                <td className="font-small whitespace-nowrap px-2 py-1">
                  {detail.id}
                </td>
                <td className="text-wrap px-2 py-1">{detail.nameFarm}</td>
                <td className="text-wrap px-2 py-1">{detail.farmAddress}</td>
                <td className="px-2 py-1">{detail.fishSpecies}</td>
                <td className="px-2 py-1">{detail.numberOfFish}</td>
                <td className="px-2 py-1">{detail.sizeOfFish}</td>
                <td className="px-2 py-1">{detail.totalBox}</td>
                <td className="px-2 py-1">{detail.totalVolume}</td>
                <td className="px-6 py-1">{detail.priceOfFish}</td>
                <td className="px-2 py-1">{detail.healthFishStatus}</td>
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
      const response = await api.post("feedBack", values);
      toast.success("Successfully send feedback");
      setOpenModal(false);
    } catch (err) {
      toast.error(err.response.data || "Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async (page) => {
    console.log(page);
    setLoading(true);
    try {
      const response = await api.get(
        `/customer/order/orderHistory?page=${page}&size=5`,
      );
      console.log(response);
      setTotalPages(response.data.totalElements);
      setOrders(response.data.content);
    } catch (err) {
      console.log("Failed to fetch order", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    localStorage.setItem("currentPage", page);
    fetchOrder(page);
  };

  const renderSteps = (progresses) => {
    return progresses.map((progress, index) => {
      let icon;
      let image;
      let color = "rgb(107 114 128)";
      let title = progress.progressStatus;

      if (progress.inProgress === true) {
        color = "rgb(59 130 246)"; // Active blue color
      }

      // Choose icon based on progressStatus
      switch (progress.progressStatus) {
        case "ON_SITE":
          icon = <LoadingOutlined style={{ color }} />;
          break;
        case "FISH_CHECKED":
          icon = <FileDoneOutlined style={{ color }} />;
          break;
        case "WAREHOUSING":
          icon = <HomeOutlined style={{ color }} />;
          break;
        case "EN_ROUTE":
          icon = <TruckOutlined style={{ color }} />;
          break;
        case "HANDED_OVER":
          icon = <CheckCircleOutlined style={{ color }} />;
          break;
        case "CANCELED":
          icon = <CloseCircleOutlined style={{ color: "rgb(239 68 68)" }} />;
          break;
        default:
          icon = <ClockCircleOutlined style={{ color }} />;
      }

      // Dynamically load image if it exists in progress data
      image = progress.image ? (
        <img src={progress.image} alt={title} className="mt-2" />
      ) : null;

      return (
        <Step
          key={progress.id}
          title={<span className="dark:text-white">{title}</span>}
          description={
            <div>
              {progress.healthFishStatus !== null && (
                <span className="dark:text-white">
                  Fish status: {progress.healthFishStatus}
                </span>
              )}
            </div>
          }
          icon={icon}
        />
      );
    });
  };

  useEffect(() => {
    handleDarkMode();

    const savedPage = parseInt(localStorage.getItem("currentPage")) || 1;
    fetchOrder(savedPage);
  }, []);

  const Order = ({ order }) => {
    const currentStepIndex =
      order?.progresses.filter((progress) => progress.inProgress === true)
        .length - 1;
    return (
      <>
        <div className="order my-8">
          <div className="-mx-4 flex flex-wrap rounded-xl p-6 shadow-pricing">
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
                        {order.orderStatus}
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
                            Total Distance (Km)
                          </span>
                        }
                        initialValue={formatDistance(order?.totalDistance)}
                        name="totalDistance"
                        className="mb-1 w-full md:w-1/2 md:pl-4"
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
                    {order?.progresses && order?.progresses.length > 0 && (
                      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-white dark:bg-dark md:items-start md:justify-start">
                        <h2 className="font-manrope w-full border-b border-gray-200 pb-5 text-center text-2xl font-semibold leading-9 text-dark dark:text-white md:text-start">
                          Order Tracking
                        </h2>
                        <div className="w-full flex-col items-center justify-center md:flex-row">
                          {/*  */}
                          <Steps
                            current={
                              currentStepIndex >= 0 ? currentStepIndex : 0
                            }
                          >
                            {renderSteps(order.progresses)}
                          </Steps>
                          {/*  */}
                        </div>
                      </div>
                    )}
                    <div className="flex w-full flex-col items-start justify-start gap-5 rounded-xl bg-white dark:bg-dark">
                      <h2 className="font-manrope w-full border-b border-gray-200 pb-5 text-2xl font-semibold leading-9 text-dark dark:text-white">
                        Order Details
                      </h2>
                      <div className="table-list flex w-full flex-wrap items-center justify-center">
                        {generateTable(order?.orderDetails)}
                      </div>
                      <h2 className="font-manrope w-full border-b border-gray-200 pb-5 text-2xl font-semibold leading-9 text-dark dark:text-white">
                        Order Price
                      </h2>
                      <div className="flex w-full flex-col items-start justify-start gap-5 border-b border-gray-200 pb-5">
                        <div className="flex w-full flex-col items-center justify-start gap-4 md:flex-row lg:gap-8">
                          <div className="flex h-[170px] w-[170px] items-center justify-start md:w-2/12 md:flex-row lg:gap-5">
                            <img
                              className="rounded-md object-cover"
                              src="./assets/images/order-list/box.jpg"
                              alt="Boxes"
                            />
                          </div>
                          <div className="flex w-full md:w-10/12">
                            <div className="flex w-full flex-col items-start justify-center gap-3 sm:w-1/2">
                              <h4 className="text-nowrap text-center text-xl font-medium leading-8 text-dark dark:text-white">
                                Number of boxes
                              </h4>
                              <div className="flex flex-col items-start justify-start gap-0.5 md:items-start">
                                {/* Accumulate box quantities */}
                                {(() => {
                                  const boxSummary = order?.orderDetails.reduce(
                                    (acc, detail) => {
                                      detail?.boxDetails.forEach(
                                        (boxDetail) => {
                                          const boxType = boxDetail?.boxes.type;
                                          if (!acc[boxType]) {
                                            acc[boxType] = {
                                              type: boxType,
                                              quantity: 0,
                                              price:
                                                boxDetail?.boxes.price || 0,
                                            };
                                          }
                                          acc[boxType].quantity +=
                                            boxDetail.quantity;
                                        },
                                      );
                                      return acc;
                                    },
                                    {},
                                  );

                                  return Object.values(boxSummary).map(
                                    (box, idx) => (
                                      <div key={idx}>
                                        <h6 className="whitespace-nowrap text-base font-normal leading-relaxed text-dark dark:text-white">
                                          {box.type + " box"}: {box.quantity}
                                        </h6>
                                      </div>
                                    ),
                                  );
                                })()}
                                <div>
                                  <h6 className="whitespace-nowrap text-base font-normal leading-relaxed text-dark dark:text-white">
                                    Total box: {order?.totalBox}
                                  </h6>
                                </div>
                              </div>
                            </div>
                            <div className="flex w-full flex-col items-end justify-center pt-10 sm:w-1/2">
                              {(() => {
                                const boxSummary = order?.orderDetails.reduce(
                                  (acc, detail) => {
                                    detail.boxDetails.forEach((boxDetail) => {
                                      const boxType = boxDetail?.boxes.type;
                                      if (!acc[boxType]) {
                                        acc[boxType] = {
                                          type: boxType,
                                          quantity: 0,
                                          price: boxDetail?.boxes.price || 0,
                                        };
                                      }
                                      acc[boxType].quantity +=
                                        boxDetail.quantity;
                                    });
                                    return acc;
                                  },
                                  {},
                                );

                                return Object.values(boxSummary).map(
                                  (box, idx) => (
                                    <div
                                      key={idx}
                                      className="flex w-full max-w-[300px] justify-between text-wrap"
                                    >
                                      <h4 className="text-md text-nowrap font-semibold leading-6 text-dark dark:text-white md:text-xl md:leading-8">
                                        {formatVND(box.price)} x {box.quantity}
                                      </h4>
                                      <h4 className="text-md text-nowrap font-semibold leading-6 text-dark dark:text-white md:text-xl md:leading-8">
                                        {formatVND(box.price * box.quantity)}{" "}
                                        VND
                                      </h4>
                                    </div>
                                  ),
                                );
                              })()}
                              <div className="flex w-full max-w-[300px] justify-between text-wrap">
                                <h4 className="text-md text-nowrap font-semibold leading-6 text-dark dark:text-white md:text-xl md:leading-8"></h4>
                                <h4 className="text-md text-nowrap font-semibold leading-6 text-dark dark:text-white md:text-xl md:leading-8">
                                  {formatVND(order?.totalBoxPrice)} VND
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex w-full flex-col items-start justify-start gap-5">
                        <div className="flex w-full flex-col items-start justify-start gap-4 pb-1.5">
                          <div className="inline-flex w-full items-start justify-between gap-6">
                            <h6 className="text-base font-normal leading-relaxed text-dark dark:text-white">
                              Delivery fee
                            </h6>
                            <h6 className="text-nowrap text-right text-base font-medium leading-relaxed text-dark dark:text-white">
                              {formatVND(order?.distancePrice)} VND
                            </h6>
                          </div>
                          <div className="inline-flex w-full items-start justify-between gap-6">
                            <h6 className="text-base font-normal leading-relaxed text-dark dark:text-white">
                              Discount price (5% of wholesale order)
                            </h6>
                            <h6 className="text-nowrap text-right text-base font-medium leading-relaxed text-dark dark:text-white">
                              -{formatVND(order?.discountPrice)} VND
                            </h6>
                          </div>
                        </div>
                        <div className="inline-flex w-full items-start justify-between gap-6">
                          <h5 className="text-lg font-semibold leading-relaxed text-dark dark:text-white">
                            Total
                          </h5>
                          <h5 className="text-right text-lg font-semibold leading-relaxed text-dark dark:text-white">
                            {formatVND(order?.totalPrice)} VND
                          </h5>
                        </div>
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
                              form={form}
                              labelCol={{ span: 24 }}
                              onFinish={handleFeedback}
                            >
                              <Alert
                                message={`Feedback for ${selectedOrder?.id}`}
                                type="info"
                              />
                              <Form.Item
                                hidden
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
      <div className="ud-header absolute left-0 top-0 z-40 flex w-full items-center bg-transparent">
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4">
              <Link to="/" className="navbar-logo block w-full py-5">
                <img
                  src="assets/images/logo/logo-v2.svg"
                  alt="logo"
                  className="header-logo h-2/5 w-2/5 rounded-full"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  id="navbarToggler"
                  className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-dark dark:bg-white"></span>
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-dark dark:bg-white"></span>
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-dark dark:bg-white"></span>
                </button>
                <nav
                  id="navbarCollapse"
                  className="absolute right-4 top-full hidden w-full max-w-[250px] rounded-lg bg-white py-5 shadow-lg dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none dark:lg:bg-transparent xl:px-6"
                >
                  <ul className="blcok lg:flex 2xl:ml-20">
                    <li className="submenu-item group relative md:hidden">
                      <a
                        href="javascript:void(0)"
                        className="relative mx-8 flex items-center justify-between py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:ml-8 lg:mr-0 lg:inline-flex lg:py-6 lg:pl-0 lg:pr-4 lg:text-white lg:group-hover:text-white lg:group-hover:opacity-70 xl:ml-10"
                      >
                        Account
                        <svg
                          className="ml-2 fill-current"
                          width="16"
                          height="20"
                          viewBox="0 0 16 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7.99999 14.9C7.84999 14.9 7.72499 14.85 7.59999 14.75L1.84999 9.10005C1.62499 8.87505 1.62499 8.52505 1.84999 8.30005C2.07499 8.07505 2.42499 8.07505 2.64999 8.30005L7.99999 13.525L13.35 8.25005C13.575 8.02505 13.925 8.02505 14.15 8.25005C14.375 8.47505 14.375 8.82505 14.15 9.05005L8.39999 14.7C8.27499 14.825 8.14999 14.9 7.99999 14.9Z" />
                        </svg>
                      </a>
                      {user == null ? (
                        <div className="submenu relative left-0 top-full hidden w-[250px] rounded-sm bg-white p-4 transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full">
                          <Link
                            to="/login"
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Login
                          </Link>
                          <Link
                            to="/register"
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Register
                          </Link>
                        </div>
                      ) : (
                        <div className="submenu relative left-0 top-full hidden w-[250px] rounded-sm bg-white p-4 transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full">
                          <span className="block rounded px-4 text-base text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary">
                            {user?.username}
                          </span>
                          <Link
                            to="/profileUser"
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Profile
                          </Link>
                          <Link
                            onClick={handleLogout}
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Logout
                          </Link>
                        </div>
                      )}
                    </li>
                    <li className="group relative">
                      <Link
                        to="/"
                        className="ud-menu-scroll mx-8 flex py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 lg:text-body-color dark:lg:text-dark-6"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="group relative">
                      <a
                        href="/#about"
                        className="ud-menu-scroll mx-8 flex py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 lg:text-body-color dark:lg:text-dark-6 xl:ml-10"
                      >
                        About
                      </a>
                    </li>
                    <li className="group relative">
                      <a
                        href="/#pricing"
                        className="ud-menu-scroll mx-8 flex py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 lg:text-body-color dark:lg:text-dark-6 xl:ml-10"
                      >
                        Pricing
                      </a>
                    </li>
                    <li className="group relative">
                      <a
                        href="/#estimate"
                        className="ud-menu-scroll mx-8 flex py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 lg:text-body-color dark:lg:text-dark-6 xl:ml-10"
                      >
                        Estimate
                      </a>
                    </li>

                    <li className="group relative">
                      <a
                        href="/#blog"
                        className="ud-menu-scroll mx-8 flex py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 lg:text-body-color dark:lg:text-dark-6 xl:ml-10"
                      >
                        Blog
                      </a>
                    </li>
                    <li className="group relative">
                      <a
                        href="/#contact"
                        className="ud-menu-scroll mx-8 flex py-2 text-base font-medium text-dark group-hover:text-primary dark:text-white lg:ml-7 lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 lg:text-body-color dark:lg:text-dark-6 xl:ml-10"
                      >
                        Contact
                      </a>
                    </li>
                    <li className="submenu-item group relative">
                      <a
                        href="javascript:void(0)"
                        className="relative mx-8 flex items-center justify-between py-2 text-base font-medium text-primary group-hover:text-primary lg:ml-8 lg:mr-0 lg:inline-flex lg:py-6 lg:pl-0 lg:pr-4 xl:ml-10"
                      >
                        Pages
                        <svg
                          className="ml-2 fill-current"
                          width="16"
                          height="20"
                          viewBox="0 0 16 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7.99999 14.9C7.84999 14.9 7.72499 14.85 7.59999 14.75L1.84999 9.10005C1.62499 8.87505 1.62499 8.52505 1.84999 8.30005C2.07499 8.07505 2.42499 8.07505 2.64999 8.30005L7.99999 13.525L13.35 8.25005C13.575 8.02505 13.925 8.02505 14.15 8.25005C14.375 8.47505 14.375 8.82505 14.15 9.05005L8.39999 14.7C8.27499 14.825 8.14999 14.9 7.99999 14.9Z" />
                        </svg>
                      </a>
                      {user && (
                        <div className="submenu relative left-0 top-full hidden w-[250px] rounded-sm bg-white p-4 transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full">
                          <Link
                            to="/"
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Home Page
                          </Link>
                          <Link
                            to="/order"
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Order Page
                          </Link>
                          <Link
                            to="/order-list"
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Order List Page
                          </Link>
                          <Link
                            to="/order-history"
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Order History Page
                          </Link>
                          <Link
                            to="/order-search"
                            className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                          >
                            Order Search Page
                          </Link>
                        </div>
                      )}
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <label
                  htmlFor="themeSwitcher"
                  className="inline-flex cursor-pointer items-center"
                  aria-label="themeSwitcher"
                  name="themeSwitcher"
                >
                  <input
                    type="checkbox"
                    name="themeSwitcher"
                    id="themeSwitcher"
                    className="sr-only"
                  />
                  <span
                    className="block text-dark dark:hidden dark:text-white"
                    onClick={() => handleDarkMode()}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13.3125 1.50001C12.675 1.31251 12.0375 1.16251 11.3625 1.05001C10.875 0.975006 10.35 1.23751 10.1625 1.68751C9.93751 2.13751 10.05 2.70001 10.425 3.00001C13.0875 5.47501 14.0625 9.11251 12.975 12.525C11.775 16.3125 8.25001 18.975 4.16251 19.0875C3.63751 19.0875 3.22501 19.425 3.07501 19.9125C2.92501 20.4 3.15001 20.925 3.56251 21.1875C4.50001 21.75 5.43751 22.2 6.37501 22.5C7.46251 22.8375 8.58751 22.9875 9.71251 22.9875C11.625 22.9875 13.5 22.5 15.1875 21.5625C17.85 20.1 19.725 17.7375 20.55 14.8875C22.1625 9.26251 18.975 3.37501 13.3125 1.50001ZM18.9375 14.4C18.2625 16.8375 16.6125 18.825 14.4 20.0625C12.075 21.3375 9.41251 21.6 6.90001 20.85C6.63751 20.775 6.33751 20.6625 6.07501 20.55C10.05 19.7625 13.35 16.9125 14.5875 13.0125C15.675 9.56251 15 5.92501 12.7875 3.07501C17.5875 4.68751 20.2875 9.67501 18.9375 14.4Z" />
                    </svg>
                  </span>
                  <span className="hidden text-dark dark:block dark:text-white">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2172_3070)">
                        <path d="M12 6.89999C9.18752 6.89999 6.90002 9.18749 6.90002 12C6.90002 14.8125 9.18752 17.1 12 17.1C14.8125 17.1 17.1 14.8125 17.1 12C17.1 9.18749 14.8125 6.89999 12 6.89999ZM12 15.4125C10.125 15.4125 8.58752 13.875 8.58752 12C8.58752 10.125 10.125 8.58749 12 8.58749C13.875 8.58749 15.4125 10.125 15.4125 12C15.4125 13.875 13.875 15.4125 12 15.4125Z" />
                        <path d="M12 4.2375C12.45 4.2375 12.8625 3.8625 12.8625 3.375V1.5C12.8625 1.05 12.4875 0.637497 12 0.637497C11.55 0.637497 11.1375 1.0125 11.1375 1.5V3.4125C11.175 3.8625 11.55 4.2375 12 4.2375Z" />
                        <path d="M12 19.7625C11.55 19.7625 11.1375 20.1375 11.1375 20.625V22.5C11.1375 22.95 11.5125 23.3625 12 23.3625C12.45 23.3625 12.8625 22.9875 12.8625 22.5V20.5875C12.8625 20.1375 12.45 19.7625 12 19.7625Z" />
                        <path d="M18.1125 6.74999C18.3375 6.74999 18.5625 6.67499 18.7125 6.48749L19.9125 5.28749C20.25 4.94999 20.25 4.42499 19.9125 4.08749C19.575 3.74999 19.05 3.74999 18.7125 4.08749L17.5125 5.28749C17.175 5.62499 17.175 6.14999 17.5125 6.48749C17.6625 6.67499 17.8875 6.74999 18.1125 6.74999Z" />
                        <path d="M5.32501 17.5125L4.12501 18.675C3.78751 19.0125 3.78751 19.5375 4.12501 19.875C4.27501 20.025 4.50001 20.1375 4.72501 20.1375C4.95001 20.1375 5.17501 20.0625 5.32501 19.875L6.52501 18.675C6.86251 18.3375 6.86251 17.8125 6.52501 17.475C6.18751 17.175 5.62501 17.175 5.32501 17.5125Z" />
                        <path d="M22.5 11.175H20.5875C20.1375 11.175 19.725 11.55 19.725 12.0375C19.725 12.4875 20.1 12.9 20.5875 12.9H22.5C22.95 12.9 23.3625 12.525 23.3625 12.0375C23.3625 11.55 22.95 11.175 22.5 11.175Z" />
                        <path d="M4.23751 12C4.23751 11.55 3.86251 11.1375 3.37501 11.1375H1.50001C1.05001 11.1375 0.637512 11.5125 0.637512 12C0.637512 12.45 1.01251 12.8625 1.50001 12.8625H3.41251C3.86251 12.8625 4.23751 12.45 4.23751 12Z" />
                        <path d="M18.675 17.5125C18.3375 17.175 17.8125 17.175 17.475 17.5125C17.1375 17.85 17.1375 18.375 17.475 18.7125L18.675 19.9125C18.825 20.0625 19.05 20.175 19.275 20.175C19.5 20.175 19.725 20.1 19.875 19.9125C20.2125 19.575 20.2125 19.05 19.875 18.7125L18.675 17.5125Z" />
                        <path d="M5.32501 4.125C4.98751 3.7875 4.46251 3.7875 4.12501 4.125C3.78751 4.4625 3.78751 4.9875 4.12501 5.325L5.32501 6.525C5.47501 6.675 5.70001 6.7875 5.92501 6.7875C6.15001 6.7875 6.37501 6.7125 6.52501 6.525C6.86251 6.1875 6.86251 5.6625 6.52501 5.325L5.32501 4.125Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_2172_3070">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </label>
                <div className="hidden sm:flex">
                  <div className="hidden sm:flex">
                    {user == null ? (
                      <div className="">
                        <Link
                          to="/login"
                          className="loginBtn px-[22px] py-2 text-base font-medium text-dark hover:opacity-70 dark:text-white"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="primaryButton rounded-md px-6 py-2 text-base font-medium text-white duration-300 ease-in-out"
                        >
                          Register
                        </Link>
                      </div>
                    ) : (
                      user != null &&
                      user?.role === "CUSTOMER" && (
                        <a className="submenu-item group relative">
                          <div className="pl-6">
                            <img
                              className="relative inline-block h-11 w-11 rounded-full"
                              src={
                                user?.image ||
                                "assets/images/navbar/default-avatar.jpg"
                              }
                              alt="default-avatar"
                            />
                          </div>

                          <div className="submenu relative right-0 top-full hidden w-[220px] rounded-sm bg-white p-4 transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full">
                            <span className="block rounded px-4 py-[10px] text-base text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary">
                              {user?.username}
                            </span>
                            <Link
                              to="/profileUser"
                              className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                            >
                              Profile
                            </Link>
                            <Link
                              onClick={handleLogout}
                              className="block rounded px-4 py-[10px] text-sm text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                            >
                              Logout
                            </Link>
                          </div>
                        </a>
                      )
                    )}
                  </div>
                </div>
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
                  Order History Page
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  All of your order information are here.
                </p>

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
                      to="/order-history"
                      href="javascript:void(0)"
                      className="flex items-center gap-[10px] text-base font-medium text-body-color"
                    >
                      <span className="text-body-color dark:text-dark-6">
                        {" "}
                        /{" "}
                      </span>
                      Order History Page
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
          <div className="mx-2 flex flex-wrap">
            <div className="w-full px-4">
              {/*  */}
              <div className="order-list">
                {loading ? (
                  <div className="flex justify-center">
                    <LoadingOutlined
                      style={{
                        fontSize: "10vw",
                        textAlign: "center",
                        color: "#F97316",
                      }}
                    />
                  </div>
                ) : (
                  orders.map((order) => <Order key={order.id} order={order} />)
                )}
              </div>
              {/*  */}
              <div className="flex justify-end">
                <Pagination
                  initialValue={
                    parseInt(localStorage.getItem("currentPage")) || 1
                  }
                  defaultCurrent={
                    parseInt(localStorage.getItem("currentPage")) || 1
                  }
                  total={totalPages}
                  defaultPageSize={5}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterComponent />
    </>
  );
}

export default OrderHistoryPage;
