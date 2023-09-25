import {
  createStyles,
  Menu,
  Pagination as MPagination,
  Text,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

export type PaginationProps = {
  total: number;
  pageSize?: number[];
  onPaginationChange: any;
  defaultPageSize?: number;
  initialPage?: number;
};
const useStyles = createStyles((theme) => ({
  acive: {
    backgroundColor: 'red',
  },
}));

export function Pagination(props: PaginationProps) {
  const [pageSize, setPageSize] = useState(
    props.defaultPageSize ? props.defaultPageSize : 10,
  );
  const [pageSizeArray] = useState<number[]>(
    props.pageSize ? props.pageSize : [10, 20, 30, 40, 50],
  );
  const [pageSizeTitle, setPageSizeTitle] = useState(
    props.defaultPageSize ? `${props.defaultPageSize} / page` : `10 / page`,
  );
  const [items, setItems] = useState(Math.ceil(props.total / pageSize));
  const [currentPage, setCurrentPage] = useState(
    props.initialPage ? props.initialPage : 1,
  );

  useEffect(() => {
    setItems(Math.ceil(props.total / pageSize));
    if (currentPage > items) {
      setCurrentPage(props.initialPage ? props.initialPage : 1);
    } else {
      props.onPaginationChange(
        pageSize * (currentPage - 1),
        pageSize,
        currentPage,
      );
    }
  }, [pageSize, props.total, currentPage, items, props.initialPage]);

  useEffect(() => {
    if (props.initialPage !== undefined && props.initialPage !== currentPage) {
      props.onPaginationChange(
        pageSize * (props.initialPage - 1),
        pageSize,
        props.initialPage,
      );
      setCurrentPage(props.initialPage);
    }
  }, [props.initialPage]);

  const { classes } = useStyles();

  return (
    <div className={`flex space-x-5 text-sm`}>
      <MPagination
        value={currentPage}
        size={'sm'}
        total={items}
        onChange={(page) => {
          setCurrentPage(page);
        }}
      />

      <Menu
        classNames={
          {
            // active: '',
          }
        }
      >
        <Menu.Target>
          <div className="flex max-h-fit items-center rounded border border-solid border-gray-200 bg-white p-1">
            <Text className="text-xs font-medium ">{pageSizeTitle}</Text>
            <IconChevronDown strokeWidth={'1'} size={16} />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          {pageSizeArray.map((item) => {
            return (
              <Menu.Item
                key={item}
                className="bg-white text-sm text-black"
                onClick={() => {
                  setPageSize(item);
                  setPageSizeTitle(`${item} / page`);
                }}
              >
                {`${item} / page `}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
