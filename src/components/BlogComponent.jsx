import { Button, Form, Image, Input, Modal, Popconfirm, Upload } from "antd";
import { PlusOutlined, DeleteOutlined, EditTwoTone } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
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
    const response = await api.get("free-access/allBlog?page=1&size=1000000000");
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
      blog.img = url;
    }
    try {
      setSubmitting(true);
      //const response = await axios.post(api, blog);
      if (blog.blogId) {
        const response = await api.put(`customer/blog/${blog.id}`, blog);
      } else {
        const response = await api.post("customer/blog", blog);
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
      const response = await api.delete(`customer/${id}`);
      toast.success("Deleted successfully");
      fetchPosts();
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  return (
    <>
      <section
        id="blog"
        className="bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]"
      >
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
                  There are many variations of experiences and feedbacks of customers who use our delivery service
                </p>
              </div>
            </div>
          </div>
          <div className="-mx-4 flex flex-wrap">
            <div className="mb-4 flex w-full items-center justify-end px-4">
              <Button
                style={{
                  color: "#fff",
                  border: "none",
                  padding: "1.25rem 1.75rem",
                  fontSize: "1rem",
                  lineHeight: "1.5rem",
                  transitionDuration: "300ms",
                  fontWeight: "500",
                  transitionProperty:
                    "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(234, 88, 12, 1)"; // Hover background color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(249, 115, 22, 1)"; // Revert to original background color
                }}
                className="primaryButton"
                onClick={handleOpenModal}
              >
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
            
            {posts.map((post) => (
              <div key={post.blogId} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="wow fadeInUp group mb-10" data-wow-delay=".1s">
                  <div className="mb-8 overflow-hidden rounded-[5px]" >
                    <a href="javascript:void(0)" className="block">
                      <img
                        src={
                          post.img
                        } // Nếu không có ảnh, dùng ảnh mặc định
                        alt={post.post}
                        className="w-full transition group-hover:rotate-6 group-hover:scale-125 w-[370px] h-[220px]"
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
