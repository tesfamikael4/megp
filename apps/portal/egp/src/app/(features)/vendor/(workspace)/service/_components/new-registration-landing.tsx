import { Box, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';

const NewRegistrationLanding = () => {
  const router = useRouter();
  return (
    <Box className="p-4">
      <Box className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <Box className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50 dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            New Registration
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Start your procurement journey Here{' '}
          </p>

          <Box className="flex items-center w-full mt-4 gap-x-3 shrink-0 sm:w-auto">
            <Button
              className="w-1/2 px-5 text-sm tracking-wide text-white transition-colors duration-200 shrink-0 sm:w-auto "
              onClick={() => router.push('/vendor/registration/new/basic')}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewRegistrationLanding;
