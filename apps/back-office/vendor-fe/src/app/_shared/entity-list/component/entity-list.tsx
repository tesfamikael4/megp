import {
  Button,
  Card,
  Checkbox,
  Input,
  LoadingOverlay,
  Popover,
  Table,
} from '@mantine/core';
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronRight,
  IconFilter,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { EmptyIcon } from '../../ui/emtpy-icon/empty-icon';
import { Pagination } from '../../ui/pagination/pagination';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EntityListConfiguration } from '../model/entity-list-config';
import { selectFullScreen } from '../store/entity-list.slice';
import Ellipsis from './ellipsis';
import Header from './header';

interface EntityListProps {
  config: EntityListConfiguration;
  viewMode: 'list' | 'new' | 'detail';
  items?: any[];
  selectedItem?: any;
  itemsLoading?: boolean;
  total: number;
  collectionQuery?: any;
  inputRef?: any;
  search?: any;
  filter?: any;
  titleColumn: string;
  order?: any;
  export?: any;
  paginationChange: any;
  hasCheckBox?: boolean;
  showNewButton?: boolean;
  showExportButton?: boolean;
  showSearchButton?: boolean;
  titleColumnHasLocal?: boolean;
  tree?: boolean;
}

export function EntityList(props: EntityListProps) {
  /* Hooks */

  // const { page, perPage } = router.query;
  const router = useRouter();
  const page = 10;
  const perPage = 50;
  const fullScreen: boolean = useSelector(selectFullScreen);
  const [opened, setOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(
    page ? parseInt(page?.toString()) : 1,
  );
  const [currentPageSize, setCurrentPageSize] = useState<number>(
    perPage ? parseInt(perPage?.toString()) : 10,
  );
  const [overallSelectedItemIndex, setOverallSelectedItemIndex] =
    useState<number>(-1);
  const [selectedDataIndex, setSelectedDataIndex] = useState<number>(-1);
  const [openedExport, setOpenedExport] = useState(false);
  const [items, setItems] = useState(props.items);
  const [viewMode, setViewMode] = useState<'list' | 'new' | 'detail'>(
    props.viewMode,
  );
  const [checkedItems, setCheckedItems] = useState<any[]>([]);
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [order, setOrder] = useState('asc');

  let headers, rows, filterOptions;
  let filterParam: any[] = [];

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

  const onExport = () => {
    props.export(props.items);
  };

  if (props.config?.visibleColumn && viewMode === 'list') {
    headers = props.config?.visibleColumn.map((col) => {
      return (
        <th key={Array.isArray(col.key) ? col.key[0] : col.key}>
          <div className="flex">
            <div>
              {col.isTranslate ? (col?.name ? col.name : '') : col?.name}
            </div>
            <div className="h-4 items-center  hover:cursor-pointer">
              <button onClick={() => sortData(col.key, { order })}>
                <IconArrowsSort
                  className="mt-1 ml-1"
                  color={'grey'}
                  width={14}
                  height={14}
                />
              </button>
            </div>
          </div>
        </th>
      );
    });

    rows = props.items?.map((element, index) => (
      <tr key={index} className="group cursor-pointer hover:bg-slate-100">
        {props.hasCheckBox && (
          <td key={index}>
            <Checkbox
              color={'sky'}
              onChange={(event) => handleCheckbox(event, element)}
              checked={checkedItems.includes(element)}
            />
          </td>
        )}
        {props.config?.visibleColumn.map((col, index) => {
          return (
            <td key={index}>
              {!Array.isArray(col.key) ? (
                col.hasLocal ? (
                  <Ellipsis text={element?.[col.key]} />
                ) : (
                  <Ellipsis text={element?.[col.key]} />
                )
              ) : (
                <Ellipsis text={childeView(element, col.key)} />
              )}
            </td>
          );
        })}
        <td
          className=" invisible  w-['1px'] cursor-pointer text-right hover:visible group-hover:visible"
          onClick={() => {
            if (props.config?.routing) {
              props.config.routing(element);
            } else {
              setIsCheckAll(true);
            }
          }}
        >
          <Link
            href={`${props.config?.detailUrl}/${element?.[
              props.config?.detailId
            ]}?page=${currentPage}&perPage=${currentPageSize}`}
          >
            <IconChevronRight />
          </Link>
        </td>
      </tr>
    ));

    if (props?.config?.filter?.length) {
      filterOptions = props.config.filter.map((option, index) => {
        return (
          <div className="w-full" key={index}>
            <div
              className="border-b py-2 pl-4 font-bold text-slate-700"
              key={index}
            >
              {option[0].fieldName}
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

  if (props.config?.primaryColumn && viewMode !== 'list') {
    headers = <th>{props.config?.primaryColumn.name}</th>;
    const primaryCol = props.config?.primaryColumn.key;
    rows = props.items?.map((element, index) => {
      return (
        <tr key={index} className="group">
          <td
            className={`${
              props.selectedItem &&
              element[props.config.detailId] ===
                props.selectedItem[props.config.detailId]
                ? 'bg-primary text-white'
                : 'hover:bg-gray-200'
            } cursor-pointer `}
            onClick={() => {
              router.push(
                `${props.config.detailUrl}/${
                  element[props.config?.detailId]
                }?page=${currentPage}&perPage=${currentPageSize}`,
              );
            }}
          >
            {!Array.isArray(primaryCol)
              ? props.config?.primaryColumn?.hasLocal
                ? element?.[primaryCol]
                : element?.[primaryCol]
              : props.config?.primaryColumn?.hasLocal
              ? childeView(element, primaryCol)
              : childeView(element, primaryCol)}
          </td>
        </tr>
      );
    });
  }

  const checkAll = (event: any) => {
    if (event.target.checked) {
      setCheckedItems(items ? items : []);
      setIsCheckAll(true);
    } else {
      setCheckedItems([]);
      setIsCheckAll(false);
    }
  };

  const handleCheckbox = (event: any, id: any) => {
    if (event.target.checked) {
      setCheckedItems((prev) => [...prev, id]);
    } else {
      const checked = checkedItems.filter((e) => e !== id);
      setCheckedItems(checked);
      setIsCheckAll(false);
    }
  };

  useEffect(() => {
    checkedItems?.length === items?.length
      ? setIsCheckAll(true)
      : setIsCheckAll(false);
  }, [checkAll, handleCheckbox]);

  useEffect(() => {
    setItems(props.items);
  }, [props]);

  useEffect(() => {
    checkedItems?.length === items?.length
      ? setIsCheckAll(true)
      : setIsCheckAll(false);
  }, [checkAll, handleCheckbox]);

  useEffect(() => {
    if (props.selectedItem !== undefined) {
      props?.items?.map((element, index) => {
        if (
          element[props.config.detailId] ==
          props.selectedItem[props.config.detailId]
        ) {
          setSelectedDataIndex(index);
        }
        return element;
      });
    }
  }, [props.selectedItem]);

  useEffect(() => {
    if (props.selectedItem !== undefined) {
      if (
        viewMode === 'detail' &&
        props.selectedItem !== undefined &&
        page !== undefined &&
        perPage !== undefined &&
        selectedDataIndex !== -1
      ) {
        setOverallSelectedItemIndex(
          (currentPage - 1) * parseInt(perPage.toString()) + selectedDataIndex,
        );
      }
    }
  }, [selectedDataIndex]);

  useEffect(() => {
    if (
      viewMode === 'detail' &&
      props.selectedItem !== undefined &&
      overallSelectedItemIndex !== -1 &&
      perPage !== undefined &&
      page !== undefined &&
      parseInt(perPage?.toString()) === currentPageSize
    ) {
      setCurrentPage(parseInt(page?.toString()));
    }
  }, [page]);

  useEffect(() => {
    /* if (
      viewMode === 'detail' &&
      props.selectedItem !== undefined &&
      overallSelectedItemIndex !== -1 &&
      perPage !== undefined &&
      page !== undefined &&
      parseInt(perPage?.toString()) === currentPageSize
    ) {
      console.log(currentPage);
    } */
  }, [currentPage]);

  useEffect(() => {
    if (
      viewMode === 'detail' &&
      props.selectedItem !== undefined &&
      overallSelectedItemIndex !== -1 &&
      perPage !== undefined &&
      parseInt(perPage?.toString()) !== currentPageSize
    ) {
      for (
        let newPage: number = Math.ceil(props.total / currentPageSize);
        newPage >= 1;
        newPage--
      ) {
        let newPageIdentified = false;
        for (let index = 0; index <= overallSelectedItemIndex; index++) {
          if (
            (newPage - 1) * currentPageSize + index ===
            overallSelectedItemIndex
          ) {
            newPageIdentified = true;
            setCurrentPage(newPage);
            router.push(
              `${props.config?.detailUrl}/${
                props.selectedItem[props.config?.detailId]
              }?page=${newPage}&perPage=${currentPageSize}`,
            );
          }
        }
        if (newPageIdentified) {
          break;
        }
      }
    }
  }, [currentPageSize, overallSelectedItemIndex]);

  const onFilterOpened = () => {
    setOpened(!opened);
  };

  const onExportOpened = () => {
    setOpenedExport(!openedExport);
  };
  const onCloseHandler = () => {
    router.push(props.config?.listUrl ? props.config?.listUrl : '/');
  };

  const onPageIndexChange = (page: any, pageSize: any, currentPage: any) => {
    const request = {
      skip: +page,
      top: pageSize,
    };
    setCurrentPage(currentPage);
    setCurrentPageSize(pageSize);
    props.paginationChange(request);
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

  const sortData = (column: any, direction: any) => {
    setOrder((currentOrder) => {
      if (currentOrder === 'desc') currentOrder = 'asc';
      else currentOrder = 'desc';
      props.order({
        field: column,
        direction: direction.order,
      });
      return currentOrder;
    });
  };
  return (
    <div>
      <div className="flex">
        {(viewMode === 'list' ||
          (!fullScreen && (viewMode === 'detail' || viewMode === 'new'))) && (
          <Card
            style={{ height: 'fit-content' }}
            shadow={'sm'}
            className={`${viewMode === 'list' ? 'w-full' : 'w-1/3'}`}
          >
            {/* title and new button */}

            <Card.Section
              className="mb-2 flex flex-row w-auto justify-between border-b px-4"
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '10px',
              }}
            >
              <div className="text-base font-bold text-slate-700">
                {props.config?.title}
              </div>
              {props.showNewButton && (
                <div>
                  <Link href={props.config?.newUrl ? props.config?.newUrl : ''}>
                    <Button type="submit" className="bg-primary" size="xs">
                      <IconPlus className="mr-2" />
                      New
                    </Button>
                  </Link>
                </div>
              )}
            </Card.Section>

            {/* action, search and filter  */}
            <Card.Section
              className={viewMode === 'list' ? 'flex w-full p-2' : 'p-2'}
            >
              <div className={viewMode === 'list' ? 'w-1/2' : 'hidden'}>
                {props.showExportButton && (
                  <Popover width={200} position="bottom" withArrow shadow="md">
                    <Popover.Target>
                      <Button
                        disabled={
                          props?.items === undefined ||
                          props?.items?.length === 0 ||
                          props.config?.actions === undefined ||
                          props.config?.actions?.length === 0
                        }
                        onClick={onExportOpened}
                        type="submit"
                        className="bg-primary"
                        size="xs"
                      >
                        Export
                      </Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <div className=" flex w-14 flex-col gap-3">
                        {props.config?.actions?.map((act, index) => {
                          return (
                            <div
                              key={index}
                              onClick={onExport}
                              className="cursor-pointer"
                            >
                              {act}
                            </div>
                          );
                        })}
                      </div>
                    </Popover.Dropdown>
                  </Popover>
                )}
              </div>

              <div
                className={
                  viewMode === 'list' ? 'flex w-1/2 justify-end ' : 'w-full'
                }
              >
                {props.showSearchButton && (
                  <Input
                    className={
                      viewMode === 'list' ? 'mr-2 w-full ' : 'mr-0 ml-0'
                    }
                    size="xs"
                    ref={props?.inputRef}
                    onKeyUp={(event: any) => props.search(event.target.value)}
                    placeholder="search here"
                    rightSection={
                      <IconSearch className="inline-block" size={16} />
                    }
                    rightSectionWidth={40}
                    styles={{
                      rightSection: { pointerEvents: 'none' },
                    }}
                  />
                )}

                {viewMode === 'list' && props.config?.filter?.length && (
                  <Popover withinPortal>
                    <Popover.Target>
                      <div
                        onClick={onFilterOpened}
                        className="flex h-full items-center border  hover:cursor-pointer"
                      >
                        <IconFilter className="mx-1 flex text-slate-700" />
                        <span className="mx-1">Filter</span>
                        <IconChevronDown className="mx-1 flex text-slate-700" />
                      </div>
                    </Popover.Target>
                    <Popover.Dropdown> {filterOptions}</Popover.Dropdown>
                  </Popover>
                )}
              </div>
            </Card.Section>

            {/* table */}

            <Card.Section className="px-4 py-2">
              {props.itemsLoading ? (
                <div className="mx-auto flex   w-full justify-center text-center">
                  <LoadingOverlay
                    visible={props.itemsLoading}
                    loaderProps={{
                      size: 'sm',
                      color: 'sky',
                      variant: 'oval',
                    }}
                    overlayOpacity={0.3}
                    overlayColor={'#94a3b8'}
                  />
                </div>
              ) : (
                <Table horizontalSpacing="sm">
                  <thead>
                    <tr className="bg-gray-200">
                      {props.hasCheckBox &&
                        viewMode === 'list' &&
                        (props.items?.length ? (
                          <th>
                            <Checkbox
                              color={'sky'}
                              checked={isCheckAll}
                              onChange={(event) => checkAll(event)}
                            />
                          </th>
                        ) : (
                          ''
                        ))}
                      {headers}
                      <th
                        className={viewMode === 'list' ? 'w-1' : 'hidden'}
                      ></th>
                    </tr>
                  </thead>

                  <tbody>{rows}</tbody>
                </Table>
              )}
            </Card.Section>
            {!props.items?.length && !props.itemsLoading && <EmptyIcon />}
            {/* pagination */}
            {props.items && props.items?.length > 0 && (
              <Card.Section className="mt-4 mb-2 flex w-full justify-end pb-4">
                <Pagination
                  total={props.total}
                  pageSize={[5, 10, 20, 25, 30, 50]}
                  onPaginationChange={onPageIndexChange}
                  defaultPageSize={currentPageSize ? currentPageSize : 10}
                  initialPage={page ? currentPage : 1}
                />
              </Card.Section>
            )}

            {/* )} */}
          </Card>
        )}

        {viewMode !== 'list' && (
          <div className={fullScreen ? 'w-full' : ' w-2/3'}>
            <div className="ml-2">
              <Header
                onclose={onCloseHandler}
                title={
                  viewMode === 'detail' && props.selectedItem !== undefined
                    ? props.titleColumnHasLocal
                    : props.selectedItem[props.titleColumn]
                }
              />
            </div>

            {(viewMode === 'new' || viewMode === 'detail') && (
              <div className={`mt-2`}>{props.config?.sideComponent}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EntityList;
