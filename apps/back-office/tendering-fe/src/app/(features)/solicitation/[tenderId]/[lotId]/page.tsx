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
import { useLazyListByIdQuery, useReadQuery } from '../../_api/lot.api';
import { useReadQuery as useTenderRead } from '../../_api/tender.api';
import Extension from './guarantee-extension/page';
import GuaranteeRelease from './guarantee-release/page';
import GuaranteeForfeit from './guarantee-forfeit/page';

export default function TenderDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { tenderId } = useParams();
  const { lotId } = useParams();
  const { data: selected, isLoading } = useTenderRead(tenderId?.toString());
  const { data: lot } = useReadQuery(lotId?.toString());
  const [trigger] = useLazyListByIdQuery();

  useEffect(() => {
    if (selected) {
      trigger({ id: selected.id, collectionQuery: { skip: 0, take: 10 } });
    }
  }, [selected, trigger]);
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
              <IconChevronLeft onClick={() => router.push(`/solicitation`)} />
              <Text
                className="text-xl font-bold"
                onClick={() => router.push(`/solicitation`)}
              >
                {selected?.name} /
              </Text>
              <Text
                className="text-xl font-bold"
                onClick={() => router.push(`/solicitation/${tenderId}`)}
              >
                {lot?.name}
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
