import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { Button, Form, Input, Steps } from "antd";
import { Link } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  HomeOutlined,
  LoadingOutlined,
  TruckOutlined,
} from "@ant-design/icons";

function OrderSearchPage() {
  const [form] = useForm();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Step } = Steps;

  const handleSearch = async (value) => {
    setLoading(true);
    console.log(value);
    try {
      const response = await api.get(
        `/free-access/trackingOrder?trackingOrder=${value.trackingOrder}`,
      );
      setOrder(response.data);
    } catch (err) {
      console.log("Failed to fetch order", err);
    } finally {
      setLoading(false);
    }
  };

  const renderSteps = (progresses) => {
    return progresses.map((progress) => {
      let icon;
      let image;
      let color = "rgb(107 114 128)"; // Default gray color
      let title = progress.progressStatus;

      if (progress.inProgress) {
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
        case "CANCEL":
          icon = <CloseCircleOutlined style={{ color: "rgb(239 68 68)" }} />;
          break;
        default:
          icon = <ClockCircleOutlined style={{ color }} />;
      }

      // Dynamically load image if it exists in progress data
      image = progress.image ? (
        <img src={progress.image} alt={title} className="mt-2 h-1/5 w-1/4" />
      ) : null;

      return (
        <Step
          key={progress.id}
          title={<span className="dark:text-white">{title}</span>}
          description={
            <div>
              {progress.healthFishStatus !== null && (
              <span className="dark:text-white">
                Fish status: {progress.healthFishStatus || "Unknown"}
              </span>
              )}
              {image}
            </div>
          }
          icon={icon}
        />
      );
    });
  };

  const Order = ({ order }) => {
    const currentStepIndex = order.length - 1;
    return (
      <>
        {order && order.length > 0 && (
          <div className="order my-8">
            <div className="-mx-4 flex flex-wrap rounded-xl p-6 shadow-pricing">
              <div className="mx-auto w-full px-4 md:px-5 lg:px-5">
                <div className="inline-flex w-full flex-col items-start justify-start gap-4">
                  <div className="inline-flex w-full items-start justify-end gap-4">
                    <div className="inline-flex w-full flex-col items-start justify-start gap-4">
                      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-xl bg-white dark:bg-dark md:items-start md:justify-start">
                        <h2 className="font-manrope w-full border-b border-gray-200 pb-5 text-center text-2xl font-semibold leading-9 text-dark dark:text-white md:text-start">
                          Order Tracking
                        </h2>
                        <div className="w-full flex-col items-center justify-center md:flex-row">
                          <Steps
                            direction="vertical"
                            current={
                              currentStepIndex >= 0 ? currentStepIndex : 0
                            }
                          >
                            {renderSteps(order)}
                          </Steps>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  Order Search Page
                </h1>
                <div className="flex w-full justify-center py-2">
                  <Form
                    title="Search"
                    className="flex w-full justify-center"
                    onFinish={handleSearch}
                    form={form}
                  >
                    <Form.Item
                      name="trackingOrder"
                      rules={[
                        {
                          required: true,
                          message: "Please input tracking order code",
                        },
                      ]}
                      style={{ textAlign: "left", width: "50%" }}
                    >
                      <Input
                        placeholder="Search order"
                        className="w-full rounded-l-md border border-stroke bg-transparent px-5 py-2 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                        style={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        onClick={() => form.submit()}
                        className="primaryButton rounded-r-md"
                        loading={loading}
                        style={{
                          marginLeft: "0",
                          color: "#fff",
                          border: "none",
                          padding: "1.3rem 1.75rem",
                          fontSize: "1rem",
                          lineHeight: "1.5rem",
                          transitionDuration: "300ms",
                          fontWeight: "500",
                          transitionProperty:
                            "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
                          transitionTimingFunction:
                            "cubic-bezier(0.4, 0, 0.2, 1)",
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
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
                    </Form.Item>
                  </Form>
                </div>
                <ul className="flex items-center justify-center gap-[10px]">
                  <Link to="/">
                    <a className="flex items-center gap-[10px] text-base font-medium text-dark dark:text-white">
                      Home Page
                    </a>
                  </Link>
                  <li>
                    <Link
                      to="/order-search"
                      className="flex items-center gap-[10px] text-base font-medium text-body-color"
                    >
                      <span className="text-body-color dark:text-dark-6">
                        {" "}
                        /{" "}
                      </span>
                      Order Search Page
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
                  <Order order={order} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default OrderSearchPage;
