import React, { useEffect } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import BannerComponent from "../../components/BannerComponent";
import ContentComponent from "../../components/ContentComponent";
import PricingComponent from "../../components/PricingComponent";
import FooterComponent from "../../components/FooterComponent";
import BlogComponent from "../../components/BlogComponent";
import MapComponent from "../../components/MapComponent";

function HomePage() {
  return (
    <>
      <HeaderComponent />
      <BannerComponent />
      <MapComponent/>
      <ContentComponent />
      <PricingComponent />
      <BlogComponent />
      <FooterComponent />
    </>
  );
}

export default HomePage;
