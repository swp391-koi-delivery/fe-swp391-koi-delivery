import { Button, Result } from "antd";
import React, { useEffect } from "react";
import useGetParams from "../../hooks/useGetParams";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
function SuccessPage() {
  const navigate = useNavigate();
  const params = useGetParams();
  const orderID = params("orderID");
  const vnp_TransactionStatus = params("vnp_TransactionStatus");
  console.log("OrderID:", orderID);
  console.log("Status: ", vnp_TransactionStatus);

  const postOrderID = async () => {
    try {
      const response = await api.post(
        `/customer/transaction?orderId=${orderID}`,
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (vnp_TransactionStatus === "00") {
      postOrderID();
    } else {
      navigate("/error");
    }
  }, []);

  return (
    <>
      <Result
        className="flex flex-col items-center justify-center"
        status="success"
        title="Payment Successfully!"
        subTitle="Your order payment takes 1-5 minutes, please wait."
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={() => {
              navigate("/order-list");
            }}
          >
            Back To Order List
          </Button>,
        ]}
      />
    </>
  );
}

export default SuccessPage;
