import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { Button, Form, Input, Select, Radio } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import FooterComponent from "../../components/FooterComponent";
import { toast } from "react-toastify";
function OrderPage() {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  const [form] = useForm();
  const [selectedForm, setSelectedForm] = useState("personalOption");

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

  useEffect(() => {
    handleDarkMode();
  }, []);

  const handleRadioChange = (e) => {
    setSelectedForm(e.target.value);
  };

  const validateRecipientInfo = (_, value) => {
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^(84|0[3|5|7|8|9])(\d{8})$/;

    if (!value || (!emailRegex.test(value) && !phoneRegex.test(value))) {
      return Promise.reject(
        new Error(
          "Recipient Info must contain a valid email or phone number (starting with 84 or 0 followed by 9 digits)",
        ),
      );
    }
    return Promise.resolve();
  };

  const handleOrderDescribeChange = (value) => {
    if (value === "RETAIL_ORDER") {
      toast.info(
        "If total number of fish less than 10, retail order price will be suitable",
      );
    } else if (value === "WHOLESALE_ORDER") {
      toast.info(
        "If total number of fish more than 10, wholesale order price will be cheaper with 5% disconut",
      );
    }
  };

  const handleLocationChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue && !hasShownToast) {
      toast.info(
        "The more specific the location, the more accurate the shipping price.",
      );
      setHasShownToast(true);
    }

    if (!inputValue) {
      setHasShownToast(false);
    }
  };

  const handleSubmitOptimalOrder = async (values) => {
    try {
      setLoading(true);

      const { orderDetails } = values;

      if (!orderDetails || orderDetails.length === 0) {
        toast.error("Please add at least one fish before submitting!");
        return;
      }

      // Parse sizeOfFish và numberOfFish thành số
      const processedOrderDetails = orderDetails.map((detail) => ({
        ...detail,
        sizeOfFish: parseFloat(detail.sizeOfFish), // Đảm bảo sizeOfFish là số thập phân
        numberOfFish: parseInt(detail.numberOfFish, 10), // Đảm bảo numberOfFish là số nguyên
      }));

      const orderData = {
        ...values,
        orderOption: selectedForm,
        orderDetails: processedOrderDetails,
      };

      console.log(orderData);

      // Gửi API (bỏ ghi chú nếu cần thiết)
      // const response = await api.post("/customer/order", orderData);

      toast.success("Successfully created order");
      form.resetFields();
    } catch (error) {
      toast.error("Failed to create order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPersonalOrder = async (values) => {
    try {
      setLoading(true);
      const orderDetails = values.orderDetails;

      if (!orderDetails || orderDetails.length === 0) {
        toast.error("Please add at least one box before submitting!");
        return;
      }

      // Kiểm tra tất cả các box đã estimate hay chưa
      const unEstimatedBoxes = orderDetails.filter((box) => !box.isEstimated);

      if (unEstimatedBoxes.length > 0) {
        toast.error("Please estimate all boxes before submitting the order!");
        return;
      }

      // Xử lý các bước còn lại
      const updatedOrderDetails = orderDetails.map((box) => {
        const updatedFishes = box.fishes.map((fish) => ({
          ...fish,
          sizeOfFish: parseFloat(fish.sizeOfFish),
          numberOfFish: parseInt(fish.numberOfFish, 10),
          quantityEachBox: parseInt(fish.quantityEachBox, 10),
        }));
        return { ...box, fishes: updatedFishes };
      });

      const orderData = {
        ...values,
        orderOption: selectedForm,
        orderDetails: updatedOrderDetails,
      };

      // const response = await api.post("/customer/order", orderData);
      console.log(orderData);

      toast.success("Successfully created order");
      form.resetFields();
    } catch (error) {
      toast.error("Failed to create order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateBox = async (boxIndex) => {
    try {
      setLoading(true);

      const allOrderDetails = form.getFieldValue("orderDetails");
      const selectedBox = allOrderDetails?.[boxIndex];

      if (!selectedBox) {
        toast.error("The selected box does not exist!");
        return;
      }

      if (!selectedBox.fishes || selectedBox.fishes.length === 0) {
        toast.error("The selected box must contain at least one fish!");
        return;
      }

      // Validate only the current box fields
      const fieldsToValidate = [
        ["orderDetails", boxIndex, "boxType"], // Box type field
        ...selectedBox.fishes
          .map((_, fishIndex) => [
            ["orderDetails", boxIndex, "fishes", fishIndex, "fishSpecies"],
            ["orderDetails", boxIndex, "fishes", fishIndex, "sizeOfFish"],
            ["orderDetails", boxIndex, "fishes", fishIndex, "numberOfFish"],
            ...(selectedBox.isMultiple
              ? [
                  [
                    "orderDetails",
                    boxIndex,
                    "fishes",
                    fishIndex,
                    "quantityEachBox",
                  ],
                ]
              : []),
          ])
          .flat(),
      ];

      await form.validateFields(fieldsToValidate);

      // If validation passes
      console.log("Validated box: ", selectedBox);

      toast.success("Box estimated successfully!");

      // Mark the current box as estimated
      const newOrderDetails = [...allOrderDetails];
      newOrderDetails[boxIndex].isEstimated = true;
      form.setFieldsValue({ orderDetails: newOrderDetails });
    } catch (error) {
      console.error("Validation Error: ", error);
      toast.error("Failed to estimate box: " + error.message);
    } finally {
      setLoading(false);
    }
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
                  Order Page
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  There are many variations of passages of Lorem Ipsum
                  available.
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
                      to="/order"
                      href="javascript:void(0)"
                      className="flex items-center gap-[10px] text-base font-medium text-body-color"
                    >
                      <span className="text-body-color dark:text-dark-6">
                        {" "}
                        /{" "}
                      </span>
                      Order Page
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[#F4F7FF] py-14 dark:bg-dark lg:py-[90px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div
                className="wow fadeInUp relative mx-auto max-w-[825px] overflow-hidden rounded-xl bg-white px-8 py-14 text-center shadow-form dark:bg-dark-2 sm:px-12 md:px-[60px]"
                data-wow-delay=".15s"
              >
                <div className="mb-8 text-center">
                  <a
                    href="javascript:void(0)"
                    className="mx-auto flex max-w-[160px] justify-center"
                  >
                    <img
                      src="assets/images/logo/logo-v2.svg"
                      alt="logo"
                      className="header-logo h-2/5 w-2/5 rounded-full"
                    />
                  </a>
                </div>
                <Radio.Group
                  onChange={handleRadioChange}
                  value={selectedForm}
                  style={{ marginBottom: "20px" }}
                >
                  <Radio value="personalOption" style={{ padding: "0 5px" }}>
                    Personal Option
                  </Radio>
                  <Radio value="optimalOption" style={{ padding: "0 5px" }}>
                    Optimal Option
                  </Radio>
                </Radio.Group>
                {selectedForm === "personalOption" && (
                  <Form
                    name="personalOption"
                    form={form}
                    onFinish={handleSubmitPersonalOrder}
                    layout="vertical"
                  >
                    <div className="flex w-full flex-wrap">
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Origin Location
                          </span>
                        }
                        name="originLocation"
                        className="mb-4 w-full px-2 md:w-1/2"
                        onChange={handleLocationChange}
                        rules={[
                          {
                            required: true,
                            message: "Please input destination location",
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Input
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
                        name="destinationLocation"
                        className="mb-4 w-full px-2 md:w-1/2"
                        onChange={handleLocationChange}
                        rules={[
                          {
                            required: true,
                            message: "Please input destination location",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("originLocation") !== value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "Origin location and destination location cannot be the same.",
                                ),
                              );
                            },
                          }),
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Input
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
                        name="customerNotes"
                        className="mb-4 w-full px-2 md:w-1/2"
                        rules={[
                          {
                            required: true,
                            message: "Please input customer notes",
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Input.TextArea
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
                        name="recipientInfo"
                        className="mb-4 w-full px-2 md:w-1/2"
                        rules={[
                          {
                            required: true,
                            message: "Please input recipient info",
                          },
                          {
                            validator: validateRecipientInfo, // custom validation rule with the updated phone regex
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Input.TextArea
                          placeholder="Recipient Info"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">Order Type</span>
                        }
                        name="describeOrder"
                        className="mb-4 w-full px-2 md:w-1/2"
                        rules={[
                          {
                            required: true,
                            message: "Please select order type",
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Select
                          placeholder="Select order type"
                          onChange={handleOrderDescribeChange}
                          options={[
                            { value: "RETAIL_ORDER", label: "Retail Order" },
                            {
                              value: "WHOLESALE_ORDER",
                              label: "Wholesale Order",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Transport Method
                          </span>
                        }
                        name="methodTransPort"
                        className="mb-4 w-full px-2 md:w-1/2"
                        rules={[
                          {
                            required: true,
                            message: "Please select transport method",
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Select
                          placeholder="Select transport method"
                          onChange={handleOrderDescribeChange}
                          options={[
                            { value: "FAST_DELIVERY", label: "Fast Delivery" },
                            {
                              value: "NORMAL_DELIVERY",
                              label: "Normal Delivery",
                            },
                          ]}
                        />
                      </Form.Item>
                    </div>

                    <div className="flex w-full flex-wrap">
                      <Form.List name="orderDetails">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(
                              ({ key, name, fieldKey, ...restField }) => {
                                // Check if the box is estimated
                                const isBoxEstimated = form.getFieldValue([
                                  "orderDetails",
                                  name,
                                  "isEstimated",
                                ]);

                                // Get the list of fishes for the current box
                                const currentBoxFishes =
                                  form.getFieldValue([
                                    "orderDetails",
                                    name,
                                    "fishes",
                                  ]) || [];

                                return (
                                  <div
                                    key={key}
                                    className="mx-2 mb-5 flex w-full flex-col rounded-md border border-solid border-gray-200 text-start md:flex-row"
                                  >
                                    <div className="flex w-full flex-row flex-wrap">
                                      {/* Size Of Fish and Number Of Fish */}
                                      {currentBoxFishes.map(
                                        (fish, fishIndex) => (
                                          <div
                                            key={fishIndex}
                                            className="flex w-full flex-row"
                                          >
                                            {/* Species Of Fish */}
                                            <Form.Item
                                              label={
                                                <span className="inline-block w-16 dark:text-white">
                                                  Fish Species
                                                </span>
                                              }
                                              {...restField}
                                              name={[
                                                name,
                                                "fishes",
                                                fishIndex,
                                                "fishSpecies",
                                              ]}
                                              fieldKey={[
                                                fieldKey,
                                                "fishes",
                                                fishIndex,
                                                "fishSpecies",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Please input fish species",
                                                },
                                              ]}
                                              className="mb-4 px-2"
                                            >
                                              <Input
                                                disabled={isBoxEstimated}
                                                placeholder="Fish Species"
                                                className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                                              />
                                            </Form.Item>

                                            {/* Size Of Fish */}
                                            <Form.Item
                                              label={
                                                <span className="inline-block w-16 dark:text-white">
                                                  Size Of Fish (cm)
                                                </span>
                                              }
                                              {...restField}
                                              name={[
                                                name,
                                                "fishes",
                                                fishIndex,
                                                "sizeOfFish",
                                              ]}
                                              fieldKey={[
                                                fieldKey,
                                                "fishes",
                                                fishIndex,
                                                "sizeOfFish",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Please input size of fish",
                                                },
                                                {
                                                  validator: (_, value) =>
                                                    value >= 19.9 && value <= 83
                                                      ? Promise.resolve()
                                                      : Promise.reject(
                                                          new Error(
                                                            "Size must be between 19.9 and 83 cm",
                                                          ),
                                                        ),
                                                },
                                              ]}
                                              className="mb-4 px-2"
                                            >
                                              <Input
                                                disabled={isBoxEstimated}
                                                step="0.1"
                                                min="19.9"
                                                type="number"
                                                placeholder="Size Of Fish"
                                                className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                                              />
                                            </Form.Item>

                                            {/* Number Of Fish */}
                                            <Form.Item
                                              label={
                                                <span className="inline-block w-16 dark:text-white">
                                                  Number Of Fish
                                                </span>
                                              }
                                              {...restField}
                                              name={[
                                                name,
                                                "fishes",
                                                fishIndex,
                                                "numberOfFish",
                                              ]}
                                              fieldKey={[
                                                fieldKey,
                                                "fishes",
                                                fishIndex,
                                                "numberOfFish",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Please input number of fish",
                                                },
                                                {
                                                  validator: (_, value) =>
                                                    value > 0 && value <= 100
                                                      ? Promise.resolve()
                                                      : Promise.reject(
                                                          new Error(
                                                            "Number must be greater than 0 and less than or equal to 100",
                                                          ),
                                                        ),
                                                },
                                              ]}
                                              className="mb-4 px-2"
                                            >
                                              <Input
                                                disabled={isBoxEstimated}
                                                min="1"
                                                step="1"
                                                type="number"
                                                placeholder="Number Of Fish"
                                                className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                                              />
                                            </Form.Item>

                                            {/* Conditional rendering of Quantity Each Box input */}
                                            {form.getFieldValue("orderDetails")[
                                              name
                                            ]?.isMultiple ? (
                                              <Form.Item
                                                label={
                                                  <span className="inline-block w-16 dark:text-white">
                                                    Quantity Each Box
                                                  </span>
                                                }
                                                {...restField}
                                                name={[
                                                  name,
                                                  "fishes",
                                                  fishIndex,
                                                  "quantityEachBox",
                                                ]}
                                                fieldKey={[
                                                  fieldKey,
                                                  "fishes",
                                                  fishIndex,
                                                  "quantityEachBox",
                                                ]}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please input quantity each box",
                                                  },
                                                  {
                                                    validator: (_, value) =>
                                                      value > 0 && value <= 100
                                                        ? Promise.resolve()
                                                        : Promise.reject(
                                                            new Error(
                                                              "Number must be greater than 0 and less than or equal to 100",
                                                            ),
                                                          ),
                                                  },
                                                ]}
                                                className="mb-4 px-2"
                                              >
                                                <Input
                                                  disabled={isBoxEstimated}
                                                  min="1"
                                                  step="1"
                                                  type="number"
                                                  placeholder="Quantity Each Box"
                                                  className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                                                />
                                              </Form.Item>
                                            ) : null}
                                          </div>
                                        ),
                                      )}
                                    </div>

                                    {/* Select Box Type, Add Fish and Delete Fish */}
                                    <div className="flex w-1/2 flex-col justify-center md:w-auto">
                                      {/* Select Fish */}
                                      <Form.Item
                                        label={
                                          <span className="dark:text-white">
                                            Box Type
                                          </span>
                                        }
                                        name={[name, "boxType"]}
                                        fieldKey={[fieldKey, "boxType"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please select a box type",
                                          },
                                        ]}
                                        className="mb-3 px-2"
                                      >
                                        <Select
                                          disabled={isBoxEstimated}
                                          placeholder="Select Box Type"
                                          options={[
                                            {
                                              value: "small",
                                              label: "Small Box",
                                            },
                                            {
                                              value: "medium",
                                              label: "Medium Box",
                                            },
                                            {
                                              value: "large",
                                              label: "Large Box",
                                            },
                                          ]}
                                          className="w-full"
                                        />
                                      </Form.Item>

                                      {/* Add Fish */}
                                      <Button
                                        style={{ margin: "8px" }}
                                        type="primary"
                                        onClick={() => {
                                          const currentBoxes =
                                            form.getFieldValue(
                                              "orderDetails",
                                            ) || [];
                                          const updatedFishes = [
                                            ...(currentBoxes[name]?.fishes ||
                                              []),
                                            {
                                              fishSpecies: "",
                                              sizeOfFish: null,
                                              numberOfFish: null,
                                            },
                                          ];

                                          currentBoxes[name] = {
                                            ...currentBoxes[name],
                                            fishes: updatedFishes,
                                            isEstimated: false, // Reset the estimated flag
                                          };

                                          form.setFieldsValue({
                                            orderDetails: currentBoxes,
                                          });
                                        }}
                                      >
                                        Add Fish
                                      </Button>

                                      {/* Delete Fish */}
                                      <Button
                                        style={{
                                          color: "#ff4d4f",
                                          margin: "8px",
                                          backgroundColor: "transparent",
                                        }}
                                        danger
                                        onClick={() => {
                                          const currentBoxes =
                                            form.getFieldValue(
                                              "orderDetails",
                                            ) || [];
                                          const updatedFishes = (
                                            currentBoxes[name]?.fishes || []
                                          ).slice(0, -1);
                                          currentBoxes[name] = {
                                            ...currentBoxes[name],
                                            fishes: updatedFishes,
                                            isEstimated: false, // Reset the estimated flag
                                          };

                                          form.setFieldsValue({
                                            orderDetails: currentBoxes,
                                          });
                                        }}
                                      >
                                        Delete Fish
                                      </Button>

                                      {/* Estimate Box */}
                                      <Button
                                        onClick={() => handleEstimateBox(name)}
                                        className="primaryButton"
                                        disabled={isBoxEstimated}
                                        loading={loading}
                                        style={{
                                          margin: "8px",
                                          color: "#fff",
                                          border: "none",
                                          fontSize: "1rem",
                                          lineHeight: "1.5rem",
                                          transitionDuration: "300ms",
                                          fontWeight: "500",
                                          transitionProperty:
                                            "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
                                          transitionTimingFunction:
                                            "cubic-bezier(0.4, 0, 0.2, 1)",
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            "rgba(234, 88, 12, 1)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            "rgba(249, 115, 22, 1)";
                                        }}
                                      >
                                        Estimate
                                      </Button>
                                    </div>
                                  </div>
                                );
                              },
                            )}

                            {/* Add Box and Delete Single Box */}
                            <div className="mb-4 flex">
                              <Button
                                style={{ marginLeft: "8px" }}
                                onClick={() =>
                                  add({
                                    fishes: [],
                                    boxType: null,
                                    isMultiple: false, // For single box, no quantity input
                                  })
                                }
                                type="primary"
                              >
                                Add Single Box
                              </Button>

                              {fields.length > 0 && (
                                <Button
                                  style={{
                                    color: "#ff4d4f",
                                    marginLeft: "8px",
                                    backgroundColor: "transparent",
                                  }}
                                  danger
                                  onClick={() => remove(fields.length - 1)}
                                >
                                  Delete Single Box
                                </Button>
                              )}
                            </div>
                            {/* Add Box and Delete Multiple Box */}
                            <div className="mb-4 flex">
                              <Button
                                style={{ marginLeft: "8px" }}
                                onClick={() =>
                                  add({
                                    fishes: [],
                                    boxType: null,
                                    isMultiple: true, // For multiple box, includes quantity input
                                  })
                                }
                                type="primary"
                              >
                                Add Multiple Box
                              </Button>
                              {fields.length > 0 && (
                                <Button
                                  style={{
                                    color: "#ff4d4f",
                                    marginLeft: "8px",
                                    backgroundColor: "transparent",
                                  }}
                                  danger
                                  onClick={() => {
                                    const currentBoxes =
                                      form.getFieldValue("orderDetails") || [];
                                    const lastBox =
                                      currentBoxes[currentBoxes.length - 1];

                                    if (lastBox?.isMultiple) {
                                      // Remove last multiple box
                                      const updatedBoxes = currentBoxes.slice(
                                        0,
                                        -1,
                                      );
                                      form.setFieldsValue({
                                        orderDetails: updatedBoxes,
                                      });
                                    }
                                  }}
                                >
                                  Delete Multiple Box
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                      </Form.List>
                    </div>

                    <div className="mb-4 px-2">
                      <Button
                        onClick={() => form.submit()}
                        className="primaryButton"
                        loading={loading}
                        style={{
                          margin: "0px",
                          width: "100%",
                          color: "#fff",
                          border: "none",
                          padding: "1.25rem 1.75rem",
                          fontSize: "1rem",
                          lineHeight: "1.5rem",
                          transitionDuration: "300ms",
                          fontWeight: "500",
                          transitionProperty:
                            "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
                          transitionTimingFunction:
                            "cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(234, 88, 12, 1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(249, 115, 22, 1)";
                        }}
                      >
                        Order
                      </Button>
                    </div>
                  </Form>
                )}
                {selectedForm === "optimalOption" && (
                  <Form
                    name="optimalOption"
                    form={form}
                    onFinish={handleSubmitOptimalOrder}
                    layout="vertical"
                  >
                    <div className="flex w-full flex-wrap">
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Origin Location
                          </span>
                        }
                        name="originLocation"
                        className="mb-4 w-full px-2 md:w-1/2"
                        onChange={handleLocationChange}
                        rules={[
                          {
                            required: true,
                            message: "Please input destination location",
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Input
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
                        name="destinationLocation"
                        className="mb-4 w-full px-2 md:w-1/2"
                        onChange={handleLocationChange}
                        rules={[
                          {
                            required: true,
                            message: "Please input destination location",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("originLocation") !== value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "Origin location and destination location cannot be the same.",
                                ),
                              );
                            },
                          }),
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Input
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
                        name="customerNotes"
                        className="mb-4 w-full px-2 md:w-1/2"
                        rules={[
                          {
                            required: true,
                            message: "Please input customer notes",
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Input.TextArea
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
                        name="recipientInfo"
                        className="mb-4 w-full px-2 md:w-1/2"
                        rules={[
                          {
                            required: true,
                            message: "Please input recipient info",
                          },
                          {
                            validator: validateRecipientInfo, // custom validation rule with the updated phone regex
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Input.TextArea
                          placeholder="Recipient Info"
                          className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">Order Type</span>
                        }
                        name="describeOrder"
                        className="mb-4 w-full px-2 md:w-1/2"
                        rules={[
                          {
                            required: true,
                            message: "Please select order type",
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Select
                          placeholder="Select order type"
                          onChange={handleOrderDescribeChange}
                          options={[
                            { value: "RETAIL_ORDER", label: "Retail Order" },
                            {
                              value: "WHOLESALE_ORDER",
                              label: "Wholesale Order",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="dark:text-white">
                            Transport Method
                          </span>
                        }
                        name="methodTransPort"
                        className="mb-4 w-full px-2 md:w-1/2"
                        rules={[
                          {
                            required: true,
                            message: "Please select transport method",
                          },
                        ]}
                        style={{ textAlign: "left" }}
                      >
                        <Select
                          placeholder="Select transport method"
                          onChange={handleOrderDescribeChange}
                          options={[
                            { value: "FAST_DELIVERY", label: "Fast Delivery" },
                            {
                              value: "NORMAL_DELIVERY",
                              label: "Normal Delivery",
                            },
                          ]}
                        />
                      </Form.Item>
                    </div>

                    <div className="flex w-full flex-wrap">
                      <Form.List name="orderDetails">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(
                              ({ key, name, fieldKey, ...restField }) => (
                                <div
                                  key={key}
                                  className="grid w-full grid-cols-3 grid-rows-[auto,auto] items-center gap-2 md:grid-cols-[1fr,1fr,1fr,auto]"
                                >
                                  <Form.Item
                                    label={
                                      <span className="inline-block w-16 dark:text-white">
                                        Fish Species
                                      </span>
                                    }
                                    {...restField}
                                    name={[name, "fishSpecies"]}
                                    fieldKey={[fieldKey, "fishSpecies"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input fish species",
                                      },
                                    ]}
                                    className="px-2"
                                  >
                                    <Input
                                      placeholder="Fish Species"
                                      className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    label={
                                      <span className="inline-block w-16 dark:text-white">
                                        Size Of Fish (cm)
                                      </span>
                                    }
                                    {...restField}
                                    name={[name, "sizeOfFish"]}
                                    fieldKey={[fieldKey, "sizeOfFish"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input size of fish",
                                      },
                                      {
                                        validator: (_, value) =>
                                          value >= 19.9 && value <= 83
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                "Size must be between 19.9 and 83 cm",
                                              ),
                                      },
                                    ]}
                                    className="px-2"
                                  >
                                    <Input
                                      type="number"
                                      placeholder="Size Of Fish"
                                      className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    label={
                                      <span className="inline-block w-16 dark:text-white">
                                        Number Of Fish
                                      </span>
                                    }
                                    {...restField}
                                    name={[name, "numberOfFish"]}
                                    fieldKey={[fieldKey, "numberOfFish"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input number of fish",
                                      },
                                      {
                                        validator: (_, value) =>
                                          value > 0 && value <= 100
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                "Number must be greater than 0 and less than or equal to 100",
                                              ),
                                      },
                                    ]}
                                    className="px-2"
                                  >
                                    <Input
                                      type="number"
                                      placeholder="Number Of Fish"
                                      className="w-full rounded-md border border-stroke bg-transparent text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                                    />
                                  </Form.Item>

                                  <Button
                                    danger
                                    onClick={() => remove(name)}
                                    className="col-span-1 mb-4"
                                    style={{
                                      color: "#ff4d4f",
                                      backgroundColor: "transparent",
                                      marginLeft: "8px",
                                    }}
                                  >
                                    Delete Fish
                                  </Button>
                                </div>
                              ),
                            )}

                            <Form.Item className="">
                              <Button
                                onClick={() =>
                                  add({
                                    fishSpecies: "",
                                    sizeOfFish: null,
                                    numberOfFish: null,
                                  })
                                }
                                style={{ marginLeft: "8px" }}
                              >
                                Add Fish
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </div>

                    <div className="mb-4 px-2">
                      <Button
                        onClick={() => form.submit()}
                        className="primaryButton"
                        loading={loading}
                        style={{
                          margin: "0px",
                          width: "100%",
                          color: "#fff",
                          border: "none",
                          padding: "1.25rem 1.75rem",
                          fontSize: "1rem",
                          lineHeight: "1.5rem",
                          transitionDuration: "300ms",
                          fontWeight: "500",
                          transitionProperty:
                            "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
                          transitionTimingFunction:
                            "cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(234, 88, 12, 1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(249, 115, 22, 1)";
                        }}
                      >
                        Order
                      </Button>
                    </div>
                  </Form>
                )}
                <div>
                  <span className="absolute right-1 top-1">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="1.39737"
                        cy="38.6026"
                        r="1.39737"
                        transform="rotate(-90 1.39737 38.6026)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.39737"
                        cy="1.99122"
                        r="1.39737"
                        transform="rotate(-90 1.39737 1.99122)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="13.6943"
                        cy="38.6026"
                        r="1.39737"
                        transform="rotate(-90 13.6943 38.6026)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="13.6943"
                        cy="1.99122"
                        r="1.39737"
                        transform="rotate(-90 13.6943 1.99122)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="25.9911"
                        cy="38.6026"
                        r="1.39737"
                        transform="rotate(-90 25.9911 38.6026)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="25.9911"
                        cy="1.99122"
                        r="1.39737"
                        transform="rotate(-90 25.9911 1.99122)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="38.288"
                        cy="38.6026"
                        r="1.39737"
                        transform="rotate(-90 38.288 38.6026)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="38.288"
                        cy="1.99122"
                        r="1.39737"
                        transform="rotate(-90 38.288 1.99122)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.39737"
                        cy="26.3057"
                        r="1.39737"
                        transform="rotate(-90 1.39737 26.3057)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="13.6943"
                        cy="26.3057"
                        r="1.39737"
                        transform="rotate(-90 13.6943 26.3057)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="25.9911"
                        cy="26.3057"
                        r="1.39737"
                        transform="rotate(-90 25.9911 26.3057)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="38.288"
                        cy="26.3057"
                        r="1.39737"
                        transform="rotate(-90 38.288 26.3057)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="1.39737"
                        cy="14.0086"
                        r="1.39737"
                        transform="rotate(-90 1.39737 14.0086)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="13.6943"
                        cy="14.0086"
                        r="1.39737"
                        transform="rotate(-90 13.6943 14.0086)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="25.9911"
                        cy="14.0086"
                        r="1.39737"
                        transform="rotate(-90 25.9911 14.0086)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="38.288"
                        cy="14.0086"
                        r="1.39737"
                        transform="rotate(-90 38.288 14.0086)"
                        fill="#3056D3"
                      />
                    </svg>
                  </span>
                  <span className="absolute bottom-1 left-1">
                    <svg
                      width="29"
                      height="40"
                      viewBox="0 0 29 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="2.288"
                        cy="25.9912"
                        r="1.39737"
                        transform="rotate(-90 2.288 25.9912)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="14.5849"
                        cy="25.9911"
                        r="1.39737"
                        transform="rotate(-90 14.5849 25.9911)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="26.7216"
                        cy="25.9911"
                        r="1.39737"
                        transform="rotate(-90 26.7216 25.9911)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="2.288"
                        cy="13.6944"
                        r="1.39737"
                        transform="rotate(-90 2.288 13.6944)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="14.5849"
                        cy="13.6943"
                        r="1.39737"
                        transform="rotate(-90 14.5849 13.6943)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="26.7216"
                        cy="13.6943"
                        r="1.39737"
                        transform="rotate(-90 26.7216 13.6943)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="2.288"
                        cy="38.0087"
                        r="1.39737"
                        transform="rotate(-90 2.288 38.0087)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="2.288"
                        cy="1.39739"
                        r="1.39737"
                        transform="rotate(-90 2.288 1.39739)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="14.5849"
                        cy="38.0089"
                        r="1.39737"
                        transform="rotate(-90 14.5849 38.0089)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="26.7216"
                        cy="38.0089"
                        r="1.39737"
                        transform="rotate(-90 26.7216 38.0089)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="14.5849"
                        cy="1.39761"
                        r="1.39737"
                        transform="rotate(-90 14.5849 1.39761)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="26.7216"
                        cy="1.39761"
                        r="1.39737"
                        transform="rotate(-90 26.7216 1.39761)"
                        fill="#3056D3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterComponent />
    </>
  );
}

export default OrderPage;
