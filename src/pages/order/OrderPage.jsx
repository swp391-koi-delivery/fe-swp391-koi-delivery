import React, { useState } from "react";
import AuthenTemplate from "../../components/authen-template/AuthenTemplate";
import api from "../../config/axios";
import { Button, Form, Input, Radio } from "antd";
import { Link } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
function OrderPage() {
  const [form] = useForm();
 const [value, setValue] = useState("Individual shipment");
 const onChange = (e) => {
   console.log("radio checked", e.target.value);
   setValue(e.target.value);
 };

  return (
    <>
      <AuthenTemplate>
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
                        Home
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
                        Order
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
                  className="wow fadeInUp relative mx-auto max-w-[525px] overflow-hidden rounded-xl bg-white px-8 py-14 text-center shadow-form dark:bg-dark-2 sm:px-12 md:px-[60px]"
                  data-wow-delay=".15s"
                >
                  <div className="mb-10 text-center">
                    <a
                      href="javascript:void(0)"
                      className="mx-auto inline-block max-w-[160px]"
                    >
                      <img
                        src="assets/images/logo/logo.svg"
                        alt="logo"
                        className="dark:hidden"
                      />
                      <img
                        src="assets/images/logo/logo-white.svg"
                        alt="logo"
                        className="hidden dark:block"
                      />
                    </a>
                  </div>
                  <Radio.Group onChange={onChange} value={value} className="mb-[22px]">
                    <Radio value={"Individual shipment"}>
                      Individual shipment
                    </Radio>
                    <Radio value={"Bulk shipment"}>Bulk shipment</Radio>
                  </Radio.Group>
                  {value === "Individual shipment" && (
                    <Form title="Order" form={form}>
                      <Form.Item name="originLocation" className="mb-[22px]">
                        <Input
                          placeholder="Origin Location"
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        name="destinationLocation"
                        className="mb-[22px]"
                      >
                        <Input
                          placeholder="Destination Location"
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item name="fishSize" className="mb-[22px]">
                        <Input
                          placeholder="Fish Size"
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item name="quantity" className="mb-[22px]">
                        <Input
                          placeholder="Quantity"
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item className="mb-[22px]">
                        <Button
                          type="submit"
                          onClick={() => form.submit()}
                          className="primaryButton w-full cursor-pointer rounded-md px-7 py-5 text-base text-white transition duration-300 ease-in-out"
                        >
                          Order
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                  {value === "Bulk shipment" && (
                    <Form title="Order" form={form}>
                      <Form.Item name="originLocation" className="mb-[22px]">
                        <Input
                          placeholder="Origin Location"
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item
                        name="destinationLocation"
                        className="mb-[22px]"
                      >
                        <Input
                          placeholder="Destination Location"
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item name="fishSize" className="mb-[22px]">
                        <Input
                          placeholder="Fish Size"
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item name="quantity" className="mb-[22px]">
                        <Input
                          placeholder="Quantity"
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item className="mb-[22px]">
                        <Button
                          type="submit"
                          onClick={() => form.submit()}
                          className="primaryButton w-full cursor-pointer rounded-md px-7 py-5 text-base text-white transition duration-300 ease-in-out"
                        >
                          Order
                        </Button>
                      </Form.Item>
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
      </AuthenTemplate>
    </>
  );
}

export default OrderPage;
