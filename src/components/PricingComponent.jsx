import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../config/axios";

function PricingComponent() {
  const [form] = useForm();
  const [data, setData] = useState({});
  const fishSizes = [
    { sizeCm: "19.9", sizeInch: "7.86" },
    { sizeCm: "20 - 25", sizeInch: "7.87 - 9.84" },
    { sizeCm: "25.1 - 30", sizeInch: "9.85 - 11.81" },
    { sizeCm: "30.1 - 40", sizeInch: "11.82 - 15.75" },
    { sizeCm: "40.1 - 44", sizeInch: "15.76 - 17.32" },
    { sizeCm: "44.1 - 50", sizeInch: "17.33 - 19.6" },
    { sizeCm: "50.1 - 55", sizeInch: "19.7 - 21.6" },
    { sizeCm: "55.1 - 65", sizeInch: "21.7 - 25.5" },
    { sizeCm: "50 - 60", sizeInch: "19.7 - 23.4" },
    { sizeCm: "60.1 - 65", sizeInch: "23.5 - 25.5" },
    { sizeCm: "65.1 - 73", sizeInch: "25.6 - 28.7" },
    { sizeCm: "73.1 - 83", sizeInch: "28.8 - 32.6" },
  ];

  const handleEstimate = async (values) => {
    console.log(values);
    const submissionData = values.items
      .filter((item) => item.quantities) // Filter out rows without quantity input
      .map((item, index) => ({
        fishSizes: parseFloat(fishSizes[index].sizeCm), // Convert fish size to number
        quantities: item.quantities ? item.quantities : 0, // Use the correct field name
      }));
    try {
      const response = await api.get(
        `saleStaff/calculateBoxAndSuggestFishSizes?quantities=${submissionData.map((item) => item.quantities)}&fishSizes=${submissionData.map((item) => item.fishSizes)}`,
      );
      toast.success("Successfully estimate prices and boxes!");
      console.log(response.data);
      setData(response.data);
    } catch (err) {
      toast.error(
        "Failed to calculate the prices and boxes. Please try again.",
      );
      console.error(err);
    }
  };

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
          <div className="-mx-4 flex flex-wrap justify-center">
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
        </div>
      </section>
      <section
        id="estimate"
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
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="h-full w-full px-4 lg:w-1/2">
              <Form
                onFinish={handleEstimate}
                title="Estimate price"
                form={form}
              >
                <div className="mb-4 flex w-full items-center justify-center rounded-md shadow-pricing">
                  <table className="w-full overflow-hidden text-center text-sm">
                    <thead>
                      <tr>
                        <th className="py-3">
                          <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                            Fish Size (cm)
                          </span>
                        </th>
                        <th className="py-3">
                          <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                            Fish Size (inch)
                          </span>
                        </th>
                        <th className="py-3">
                          <span className="block py-4 text-xl font-medium text-dark dark:text-white">
                            Quantity
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-base text-dark dark:text-white">
                      <Form.List name="items">
                        {() => (
                          <>
                            {fishSizes.map((item, index) => (
                              <tr
                                key={index}
                                className="w-full text-center hover:table-row hover:scale-105 dark:hover:table-row"
                              >
                                <td className="whitespace-nowrap px-6 py-3 font-medium">
                                  <span className="inline-block">
                                    {item.sizeCm}
                                  </span>
                                </td>
                                <td className="px-6 py-3">
                                  <span className="inline-block">
                                    {item.sizeInch}
                                  </span>
                                </td>
                                <td className="px-8 py-3">
                                  <Form.Item
                                    initialValue={0}
                                    name={[index, "quantities"]}
                                    rules={[
                                      {
                                        validator: (_, value) => {
                                          if (value >= 0) {
                                            return Promise.resolve();
                                          }
                                          if (value < 1) {
                                            return Promise.reject(
                                              new Error(
                                                "Quantity must be greater than or equal to 1!",
                                              ),
                                            );
                                          }
                                          return Promise.resolve(); // No error if value is valid
                                        },
                                      },
                                    ]}
                                  >
                                    <Input
                                      className="rounded-sm border border-dark text-center focus:border-dark dark:bg-dark dark:text-white"
                                      type="number"
                                      step="1"
                                      min="1"
                                    />
                                  </Form.Item>
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    onClick={() => form.submit()}
                    className="primaryButton rounded-y inline-flex items-center justify-center px-7 py-5 text-center text-base font-medium transition duration-300"
                  >
                    Estimate
                  </Button>
                </div>
              </Form>
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
                      {data?.smallBoxCount} small boxs, {data?.mediumBoxCount}{" "}
                      medium boxes, {data?.largeBoxCount} large boxes
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
                    <span className="-ml-1 -tracking-[2px]">
                      {data?.remainingVolume}
                    </span>
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
                  {data?.suggestions?.map((item) => (
                    <>
                      <div className="flex w-full flex-col items-start justify-start text-start">
                        <h2 className="mb-2 text-xl font-semibold text-primary md:text-3xl xl:text-[42px] xl:leading-[1.21]">
                          <p className="-ml-1 -tracking-[2px]">
                            <span className="text-xl font-medium text-dark dark:text-white md:text-3xl">
                              {item}
                            </span>
                          </p>
                        </h2>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PricingComponent;
