import React from 'react'

function PricingComponent() {
  return (
    <>
      <section
        id="pricing"
        className="relative z-20 overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]"
      >
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                <span className="mb-2 block text-lg font-semibold text-primary">
                  Pricing Table
                </span>
                <h2 className="mb-3 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Awesome Pricing Plan
                </h2>
                <p className="text-base text-body-color dark:text-dark-6">
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>
          <div className="-mx-4 mb-[60px] flex flex-wrap justify-center">
            <div className="relative flex w-full items-center justify-center rounded-md shadow-pricing">
              <table className="w-full overflow-hidden text-center text-sm">
                <thead className="">
                  <tr>
                    <th className="py-3">
                      <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                        Product name
                      </span>
                    </th>
                    <th className="py-3">
                      <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                        Color
                      </span>
                    </th>
                    <th className="py-3">
                      <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                        Category
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-base text-dark dark:text-white">
                  <tr className="text-center hover:table-row hover:scale-105 dark:hover:table-row">
                    <td className="py3 whitespace-nowrap px-6 font-medium">
                      <span className="inline-block">Macbook pro</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block">Silver</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block">Laptop</span>
                    </td>
                  </tr>
                  <tr className="text-center hover:table-row hover:scale-105 dark:hover:table-row">
                    <td className="py3 whitespace-nowrap px-6 font-medium">
                      <span className="inline-block">Macbook pro</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block">Silver</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block">Laptop</span>
                    </td>
                  </tr>
                  <tr className="text-center hover:table-row hover:scale-105 dark:hover:table-row">
                    <td className="py3 whitespace-nowrap px-6 font-medium">
                      <span className="inline-block">Macbook pro</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block">Silver</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block">Laptop</span>
                    </td>
                  </tr>
                  <tr className="text-center hover:table-row hover:scale-105 dark:hover:table-row">
                    <td className="py3 whitespace-nowrap px-6 font-medium">
                      <span className="inline-block">Macbook pro</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block">Silver</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block">Laptop</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="h-full w-full px-4 lg:w-1/2">
              <div className="mb-4 flex w-full items-center justify-center rounded-md shadow-pricing">
                <table className="w-full overflow-hidden text-center text-sm">
                  <thead className="">
                    <tr>
                      <th className="py-3">
                        <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                          Product name
                        </span>
                      </th>
                      <th className="py-3">
                        <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                          Color
                        </span>
                      </th>
                      <th className="py-3">
                        <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                          Category
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-base text-dark dark:text-white">
                    <tr className="text-center hover:table-row hover:scale-105 dark:hover:table-row">
                      <td className="whitespace-nowrap px-6 py-3 font-medium">
                        <span className="inline-block">Macbook pro</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-block">Silver</span>
                      </td>
                      <td className="px-8 py-3">
                        <input
                          className="rounded-sm border border-dark text-center focus:border-dark dark:bg-dark"
                          type="number"
                          min="1"
                          step="1"
                        />
                      </td>
                    </tr>
                    <tr className="text-center hover:table-row hover:scale-105 dark:hover:table-row">
                      <td className="py3 whitespace-nowrap px-6 font-medium">
                        <span className="inline-block">Macbook pro</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-block">Silver</span>
                      </td>
                      <td className="px-8 py-3">
                        <input
                          className="rounded-sm border border-dark text-center focus:border-dark dark:bg-dark"
                          type="number"
                          min="1"
                          step="1"
                        />
                      </td>
                    </tr>
                    <tr className="text-center hover:table-row hover:scale-105 dark:hover:table-row">
                      <td className="py3 whitespace-nowrap px-6 font-medium">
                        <span className="inline-block">Macbook pro</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-block">Silver</span>
                      </td>
                      <td className="px-8 py-3">
                        <input
                          className="rounded-sm border border-dark text-center focus:border-dark dark:bg-dark"
                          type="number"
                          min="1"
                          step="1"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <a
                  href="javascript:void(0)"
                  className="primaryButton rounded-y inline-flex items-center justify-center px-7 py-3 text-center text-base font-medium transition duration-300"
                >
                  Know More
                </a>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="-mx-2 flex flex-wrap sm:-mx-4 lg:-mx-2 xl:-mx-4">
                <div className="z-10 mb-10 flex w-full flex-col items-center overflow-hidden rounded-xl bg-white px-6 py-6 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14">
                  <img
                    className="h-10 w-10"
                    src="./assets/images/pricing/box.svg"
                    alt=""
                  />
                  <span className="mb-5 block text-xl font-medium text-dark dark:text-white">
                    Number of boxes you need
                  </span>
                  <h2 className="text-xl font-semibold text-primary md:text-3xl xl:text-[42px] xl:leading-[1.21]">
                    <span className="-ml-1 -tracking-[2px]">
                      0 large boxes , 0 medium boxes, 12 extra large boxes and 0
                      special large boxes
                    </span>
                  </h2>
                </div>
                <div className="z-10 mb-10 flex w-full flex-col items-center overflow-hidden rounded-xl bg-white px-6 py-6 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14">
                  <img
                    className="h-10 w-10"
                    src="./assets/images/pricing/airplane.svg"
                    alt=""
                  />
                  <span className="mb-5 block text-xl font-medium text-dark dark:text-white">
                    Total shipping cost
                  </span>
                  <h2 className="text-xl font-semibold text-primary md:text-3xl xl:text-[42px] xl:leading-[1.21]">
                    <span className="-ml-1 -tracking-[2px]">$3,720.00</span>
                  </h2>
                </div>
                <div className="z-10 mb-10 flex w-full flex-col items-center overflow-hidden rounded-xl bg-white px-6 py-6 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14">
                  <img
                    className="h-10 w-10"
                    src="./assets/images/pricing/koi.svg"
                    alt=""
                  />
                  <span className="mb-5 block text-xl font-medium text-dark dark:text-white">
                    You can purchase this many more koi, of each size, to fit in
                    the same size box shown above.
                  </span>
                  <div className="flex w-full flex-col items-start justify-start text-start">
                    <h2 className="mb-2 text-xl font-semibold text-primary md:text-3xl xl:text-[42px] xl:leading-[1.21]">
                      <p className="-ml-1 -tracking-[2px]">
                        0
                        <span className="text-xl font-medium text-dark dark:text-white md:text-3xl">
                          of 19 CM (7.86 Inch) or,
                        </span>
                      </p>
                    </h2>
                    <h2 className="mb-2 text-xl font-semibold text-primary md:text-3xl xl:text-[42px] xl:leading-[1.21]">
                      <p className="-ml-1 -tracking-[2px]">
                        0
                        <span className="text-xl font-medium text-dark dark:text-white md:text-3xl">
                          of 20-25 CM (7.87 - 9.84 Inch) or,
                        </span>
                      </p>
                    </h2>
                    <h2 className="mb-2 text-xl font-semibold text-primary md:text-3xl xl:text-[42px] xl:leading-[1.21]">
                      <p className="-ml-1 -tracking-[2px]">
                        0
                        <span className="text-xl font-medium text-dark dark:text-white md:text-3xl">
                          25.5 - 30 CM (9.85 - 11.81 Inch) or,
                        </span>
                      </p>
                    </h2>
                    <h2 className="mb-2 text-xl font-semibold text-primary md:text-3xl xl:text-[42px] xl:leading-[1.21]">
                      <p className="-ml-1 -tracking-[2px]">
                        0
                        <span className="text-xl font-medium text-dark dark:text-white md:text-3xl">
                          of 30.5 - 40 CM (11.82 - 15.75 Inch) or,
                        </span>
                      </p>
                    </h2>
                    <h2 className="mb-2 text-xl font-semibold text-primary md:text-3xl xl:text-[42px] xl:leading-[1.21]">
                      <p className="-ml-1 -tracking-[2px]">
                        0
                        <span className="text-xl font-medium text-dark dark:text-white md:text-3xl">
                          of 40.5 - 44 CM (15.76 - 17.32 Inch)
                        </span>
                      </p>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PricingComponent
