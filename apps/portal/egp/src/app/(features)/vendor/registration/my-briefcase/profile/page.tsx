import { Box, Button, Center, Flex, Paper, Text } from '@mantine/core';
import { IconCertificate, IconFile, IconUserCircle } from '@tabler/icons-react';
import React from 'react';
const mockupDataCertificate = [];
function Page() {
  return (
    <Box className="p-4 bg-slate-100">
      <Box className=" w-full p-6 min-h-screen bg-white">
        <Flex className="flex flex-col  gap-3 w-full border-b">
          <Flex className="w-full py-2 gap-2">
            <IconUserCircle size={26} stroke={1.8} />

            <Text fw={700} fz="xl">
              Profile Data
            </Text>
          </Flex>
        </Flex>

        <div className="col-span-12 p-4">
          <div className="rounded-sm border border-stroke bg-white py-3 shadow-default ">
            <div className="flex justify-between gap-2.5 py-3 px-6 hover:bg-gray-2 dark:hover:bg-meta-4 sm:items-center sm:justify-start">
              <div className="flex items-center gap-5 justify-center">
                <Center className=" rounded-full p-3 bg-slate-200">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 31 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.27128 2.13334C6.03524 1.36938 7.0714 0.940186 8.1518 0.940186H18.1793C18.5949 0.940186 18.9934 1.10526 19.2872 1.39909L26.8078 8.91973C27.1017 9.21356 27.2668 9.61208 27.2668 10.0276V25.0689C27.2668 26.1493 26.8376 27.1855 26.0736 27.9494C25.3096 28.7134 24.2735 29.1426 23.1931 29.1426H8.1518C7.0714 29.1426 6.03524 28.7134 5.27128 27.9494C4.50731 27.1855 4.07812 26.1493 4.07812 25.0689V5.01386C4.07812 3.93346 4.50731 2.8973 5.27128 2.13334ZM8.1518 4.07378C7.90248 4.07378 7.66337 4.17283 7.48707 4.34913C7.31077 4.52543 7.21172 4.76454 7.21172 5.01386V25.0689C7.21172 25.3182 7.31077 25.5573 7.48707 25.7336C7.66337 25.9099 7.90248 26.009 8.1518 26.009H23.1931C23.4424 26.009 23.6815 25.9099 23.8578 25.7336C24.0341 25.5573 24.1332 25.3182 24.1332 25.0689V10.6766L17.5303 4.07378H8.1518Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.1801 0.940186C19.0454 0.940186 19.7469 1.64167 19.7469 2.50698V8.46082H25.7007C26.566 8.46082 27.2675 9.1623 27.2675 10.0276C27.2675 10.8929 26.566 11.5944 25.7007 11.5944H18.1801C17.3148 11.5944 16.6133 10.8929 16.6133 10.0276V2.50698C16.6133 1.64167 17.3148 0.940186 18.1801 0.940186Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 16.2947C9.0918 15.4294 9.79328 14.7279 10.6586 14.7279H20.6861C21.5514 14.7279 22.2529 15.4294 22.2529 16.2947C22.2529 17.16 21.5514 17.8615 20.6861 17.8615H10.6586C9.79328 17.8615 9.0918 17.16 9.0918 16.2947Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 21.3085C9.0918 20.4432 9.79328 19.7417 10.6586 19.7417H20.6861C21.5514 19.7417 22.2529 20.4432 22.2529 21.3085C22.2529 22.1738 21.5514 22.8753 20.6861 22.8753H10.6586C9.79328 22.8753 9.0918 22.1738 9.0918 21.3085Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 11.281C9.0918 10.4157 9.79328 9.71423 10.6586 9.71423H13.1655C14.0308 9.71423 14.7323 10.4157 14.7323 11.281C14.7323 12.1464 14.0308 12.8478 13.1655 12.8478H10.6586C9.79328 12.8478 9.0918 12.1464 9.0918 11.281Z"
                      fill="#000"
                    ></path>
                  </svg>
                </Center>
                <Text fz={'md'} fw={600} w={200} truncate>
                  Business Registration/Incorporation Certificate
                </Text>
              </div>
              <div className="hidden sm:block sm:w-4/12 xl:w-2/12">
                <p className="font-medium">File size: 455KB</p>
              </div>
              <div className="hidden w-5/12 xl:block">
                <p className="font-medium">Uploaded on: 05 Jan, 2025</p>
              </div>
              <div className="text-right sm:w-3/12 xl:w-2/12 flex gap-3">
                <Button variant="outline" className="inline-flex rounded">
                  Update
                </Button>
                <Button variant="outline" className="inline-flex rounded">
                  View
                </Button>
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white py-3 shadow-default ">
            <div className="flex justify-between gap-2.5 py-3 px-6 hover:bg-gray-2 dark:hover:bg-meta-4 sm:items-center sm:justify-start">
              <div className="flex items-center gap-5 ">
                <Center className=" rounded-full p-3 bg-slate-200">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 31 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.27128 2.13334C6.03524 1.36938 7.0714 0.940186 8.1518 0.940186H18.1793C18.5949 0.940186 18.9934 1.10526 19.2872 1.39909L26.8078 8.91973C27.1017 9.21356 27.2668 9.61208 27.2668 10.0276V25.0689C27.2668 26.1493 26.8376 27.1855 26.0736 27.9494C25.3096 28.7134 24.2735 29.1426 23.1931 29.1426H8.1518C7.0714 29.1426 6.03524 28.7134 5.27128 27.9494C4.50731 27.1855 4.07812 26.1493 4.07812 25.0689V5.01386C4.07812 3.93346 4.50731 2.8973 5.27128 2.13334ZM8.1518 4.07378C7.90248 4.07378 7.66337 4.17283 7.48707 4.34913C7.31077 4.52543 7.21172 4.76454 7.21172 5.01386V25.0689C7.21172 25.3182 7.31077 25.5573 7.48707 25.7336C7.66337 25.9099 7.90248 26.009 8.1518 26.009H23.1931C23.4424 26.009 23.6815 25.9099 23.8578 25.7336C24.0341 25.5573 24.1332 25.3182 24.1332 25.0689V10.6766L17.5303 4.07378H8.1518Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.1801 0.940186C19.0454 0.940186 19.7469 1.64167 19.7469 2.50698V8.46082H25.7007C26.566 8.46082 27.2675 9.1623 27.2675 10.0276C27.2675 10.8929 26.566 11.5944 25.7007 11.5944H18.1801C17.3148 11.5944 16.6133 10.8929 16.6133 10.0276V2.50698C16.6133 1.64167 17.3148 0.940186 18.1801 0.940186Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 16.2947C9.0918 15.4294 9.79328 14.7279 10.6586 14.7279H20.6861C21.5514 14.7279 22.2529 15.4294 22.2529 16.2947C22.2529 17.16 21.5514 17.8615 20.6861 17.8615H10.6586C9.79328 17.8615 9.0918 17.16 9.0918 16.2947Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 21.3085C9.0918 20.4432 9.79328 19.7417 10.6586 19.7417H20.6861C21.5514 19.7417 22.2529 20.4432 22.2529 21.3085C22.2529 22.1738 21.5514 22.8753 20.6861 22.8753H10.6586C9.79328 22.8753 9.0918 22.1738 9.0918 21.3085Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 11.281C9.0918 10.4157 9.79328 9.71423 10.6586 9.71423H13.1655C14.0308 9.71423 14.7323 10.4157 14.7323 11.281C14.7323 12.1464 14.0308 12.8478 13.1655 12.8478H10.6586C9.79328 12.8478 9.0918 12.1464 9.0918 11.281Z"
                      fill="#000"
                    ></path>
                  </svg>
                </Center>
                <Text fw={600} w={200} truncate>
                  MRA TPIN Certificate
                </Text>
              </div>
              <div className="hidden sm:block sm:w-4/12 xl:w-2/12">
                <p className="font-medium">File size: 455KB</p>
              </div>
              <div className="hidden w-5/12 xl:block">
                <p className="font-medium">Uploaded on: 05 Jan, 2025</p>
              </div>
              <div className="text-right sm:w-3/12 xl:w-2/12 flex gap-3">
                <Button variant="outline" className="inline-flex rounded">
                  Update
                </Button>
                <Button variant="outline" className="inline-flex rounded">
                  View
                </Button>
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white py-3 shadow-default ">
            <div className="flex justify-between gap-2.5 py-3 px-6 hover:bg-gray-2 dark:hover:bg-meta-4 sm:items-center sm:justify-start">
              <div className="flex items-center gap-5 ">
                <Center className=" rounded-full p-3 bg-slate-200">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 31 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.27128 2.13334C6.03524 1.36938 7.0714 0.940186 8.1518 0.940186H18.1793C18.5949 0.940186 18.9934 1.10526 19.2872 1.39909L26.8078 8.91973C27.1017 9.21356 27.2668 9.61208 27.2668 10.0276V25.0689C27.2668 26.1493 26.8376 27.1855 26.0736 27.9494C25.3096 28.7134 24.2735 29.1426 23.1931 29.1426H8.1518C7.0714 29.1426 6.03524 28.7134 5.27128 27.9494C4.50731 27.1855 4.07812 26.1493 4.07812 25.0689V5.01386C4.07812 3.93346 4.50731 2.8973 5.27128 2.13334ZM8.1518 4.07378C7.90248 4.07378 7.66337 4.17283 7.48707 4.34913C7.31077 4.52543 7.21172 4.76454 7.21172 5.01386V25.0689C7.21172 25.3182 7.31077 25.5573 7.48707 25.7336C7.66337 25.9099 7.90248 26.009 8.1518 26.009H23.1931C23.4424 26.009 23.6815 25.9099 23.8578 25.7336C24.0341 25.5573 24.1332 25.3182 24.1332 25.0689V10.6766L17.5303 4.07378H8.1518Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.1801 0.940186C19.0454 0.940186 19.7469 1.64167 19.7469 2.50698V8.46082H25.7007C26.566 8.46082 27.2675 9.1623 27.2675 10.0276C27.2675 10.8929 26.566 11.5944 25.7007 11.5944H18.1801C17.3148 11.5944 16.6133 10.8929 16.6133 10.0276V2.50698C16.6133 1.64167 17.3148 0.940186 18.1801 0.940186Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 16.2947C9.0918 15.4294 9.79328 14.7279 10.6586 14.7279H20.6861C21.5514 14.7279 22.2529 15.4294 22.2529 16.2947C22.2529 17.16 21.5514 17.8615 20.6861 17.8615H10.6586C9.79328 17.8615 9.0918 17.16 9.0918 16.2947Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 21.3085C9.0918 20.4432 9.79328 19.7417 10.6586 19.7417H20.6861C21.5514 19.7417 22.2529 20.4432 22.2529 21.3085C22.2529 22.1738 21.5514 22.8753 20.6861 22.8753H10.6586C9.79328 22.8753 9.0918 22.1738 9.0918 21.3085Z"
                      fill="#000"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.0918 11.281C9.0918 10.4157 9.79328 9.71423 10.6586 9.71423H13.1655C14.0308 9.71423 14.7323 10.4157 14.7323 11.281C14.7323 12.1464 14.0308 12.8478 13.1655 12.8478H10.6586C9.79328 12.8478 9.0918 12.1464 9.0918 11.281Z"
                      fill="#000"
                    ></path>
                  </svg>
                </Center>
                <Text fw={600} w={200} truncate>
                  MRA Tax Clearance Certificate
                </Text>
              </div>
              <div className="hidden sm:block sm:w-4/12 xl:w-2/12">
                <p className="font-medium">File size: 455KB</p>
              </div>
              <div className="hidden w-5/12 xl:block">
                <p className="font-medium">Uploaded on: 05 Jan, 2025</p>
              </div>
              <div className="text-right sm:w-3/12 xl:w-2/12 flex gap-3">
                <Button variant="outline" className="inline-flex rounded">
                  Update
                </Button>
                <Button variant="outline" className="inline-flex rounded">
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default Page;
