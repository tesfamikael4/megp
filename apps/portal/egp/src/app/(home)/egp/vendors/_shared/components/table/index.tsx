/**
 * @component Table
 * @description A customizable table component using Mantine UI.
 * @param {TableConstructorProps} props - Component props.
 * @returns {React.ReactElement} - A table component.
 */

import React from 'react';
import { Flex, Table as MantineTable } from '@mantine/core';

/**
 * @interface TableConstructorProps
 * @description Props for the `Table` component constructor.
 * @property {TableColumnsProps[]} columns - An array of column definitions.
 * @property {Object[]} data - An array of objects representing the data to be displayed.
 * @property {React.ReactElement} [addcolumn] - An optional React element to add a custom column.
 * @property {React.ReactElement} [title] - An optional React element to display as the table title.
 * @property {"center" | "start" | "end"} [titlePosition] - The position of the table title (center, start, or end).
 */
export interface TableConstructorProps {
  columns: TableColumnsProps[];
  data: { [key: string]: any }[]; // Define it as an array of objects
  [key: string]: any;
  addcolumn?: React.ReactElement;
  title?: React.ReactElement;
  titlePosition?: 'center' | 'start' | 'end';
}

/**
 * @interface TableColumnsProps
 * @description Props for defining table columns.
 * @property {string} name - The name of the column.
 * @property {(item: any) => React.ReactElement} render - A function to render the content of the column.
 */
export interface TableColumnsProps {
  name: string;
  render: (item: any) => React.ReactElement;
}

/**
 * @interface Table
 * @description Extended interface for the `TableConstructorProps` with an additional `tableType` property.
 * @property {"readonly" | "editable"} [tableType] - The type of the table (readonly or editable).
 */
interface Table extends TableConstructorProps {
  tableType?: 'readonly' | 'editable';
}

/**
 * @function Table
 * @description A functional React component for rendering a customizable table.
 * @param {Table} props - Component props.
 * @returns {React.ReactElement} - A table component.
 */
export const Table: React.FC<Table> = ({
  columns,
  data,
  addcolumn,
  title,
  titlePosition = 'center',
  tableType = 'readonly',
  ...props
}) => {
  /**
   * @function ths
   * @description Map columns to table headers.
   * @returns {React.ReactElement[]} - An array of table header elements.
   */
  const ths = columns.map((th) => <th key={th.name}>{th.name}</th>);

  /**
   * @function rowsEditable
   * @description Map data items to table rows for editable tables.
   * @param {number} itemIndex - Index of the current data item.
   * @returns {React.ReactElement[]} - An array of table cell elements for editable tables.
   */
  const rowsEditable = (itemIndex: number) =>
    columns.map((row) => <td key={row.name}>{row.render(itemIndex)}</td>);

  /**
   * @function rowsReadOnly
   * @description Map data items to table rows for readonly tables.
   * @param {Object} item - The current data item.
   * @returns {React.ReactElement[]} - An array of table cell elements for readonly tables.
   */
  const rowsReadOnly = (item: any) =>
    columns.map((row) => <td key={row.name}>{row.render(item)}</td>);

  return (
    <Flex direction={'column'} gap={20}>
      {/* Render the table title if provided */}
      {title && <Flex justify={titlePosition}>{title}</Flex>}

      {/* Render the MantineTable component with props */}
      <MantineTable {...props}>
        <thead>
          {/* Render table headers */}
          <tr>{ths}</tr>
        </thead>
        {tableType === 'readonly' && (
          <tbody>
            {/* Map data items to readonly table rows */}
            {data.map((item, index: number) => (
              <tr key={index}>{rowsReadOnly(item)}</tr>
            ))}
          </tbody>
        )}
        {tableType === 'editable' && (
          <tbody>
            {/* Map data items to editable table rows */}
            {data.map((_, itemIndex: number) => (
              <tr key={itemIndex}>{rowsEditable(itemIndex)}</tr>
            ))}
          </tbody>
        )}
      </MantineTable>

      {/* Render the custom addcolumn if tableType is "editable" */}
      {tableType === 'editable' && addcolumn}
    </Flex>
  );
};
