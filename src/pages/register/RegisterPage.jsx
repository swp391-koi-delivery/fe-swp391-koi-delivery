import React, { useState } from "react";
import { Form, Input, Image, Upload, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/file";
import { useForm } from "antd/es/form/Form";

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleRegister = async (values) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      console.log(file);
      const url = await uploadFile(file.originFileObj);
      values.image = url;
    }
    try {
      setLoading(true);
      const response = await api.post("/authentication/register", values);
      toast.success("Successfully register a new account");
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data || "Failed to register a new account");
    } finally {
      setLoading(false);
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <>
      <div className="relative z-10 overflow-hidden pb-[60px] pt-[120px] dark:bg-dark md:pt-[130px] lg:pt-[160px]">
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3"></div>
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Register Page
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
                      to="/register"
                      href="javascript:void(0)"
                      className="flex items-center gap-[10px] text-base font-medium text-body-color"
                    >
                      <span className="text-body-color dark:text-dark-6">
                        {" "}
                        /{" "}
                      </span>
                      Register
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
                    className="mx-auto flex max-w-[160px] justify-center"
                  >
                    <img
                      src="assets/images/logo/logo-v2.svg"
                      alt="logo"
                      className="header-logo h-2/5 w-2/5 rounded-full"
                    />
                  </a>
                </div>
                <Form
                  onFinish={handleRegister}
                  title="Register"
                  form={form}
                  layout="vertical"
                >
                  <Form.Item
                    label={<span className="dark:text-white">Username</span>}
                    name="username"
                    className="mb-4"
                    rules={[
                      {
                        required: true,
                        message: "Please input username",
                      },
                      {
                        min: 6,
                        message: "Username must be at least 6 characters!",
                      },
                    ]}
                    style={{ textAlign: "left" }}
                  >
                    <Input
                      required
                      placeholder="Username"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                    />
                  </Form.Item>
                  <Form.Item
                    label={<span className="dark:text-white">Password</span>}
                    name="password"
                    className="mb-4"
                    rules={[
                      {
                        required: true,
                        message: "Please input password",
                      },
                      {
                        pattern: /.*[A-Z].*/,
                        message:
                          "Password must contain at least one uppercase letter!",
                      },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters!",
                      },
                    ]}
                    style={{ textAlign: "left" }}
                  >
                    <Input.Password
                      required
                      placeholder="Password"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                    />
                  </Form.Item>
                  <Form.Item
                    label={<span className="dark:text-white">Fullname</span>}
                    name="fullname"
                    className="mb-4"
                    rules={[
                      {
                        required: true,
                        message: "Please input full name",
                      },
                      {
                        min: 1,
                        message: "Password must be at least 1 characters!",
                      },
                    ]}
                    style={{ textAlign: "left" }}
                  >
                    <Input
                      required
                      placeholder="Fullname"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                    />
                  </Form.Item>
                  <Form.Item
                    label={<span className="dark:text-white">Address</span>}
                    name="address"
                    className="mb-4"
                    rules={[
                      {
                        required: true,
                        message: "Please input address!",
                      },
                    ]}
                    style={{ textAlign: "left" }}
                  >
                    <Input
                      required
                      placeholder="Address"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                    />
                  </Form.Item>
                  <Form.Item
                    label={<span className="dark:text-white">Phone</span>}
                    name="phone"
                    className="mb-4"
                    rules={[
                      {
                        required: true,
                        message: "Please input phone number!",
                      },
                      {
                        pattern: /(84|0[3|5|7|8|9])(\d{8})/,
                        message:
                          "Phone number must start with 84 or a valid Vietnamese mobile prefix (03, 05, 07, 08, 09) followed by 8 digits.",
                      },
                    ]}
                    style={{ textAlign: "left" }}
                  >
                    <Input
                      required
                      placeholder="Phone"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                    />
                  </Form.Item>
                  <Form.Item
                    label={<span className="dark:text-white">Email</span>}
                    name="email"
                    className="mb-4"
                    rules={[
                      {
                        required: true,
                        message: "Please input email!",
                      },
                    ]}
                    style={{ textAlign: "left" }}
                  >
                    <Input
                      required
                      placeholder="Email"
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-dark-6 dark:focus:border-primary"
                    />
                  </Form.Item>
                  <Form.Item
                    label={<span className="dark:text-white">Image</span>}
                    name="image"
                    className="mb-4"
                  >
                    <Upload
                      className="dark:text-white"
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                  <div className="mb-4">
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
                          "rgba(234, 88, 12, 1)"; // Hover background color
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(249, 115, 22, 1)"; // Revert to original background color
                      }}
                    >
                      Register
                    </Button>
                  </div>
                  {previewImage && (
                    <Image
                      wrapperStyle={{
                        display: "none",
                      }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
                </Form>
                <span className="z-1 relative mb-7 block text-center">
                  <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-stroke dark:bg-dark-3"></span>
                  <span className="relative z-10 inline-block bg-white px-3 text-base text-body-secondary dark:bg-dark-2">
                    Connect With
                  </span>
                </span>
                <ul className="-mx-2 mb-9 flex justify-between">
                  <li className="w-full px-2">
                    <a
                      href="javascript:void(0)"
                      className="flex h-11 items-center justify-center rounded-md bg-[#4064AC] transition hover:bg-opacity-90"
                    >
                      <svg
                        width="10"
                        height="20"
                        viewBox="0 0 10 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.29878 8H7.74898H7.19548V7.35484V5.35484V4.70968H7.74898H8.91133C9.21575 4.70968 9.46483 4.45161 9.46483 4.06452V0.645161C9.46483 0.290323 9.24343 0 8.91133 0H6.89106C4.70474 0 3.18262 1.80645 3.18262 4.48387V7.29032V7.93548H2.62912H0.747223C0.359774 7.93548 0 8.29032 0 8.80645V11.129C0 11.5806 0.304424 12 0.747223 12H2.57377H3.12727V12.6452V19.129C3.12727 19.5806 3.43169 20 3.87449 20H6.47593C6.64198 20 6.78036 19.9032 6.89106 19.7742C7.00176 19.6452 7.08478 19.4194 7.08478 19.2258V12.6774V12.0323H7.66596H8.91133C9.2711 12.0323 9.54785 11.7742 9.6032 11.3871V11.3548V11.3226L9.99065 9.09677C10.0183 8.87097 9.99065 8.6129 9.8246 8.35484C9.76925 8.19355 9.52018 8.03226 9.29878 8Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  </li>
                  <li className="w-full px-2">
                    <a
                      href="javascript:void(0)"
                      className="flex h-11 items-center justify-center rounded-md bg-[#1C9CEA] transition hover:bg-opacity-90"
                    >
                      <svg
                        width="22"
                        height="16"
                        viewBox="0 0 22 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.5516 2.75538L20.9 1.25245C21.2903 0.845401 21.3968 0.53229 21.4323 0.375734C20.3677 0.939335 19.3742 1.1272 18.7355 1.1272H18.4871L18.3452 1.00196C17.4935 0.344423 16.429 0 15.2935 0C12.8097 0 10.8581 1.81605 10.8581 3.91389C10.8581 4.03914 10.8581 4.22701 10.8935 4.35225L11 4.97847L10.2548 4.94716C5.7129 4.82192 1.9871 1.37769 1.38387 0.782779C0.390323 2.34834 0.958064 3.85127 1.56129 4.79061L2.76774 6.54403L0.851613 5.6047C0.887097 6.91977 1.45484 7.95303 2.55484 8.7045L3.5129 9.33072L2.55484 9.67515C3.15806 11.272 4.50645 11.9296 5.5 12.18L6.8129 12.4932L5.57097 13.2446C3.58387 14.4971 1.1 14.4031 0 14.3092C2.23548 15.6869 4.89677 16 6.74194 16C8.12581 16 9.15484 15.8748 9.40322 15.7808C19.3387 13.7143 19.8 5.8865 19.8 4.32094V4.10176L20.0129 3.97652C21.2194 2.97456 21.7161 2.44227 22 2.12916C21.8935 2.16047 21.7516 2.22309 21.6097 2.2544L19.5516 2.75538Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  </li>
                  <li className="w-full px-2">
                    <a
                      href="javascript:void(0)"
                      className="flex h-11 items-center justify-center rounded-md bg-[#D64937] transition hover:bg-opacity-90"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.8477 8.17132H9.29628V10.643H15.4342C15.1065 14.0743 12.2461 15.5574 9.47506 15.5574C5.95916 15.5574 2.8306 12.8821 2.8306 9.01461C2.8306 5.29251 5.81018 2.47185 9.47506 2.47185C12.2759 2.47185 13.9742 4.24567 13.9742 4.24567L15.7024 2.47185C15.7024 2.47185 13.3783 0.000145544 9.35587 0.000145544C4.05223 -0.0289334 0 4.30383 0 8.98553C0 13.5218 3.81386 18 9.44526 18C14.4212 18 17.9967 14.7141 17.9967 9.79974C18.0264 8.78198 17.8477 8.17132 17.8477 8.17132Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
                <p className="mb-4 text-base text-body-secondary">
                  By creating an account you are agree with our{" "}
                  <a
                    href="javascript:void(0)"
                    className="text-primary hover:underline"
                  >
                    Privacy
                  </a>{" "}
                  and{" "}
                  <a
                    href="javascript:void(0)"
                    className="text-primary hover:underline"
                  >
                    Policy
                  </a>
                </p>
                <p className="text-base text-body-secondary">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    {" "}
                    Login
                  </Link>
                </p>
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
    </>
  );
}

export default RegisterPage;
