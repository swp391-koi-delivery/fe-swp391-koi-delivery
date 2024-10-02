import React, { useState } from "react";
import AuthenTemplate from "../../components/AuthenTemplate/AuthenTemplate";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { Button, Form, Input, Modal, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
function FeedbackPage() {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const fetchData = async (values) => {
    try {
      const response = await api.get("feedback");
      setDatas(response.data);
    } catch (err) {
      toast.error(err.response.data);
    }
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
                    Login Page
                  </h1>
                  <p className="mb-5 text-base text-body-color dark:text-dark-6">
                    There are many variations of passages of Lorem Ipsum
                    available.
                  </p>

                  <ul className="flex items-center justify-center gap-[10px]">
                    <li>
                      <a
                        href="index.html"
                        className="flex items-center gap-[10px] text-base font-medium text-dark dark:text-white"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="flex items-center gap-[10px] text-base font-medium text-body-color"
                      >
                        <span className="text-body-color dark:text-dark-6">
                          {" "}
                          /{" "}
                        </span>
                        Login
                      </a>
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
                <Button></Button>
                <Table dataSource={datas} />
                <Modal open={showModal} onClose={() => showModal(false)}>
                  Add feeback
                </Modal>
              </div>
            </div>
          </div>
        </section>
      </AuthenTemplate>
    </>
  );
}

export default FeedbackPage;
