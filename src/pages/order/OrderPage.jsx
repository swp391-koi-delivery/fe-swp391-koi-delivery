import React from "react";
import AuthenTemplate from "../../components/authen-template/AuthenTemplate";
import api from "../../config/axios";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
function OrderPage() {
  const [form] = useForm();

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
                  <Form title="Order" form={form}>
                    <Form.Item name="username" className="mb-[22px]">
                      <Input
                        placeholder="Username"
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
