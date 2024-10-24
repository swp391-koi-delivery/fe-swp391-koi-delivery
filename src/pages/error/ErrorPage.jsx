import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  return (
    <>
      <Result
        className="flex flex-col items-center justify-center"
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Button
            type="primary"
            key="console"
            onClick={() => {
              navigate("/order-list");
            }}
          >
            Back To Order List
          </Button>
        }
      />
    </>
  );
}

export default ErrorPage;
