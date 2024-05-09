'use client';
import {
  Box,
  Container,
  Flex,
  LoadingOverlay,
  Text,
  Tooltip,
  useCombobox,
} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useEffect } from 'react';
import GuaranteeRelease from './guarantee-release/page';
import GuaranteeForfeit from './guarantee-forfeit/page';
import Extension from './guarantee-extension/page';
import { useReadQuery } from './_api/guarantee-request.api';

export default function TenderDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { tenderId, lotId, guaranteeId } = useParams();
  const { data: selected, isLoading } = useReadQuery(guaranteeId?.toString());

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <div className="bg-white -mt-4 -mr-4 -ml-4">
        <div className="container mx-auto ">
          <div className="pt-10 pb-10 text-black font-bold text-2xl flex justify-between">
            <Flex align="center" className="cursor-pointer ">
              <IconChevronLeft
                onClick={() =>
                  router.push(`/solicitation/${tenderId}/${lotId}`)
                }
              />
              <Text
                className="text-xl font-bold"
                onClick={() =>
                  router.push(`/solicitation/${tenderId}/${lotId}`)
                }
              >
                {selected?.bidderName}
              </Text>
            </Flex>
          </div>
          <div className="flex">
            <div>
              <div className="flex space-x-4">
                <Text
                  className={
                    searchParams.get('tab') === 'extension'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                      : ' cursor-pointer text-gray-700 py-2 px-10 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname + '?' + createQueryString('tab', 'extension'),
                    );
                  }}
                >
                  Guarantee Extension
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'release'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                      : ' cursor-pointer text-gray-700 py-2 px-10 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname + '?' + createQueryString('tab', 'release'),
                    );
                  }}
                >
                  Guarantee Release
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'forfeit'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                      : ' cursor-pointer text-gray-700 py-2 px-10 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname + '?' + createQueryString('tab', 'forfeit'),
                    );
                  }}
                >
                  Guarantee Forfeit
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">
        <Container fluid>
          {searchParams.get('tab') === 'release' && (
            <>
              <GuaranteeRelease />
            </>
          )}
          {searchParams.get('tab') === 'forfeit' && (
            <>
              <GuaranteeForfeit />
            </>
          )}
          {searchParams.get('tab') === 'extension' && (
            <>
              <Extension />
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
