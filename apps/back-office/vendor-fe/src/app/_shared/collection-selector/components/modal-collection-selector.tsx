import React from 'react';
import { axiosClient } from '@/shared/core/utilities/axiosClient';
import { CollectionQuery } from '@/shared/core/models';
import { collectionQueryBuilder } from '@/shared/core/utilities';
import { Pagination } from '@/shared/ui/pagination/pagination';
import {
  Button,
  Card,
  Checkbox,
  Input,
  LoadingOverlay,
  Modal,
  Popover,
  Table,
} from '@mantine/core';
import { EmptyIcon } from '@/shared/ui/emtpy-icon/empty-icon';
import {
  IconArrowsSort,
  IconChevronDown,
  IconFilter,
  IconSearch,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { CollectionSelectorConfig } from '../model/collection-selector-config';
/* eslint-disable-next-line */
interface CollectionSelectorProps {
  config?: CollectionSelectorConfig;
  items?: any[];
  total?: number | undefined;
  collectionQuery?: any;
  itemsLoading?: boolean;
  title?: string;
  endPoint?: string | undefined;
  filter?: any;
  order?: any;
  hasSort?: boolean;
  inputRef?: any;
  paginationChange?: any;
  buttonLoading?: boolean;
  modalOpened: boolean;
  showFilterButton?: boolean;
  setModalOpened(event: boolean): void;
  search: (event: any) => void;
  onDone?: (event: any) => void;
  selectedRows?: any[];
}

export function ModalCollectionSelector(props: CollectionSelectorProps) {
  const [endpointData, setEndpointData] = useState<any>([]);
  const [endPointItemsCount, setEndPointItemsCount] = useState<any>(0);
  const [endPointDataLoading, setEndPointDataLoading] = useState(false);
  const fetchFromEndpoint = async (
    endpoint: string,
    params: CollectionQuery = {
      top: props?.collectionQuery?.top,
      skip: props?.collectionQuery?.skip,
    },
  ) => {
    setEndPointDataLoading(true);
    try {
      const result = await axiosClient.get(endpoint, {
        params: collectionQueryBuilder(params),
      });
      setEndPointItemsCount(result?.data?.count);
      setEndpointData(result?.data?.data);
    } catch (err) {
      console.log(err);
    }
    setEndPointDataLoading(false);
  };
  useEffect(() => {
    if (props?.endPoint !== undefined) {
      fetchFromEndpoint(props?.endPoint, props?.collectionQuery);
    }
  }, [props?.endPoint, props.collectionQuery]);
  const [items, setItems] = useState(
    props?.endPoint !== undefined ? endpointData : props.items,
  );

  const [opened, setOpened] = useState(false);
  const [checkedItems, setCheckedItems] = useState<any[]>(
    props?.selectedRows ? props?.selectedRows : [],
  );
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  // const [order, setOrder] = useState('ASC');
  const [order, setOrder] = useState('asc');

  const onPageIndexChange = (page1: any, pageSize1: any) => {
    const request = {
      skip: +page1,
      top: pageSize1,
    };
    props.paginationChange(request);
  };

  useEffect(() => {
    if (props?.selectedRows) {
      setCheckedItems(props?.selectedRows);
    }
  }, [props.selectedRows]);

  const checkAll = (event: any) => {
    if (event.target.checked) {
      setCheckedItems(items ? items : []);
      setIsCheckAll(true);
    } else {
      setCheckedItems([]);
      setIsCheckAll(false);
    }
  };

  const handleCheckbox = (event: any, element: any) => {
    if (event.target.checked) {
      setCheckedItems((prev) => [...prev, element]);
    } else {
      const checked = checkedItems.filter((e) => e.id !== element.id);
      setCheckedItems(checked);
      setIsCheckAll(false);
    }
  };

  // const sorting = (column: any, type: string) => {
  //   if (order === 'ASC' && items) {
  //     const sorted = [...items].sort((a, b) =>
  //       a[column]?.toString().toLowerCase() >
  //       b[column]?.toString()?.toLowerCase()
  //         ? 1
  //         : -1
  //     );
  //     setItems(sorted);
  //     setOrder('DEC');
  //   }
  //   if (order === 'DEC' && items) {
  //     const sorted = [...items].sort((a, b) =>
  //       b[column]?.toString()?.toLowerCase() >
  //       a[column]?.toString()?.toLowerCase()
  //         ? 1
  //         : -1
  //     );
  //     setItems(sorted);
  //     setOrder('ASC');
  //   }
  // };
  const sortData = (column: any, direction: any) => {
    setOrder((currentOrder) => {
      if (currentOrder === 'desc') currentOrder = 'asc';
      else currentOrder = 'desc';
      props?.order({
        field: column,
        direction: direction.order,
      });
      return currentOrder;
    });
  };

  useEffect(() => {
    checkedItems?.length === items?.length
      ? setIsCheckAll(true)
      : setIsCheckAll(false);
  }, [checkAll, handleCheckbox]);

  useEffect(() => {
    setItems(props?.endPoint !== undefined ? endpointData : props.items);
  }, [props]);

  const onFilterOpened = () => {
    setOpened(!opened);
  };

  let headers, rows, filterOptions;
  let filterParam: any[] = [];

  if (props.config?.visibleColumn) {
    headers = props.config?.visibleColumn.map((column, index) => {
      return (
        <th key={Array.isArray(column.key) ? column.key[0] : column.key}>
          <div className="flex" key={index}>
            <div>
              {column.isTranslate
                ? column?.name
                  ? column.name
                  : ''
                : column?.name}
            </div>
            {props.hasSort && (
              <div className="h-4 items-center  hover:cursor-pointer">
                <a onClick={() => sortData(column.key, { order })}>
                  <IconArrowsSort
                    className="mt-1 ml-1"
                    color={'grey'}
                    width={14}
                    height={14}
                  />
                </a>
              </div>
            )}
          </div>
        </th>
      );
    });

    const checkIsChecked = (element: any) => {
      if (Array.isArray(checkedItems)) {
        const found = checkedItems?.some((el) => el?.id === element.id) ?? [];
        if (found) return true;
        return false;
      }
    };
    rows = items?.map((element: any, index: number) => (
      <tr key={index} className="group">
        <td>
          <Checkbox
            key={index}
            color={'sky'}
            onChange={(event) => handleCheckbox(event, element)}
            checked={checkIsChecked(element)}
          />
        </td>
        {props.config?.visibleColumn.map((column, index) => {
          if (column?.deep && column?.deepKey) {
            return (
              <td key={index}>
                <ul>
                  {element[column.key]?.map((item: any) => (
                    <li className={'list-disc'} key={item?.toString()}>
                      {column.hasLocale
                        ? item[`${column.deepKey}`]
                        : item[`${column.deepKey}`]}
                    </li>
                  ))}
                </ul>
              </td>
            );
          }
          return (
            <td key={index}>
              {!Array.isArray(column.key)
                ? column.hasLocale
                  ? element[column.key]
                  : element[column.key]
                : childeView(element, column.key)}
            </td>
          );
        })}
      </tr>
    ));
    if (props?.config?.filter?.length) {
      filterOptions = props.config.filter.map((option, index) => {
        return (
          <div className="w-full" key={index}>
            <div className="border-b py-2 pl-4 font-bold">
              Filtered By {option[0].fieldName}
            </div>
            <div className="px-2" key={option[0].field}>
              {option.map((opt, index) => {
                return (
                  <Checkbox
                    key={index}
                    onChange={(event) => onFilter(event, opt)}
                    label={opt.name}
                    size="xs"
                    className="my-2"
                  />
                );
              })}
            </div>
          </div>
        );
      });
    }
  }

  const childeView = (item: any, keys: string[]) => {
    if (keys.length && item) {
      keys.forEach((key: any) => {
        if (item[key] !== null && item[key] !== undefined) {
          item = item[key];
        } else {
          item = '';
        }
      });
    }

    return item;
  };

  const onDone = async () => {
    if (props.onDone) {
      await props.onDone(checkedItems);
      props.setModalOpened(false);
      setCheckedItems([]);
    }
  };

  const onFilter = (event: any, selectedField: any) => {
    // Adds and removes filter params into the query
    event.currentTarget.checked
      ? filterParam.push(selectedField)
      : (filterParam = filterParam.filter(
          (a) => a.value !== selectedField.value,
        ));

    // groups the filter query by their filter key
    let filterQuery: any[] = [];
    const filterMap: { [key: string]: any[] } = {};
    filterParam.forEach((item) => {
      filterMap[item.field] = filterParam.filter(
        (query) => query?.field === item.field,
      );
    });
    // constructs the filter query into array form the grouped object
    Object.keys(filterMap).forEach((key) => {
      filterQuery = [...filterQuery, filterMap[key]];
    });
    props.filter(filterQuery);
  };

  return (
    <Modal
      opened={props.modalOpened}
      onClose={() => props.setModalOpened(false)}
      title={props.config?.title}
      size={props.config?.size}
      styles={{
        header: {
          borderBottom: '1px solid rgb(229 231 235)',
        },
        title: {
          color: 'rgb(0,0,0)',
          fontWeight: 'bold',
        },
      }}
    >
      <Card className="w-full" style={{ height: 'fit-content' }}>
        {/* search */}
        <Card.Section className="px-2 py-2">
          <div className="flex w-full">
            <Input
              className={'w-full'}
              size="xs"
              onKeyUp={(event: any) => props?.search(event.target.value)}
              placeholder="search"
              ref={props?.inputRef}
              rightSection={<IconSearch className="inline-block" size={16} />}
              rightSectionWidth={40}
              styles={{ rightSection: { pointerEvents: 'none' } }}
            />

            {props.config?.filter?.length && props.showFilterButton && (
              <Popover
                // className="ml-2 h-7 bg-white hover:bg-white"
                opened={opened}
                onClose={() => setOpened(false)}
              >
                <Popover.Target>
                  <div
                    onClick={onFilterOpened}
                    className="flex h-7 items-center border  hover:cursor-pointer"
                  >
                    <IconFilter className="mx-1 flex" />
                    <span className="mx-1">Filter</span>
                    <IconChevronDown className="mx-1 flex" />
                  </div>
                </Popover.Target>

                {filterOptions}
              </Popover>
            )}
          </div>
        </Card.Section>
        {/* table */}
        <Card.Section className="px-2 py-2">
          <Table horizontalSpacing="sm">
            <thead>
              <tr className="bg-gray-200">
                <th style={{ width: '1%' }}>
                  <Checkbox
                    color="sky"
                    checked={isCheckAll}
                    onChange={(event) => checkAll(event)}
                  />
                </th>
                {headers}
              </tr>
            </thead>

            {(props.itemsLoading || endPointDataLoading) && (
              <div>
                <LoadingOverlay
                  visible={
                    props?.endPoint !== undefined
                      ? endPointDataLoading
                      : (props.itemsLoading as boolean)
                  }
                  loaderProps={{
                    size: 'sm',
                    color: '#0c4a6e',
                    variant: 'oval',
                  }}
                  overlayOpacity={0.3}
                  overlayColor={'#0c4a6e'}
                />
              </div>
            )}
            <tbody>{rows}</tbody>
          </Table>
        </Card.Section>
        {endPointItemsCount === 0 &&
          (props.items?.length === 0 || props?.items === undefined) && (
            <EmptyIcon />
          )}

        {/* pagination */}

        {props?.items?.length || endPointItemsCount > 0 ? (
          <Card.Section className="mt-4 mb-2 flex  justify-end ">
            <Pagination
              total={
                props?.endPoint !== undefined
                  ? endPointItemsCount
                  : props?.total
              }
              pageSize={[5, 10, 20]}
              onPaginationChange={onPageIndexChange}
            />
          </Card.Section>
        ) : null}

        {/* submit value */}
        <Card.Section className="mt-4 flex justify-end ">
          <div className="mr-2">
            <Button
              onClick={() => props.setModalOpened(false)}
              variant="outline"
              type="submit"
              component="button"
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              loading={props.buttonLoading}
              onClick={onDone}
              type="submit"
              className="bg-primary"
              component="button"
              disabled={checkedItems?.length === 0 ? true : false}
            >
              Done
            </Button>
          </div>
        </Card.Section>
      </Card>
    </Modal>
  );
}

export default ModalCollectionSelector;
