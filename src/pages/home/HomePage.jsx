import React, { useEffect } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import BannerComponent from "../../components/BannerComponent";
import ContentComponent from "../../components/ContentComponent";
import PricingComponent from "../../components/PricingComponent";
import FooterComponent from "../../components/FooterComponent";
import BlogComponent from "../../components/BlogComponent";
function HomePage() {
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
