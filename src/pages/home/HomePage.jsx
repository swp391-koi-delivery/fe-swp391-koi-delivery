import React, { useEffect } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import BannerComponent from "../../components/BannerComponent";
import ContentComponent from "../../components/ContentComponent";
import PricingComponent from "../../components/PricingComponent";
import FooterComponent from "../../components/FooterComponent";
import BlogComponent from "../../components/BlogComponent";
import useRealTime from "../../hooks/useRealTime";
import { toast } from "react-toastify";
function HomePage() {
  let lastMessage = null;
  useRealTime((body) => {
    if (body.body !== lastMessage) {
      lastMessage = body.body;
      if (body.body === "SALE UPDATE ORDER") {
        toast.success("YOUR ORDER IS ACCEPTED, AWAITING PAYMENT ");
      } else if (body.body === "DELIVERY UPDATE ORDER SUCCESS") {
        toast.success(`YOUR ORDER IS IN SHIPPING PROGRESS`);
      }
    }
  });

  return (
    <>
      <HeaderComponent />
      <BannerComponent />
      <ContentComponent />
      <PricingComponent />
      <BlogComponent />
      <FooterComponent />
    </>
  );
}

export default HomePage;
