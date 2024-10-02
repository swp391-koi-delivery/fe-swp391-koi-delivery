import React, { useEffect } from "react";

function BannerComponent() {
  return (
    <>
      <div
        id="home"
        className="bg-image relative overflow-hidden pt-[120px] md:h-[640px] md:pt-[130px] lg:pt-[160px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div
                className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center"
                data-wow-delay=".2s"
              >
                <h1 className="mb-6 text-3xl font-bold leading-snug text-white sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                  Transporting Koi Fish Internationally And Domestically
                </h1>
                <p className="mx-auto mb-9 max-w-[600px] text-base font-medium text-white sm:text-lg sm:leading-[1.44]">
                  Offer Customer A Variety Of Delivery and Package Methods, And
                  Prices
                </p>
                <ul className="mb-10 flex flex-wrap items-center justify-center gap-5">
                  <li>
                    <a
                      href="https://links.tailgrids.com/play-download"
                      className="inline-flex items-center justify-center rounded-md bg-white px-7 py-[14px] text-center text-base font-medium text-dark shadow-1 transition duration-300 ease-in-out hover:bg-gray-2 hover:text-body-color"
                    >
                      Explore Now
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/tailgrids/play-tailwind"
                      target="_blank"
                      className="flex items-center gap-4 rounded-md bg-white/[0.12] px-6 py-[14px] text-base font-medium text-white transition duration-300 ease-in-out hover:bg-white hover:text-dark"
                    >
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M19.03 3C15.36 3 12.29 6.27 11.68 9.27C7.33 10.57 4 14.49 4 19C4 19.55 4.45 20 5 20H6.64C8.03 20 9.35 20.44 10.44 21.27C11.29 21.92 12.37 22.5 13.68 22.5C14.41 22.5 15.09 22.26 15.65 21.87C16.7 21.23 17.68 20.39 18.56 19.27C21.09 15.85 22 10.67 22 10C22 7.65 20.23 5 19.03 3ZM13.5 13C12.67 13 12 12.33 12 11.5C12 10.67 12.67 10 13.5 10C14.33 10 15 10.67 15 11.5C15 12.33 14.33 13 13.5 13Z" />
                      </svg>
                      Order now
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerComponent;
