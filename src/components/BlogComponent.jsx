import { Button, Form, Input, Modal, Popconfirm, Upload } from "antd";
import { PlusOutlined, DeleteOutlined, EditTwoTone } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../config/axios";
import { toast } from "react-toastify";
import uploadFile from "../utils/file";

function BlogComponent() {
  const [form] = useForm();
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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

  const fetchPosts = async () => {
    //const response = await axios.get(api);
    //console.log(response.data);
    const response = await api.get("Blog");
    setPosts(response.data);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  const handleSubmitPosts = async (blog) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      //console.log(file);
      const url = await uploadFile(file.originFileObj);
      blog.image = url;
    }
    try {
      setSubmitting(true);
      //const response = await axios.post(api, blog);
      if (blog.blogId) {
        const response = await api.put(`Blog/${blog.blogId}`, blog);
      } else {
        const response = await api.post("Blog", blog);
      }
      toast.success("Sucessfully create a new post");
      setOpenModal(false);
      form.resetFields();
      fetchPosts();
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeletePost = async (id) => {
    try {
      const response = await api.delete(`Blog/${id}`);
      toast.success("Deleted successfully");
      fetchPosts();
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  return (
    <>
      <section className="bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[485px] text-center">
                <span className="mb-2 block text-lg font-semibold text-primary">
                  Our Blogs
                </span>
                <h2 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Our Recent News
                </h2>
                <p className="text-base text-body-color dark:text-dark-6">
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>
          <div className="-mx-4 flex flex-wrap">
            <div className="mb-4 flex w-full items-center justify-end px-4">
              <Button className="primaryButton" onClick={handleOpenModal}>
                Add Blog
              </Button>
              <Modal
                confirmLoading={submitting}
                onOk={() => form.submit()}
                title="Add Blog"
                open={openModal}
                onCancel={handleCloseModal}
              >
                <Form onFinish={handleSubmitPosts} form={form}>
                  <Form.Item
                    label="Blog post"
                    name="post"
                    rules={[
                      {
                        required: true,
                        message: "Please input blog's post!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="image" name="image">
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="wow fadeInUp group mb-10" data-wow-delay=".1s">
                <div className="mb-8 overflow-hidden rounded-[5px]">
                  <a href="blog-details.html" className="block">
                    <img
                      src="./assets/images/blog/blog-01.jpg"
                      alt="image"
                      className="w-full transition group-hover:rotate-6 group-hover:scale-125"
                    />
                  </a>
                </div>
                <div>
                  <span className="mb-6 inline-block rounded-[5px] bg-primary px-4 py-0.5 text-center text-xs font-medium leading-loose text-white">
                    Dec 22, 2023
                  </span>
                  <h3>
                    <a
                      href="javascript:void(0)"
                      className="mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                    >
                      Meet AutoManage, the best AI management tools
                    </a>
                  </h3>
                  <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="wow fadeInUp group mb-10" data-wow-delay=".15s">
                <div className="mb-8 overflow-hidden rounded-[5px]">
                  <a href="blog-details.html" className="block">
                    <img
                      src="./assets/images/blog/blog-02.jpg"
                      alt="image"
                      className="w-full transition group-hover:rotate-6 group-hover:scale-125"
                    />
                  </a>
                </div>
                <div>
                  <span className="mb-6 inline-block rounded-[5px] bg-primary px-4 py-0.5 text-center text-xs font-medium leading-loose text-white">
                    Mar 15, 2023
                  </span>
                  <h3>
                    <a
                      href="javascript:void(0)"
                      className="mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                    >
                      How to earn more money as a wellness coach
                    </a>
                  </h3>
                  <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="wow fadeInUp group mb-10" data-wow-delay=".2s">
                <div className="mb-8 overflow-hidden rounded-[5px]">
                  <a href="blog-details.html" className="block">
                    <img
                      src="./assets/images/blog/blog-03.jpg"
                      alt="image"
                      className="w-full transition group-hover:rotate-6 group-hover:scale-125"
                    />
                  </a>
                </div>
                <div>
                  <span className="mb-6 inline-block rounded-[5px] bg-primary px-4 py-0.5 text-center text-xs font-medium leading-loose text-white">
                    Jan 05, 2023
                  </span>
                  <h3>
                    <a
                      href="javascript:void(0)"
                      className="mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                    >
                      The no-fuss guide to upselling and cross selling
                    </a>
                  </h3>
                  <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                </div>
              </div>
            </div>
            {posts.map((post) => (
              <div key={post.blogId} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="wow fadeInUp group mb-10" data-wow-delay=".1s">
                  <div className="mb-8 overflow-hidden rounded-[5px]">
                    <a href="javascript:void(0)" className="block">
                      <img
                        src={
                          post.image || "./assets/images/blog/default-image.jpg"
                        } // Nếu không có ảnh, dùng ảnh mặc định
                        alt={post.post}
                        className="w-full transition group-hover:rotate-6 group-hover:scale-125"
                      />
                    </a>
                  </div>
                  <div>
                    <span className="mb-6 inline-block rounded-[5px] bg-primary px-4 py-0.5 text-center text-xs font-medium leading-loose text-white">
                      Jan 05, 2023 {/* Hiển thị ngày nếu có */}
                    </span>
                    <h3>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                      >
                        {post.post} {/* Hiển thị tiêu đề blog */}
                      </a>
                    </h3>
                    <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. {/* Nội dung blog */}
                    </p>
                    <Button
                      icon={<EditTwoTone />}
                      onClick={() => setOpenModal(true)}
                    />
                    <Popconfirm
                      title="Delete"
                      description="Are you sure want to delete?"
                      onConfirm={() => handleDeletePost(post.id)}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        danger /* Thêm nút xóa */
                      />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}

export default BlogComponent;
