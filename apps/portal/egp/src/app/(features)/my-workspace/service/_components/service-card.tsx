'use client';

import { Card, Divider, Flex, Group, Text } from '@mantine/core';
import { ReactElement } from 'react';
import styles from './landing.module.scss';
import { IconArrowRight, IconEdit, IconPencil } from '@tabler/icons-react';
import { IconEyeEdit } from '@tabler/icons-react';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';

type FeaturesCardProps = {
  color?: string;
  title: string;
  description: string;
  icon?: ReactElement;
  link: string;
};

// export const ServiceCard = (props: FeaturesCardProps) => {
//   const router = useRouter();
//   const [showArrow, { open, close }] = useDisclosure(false);
//   return (
//     <Card
//       withBorder
//       h={150}
//       className={styles.featureCard}
//       onClick={() => router.push(props.link)}
//       styles={{
//         section: {
//           padding: 24,
//         },
//       }}
// onMouseEnter={() => open()}
// onMouseLeave={() => close()}
//     >
//       <Flex className="gap-4">
// <span className="w-4 h-4 ">
//   <IconPencil size={20} stroke={1.5} color="green" />
// </span>
//         <Flex direction={'column'} gap={16} className="w-full h-full">
//           <Flex
//             align={'center'}
//             justify={'space-between'}
//             className="w-full h-4"
//           >
//             <Text
//               className="text-md font-[500] line-clamp-2"
//               style={{
// fontSize: '20px',
// lineHeight: '24px',
//               }}
//             >
//               {props.title}
//             </Text>

// {showArrow && (
//   <IconArrowRight size={20} stroke={1.5} color="green" />
// )}
//           </Flex>
//           <Text
//             size="md"
//             lineClamp={3}
//             style={{
//               fontSize: '14px',
//               lineHeight: '20px',
//             }}
//             className="flex-1"
//           >
//             {props.description}
//           </Text>
//         </Flex>
//       </Flex>
//     </Card>
//   );
// };

export const ServiceCard = (props: FeaturesCardProps) => {
  const [showArrow, { open, close }] = useDisclosure(false);
  return (
    <a
      href={props.link}
      className="block w-sm p-6 h-[150px] bg-white border border-gray-200 rounded-lg shadow hover:bg-[#E7F4F7] dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      onMouseEnter={() => open()}
      onMouseLeave={() => close()}
    >
      <Flex align={'flex-start'} gap={'md'} className="mb-2">
        <span className="mt-0">
          <IconPencil size={20} stroke={1.5} color="green" />
        </span>
        <Flex className="flex-1 " align={'center'} justify={'space-between'}>
          <h5
            className="text-md font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1"
            style={{
              fontSize: '16px',
              lineHeight: '24px',
            }}
          >
            {props.title}
          </h5>
          {showArrow && <IconArrowRight size={20} stroke={1.5} color="green" />}
        </Flex>
      </Flex>
      <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
        {props.description}
      </p>
    </a>
  );
};
