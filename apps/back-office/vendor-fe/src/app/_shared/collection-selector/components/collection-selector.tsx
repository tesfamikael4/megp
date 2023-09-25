import { Card, Checkbox, Input, Table } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Pagination } from '@/shared/ui/page';
import { useEffect, useState } from 'react';
import { CollectionSelectorConfig } from '../model/collection-selector-config';

/* eslint-disable-next-line */
export interface CollectionSelectorProps {
  config?: CollectionSelectorConfig;
  items?: any[];
  total?: number;
  collectionQuery?: any;
  title?: string;
  filter?: any;
  order?: any;
  paginationChange?: any;
  search: (event: any) => void;
  onCheck?: (event: any) => void;
}

export function CollectionSelector(props: CollectionSelectorProps) {
  const [items, setItems] = useState(props.items);
  const [checkedItems, setCheckedItems] = useState<any[]>([]);
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

  const onPageIndexChange = (page1: any, pageSize1: any) => {
    console.log(page1, pageSize1);
    const request = {
      skip: +page1,
      top: pageSize1,
    };
    props.paginationChange(request);
  };

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
    console.log('checkedItems..', checkedItems);
    checkedItems?.length === items?.length
      ? setIsCheckAll(true)
      : setIsCheckAll(false);
  }, [checkAll, handleCheckbox]);

  useEffect(() => {
    setItems(props.items);
  }, [props]);

  useEffect(() => {
    onCheck();
  }, [checkedItems]);

  let headers, rows;

  if (props.config?.visibleColumn) {
    headers = props.config?.visibleColumn.map((col) => {
      return <th key={col.key}>{col?.name}</th>;
    });

    rows = props.items?.map((element, index) => (
      <tr key={index}>
        <td>
          <Checkbox
            onChange={(event) => handleCheckbox(event, element)}
            checked={checkedItems.includes(element)}
          />
        </td>

        {props.config?.visibleColumn.map((col) => {
          return <td key={col.key}>{element[col.key]}</td>;
        })}
      </tr>
    ));
  }

  const onCheck = () => {
    if (props.onCheck) {
      props.onCheck(checkedItems);
    }
  };

  return (
    <div className="m-4 flex w-full">
      <Card
        className="w-full"
        style={{ height: 'fit-content', marginRight: '30px' }}
        shadow={'sm'}
      >
        <Card.Section className="px-4 py-2">
          <div className="text-bold px-2 py-2 text-lg">
            {props.config?.title}
          </div>
        </Card.Section>
        {/* search */}
        <Card.Section className="px-4 py-2">
          <div>
            <Input
              size="sm"
              onKeyUp={(event: any) => props?.search(event.target.value)}
              placeholder="search"
              rightSection={<IconSearch className="inline-block" size={16} />}
              rightSectionWidth={40}
              styles={{ rightSection: { pointerEvents: 'none' } }}
            />
          </div>
        </Card.Section>
        {/* table */}
        <Card.Section className="px-4 py-2">
          <Table horizontalSpacing="sm">
            <thead>
              <tr>
                <th>
                  <Checkbox
                    checked={isCheckAll}
                    onChange={(event) => checkAll(event)}
                  />
                </th>

                {headers}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Card.Section>
        {/* pagination */}
        <Card.Section className="mt-4 mb-2 flex w-full justify-end ">
          <div className="mr-2 mt-1 w-64">
            <Pagination
              total={20}
              pageSize={[5, 10, 20]}
              onPaginationChange={onPageIndexChange}
            />
          </div>
        </Card.Section>
      </Card>
    </div>
  );
}

export default CollectionSelector;
