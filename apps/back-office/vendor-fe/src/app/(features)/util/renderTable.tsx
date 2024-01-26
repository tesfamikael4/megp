import { Box, Button, Chip, Table } from '@mantine/core';
import { formatDateTimeFromString, isDate } from '.';
import tableClasses from '../_components/details-accordion/table.module.scss';
import { addSpacesToCamelCase } from './addSpaceToCamelCase';

export function renderTable(
  data,
  filterColumns,
  selected?: any,
  open?: any,
  setUrl?: any,
  userId?: any,
) {
  if (data.length === 0) {
    return null; // No data to display in the table
  }

  const headers = Object.keys(data[0]);

  return (
    <Table.ScrollContainer minWidth={600}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            {filterColumns[selected]
              ? filterColumns[selected].map(
                  (header) =>
                    header !== 'id' && (
                      <Table.Th key={header.name} className="w-fit">
                        {addSpacesToCamelCase(
                          header.displayName || header.name,
                        )}
                      </Table.Th>
                    ),
                )
              : headers.map(
                  (header) =>
                    header !== 'id' && (
                      <Table.Th key={header} className="w-fit">
                        {addSpacesToCamelCase(header)}
                      </Table.Th>
                    ),
                )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item, index) => (
            <Table.Tr key={index}>
              {(filterColumns[selected]
                ? filterColumns[selected]
                : headers
              ).map((header) => {
                const cellValue = item[header?.name ?? header];

                if (header?.format) {
                  return (
                    <Table.Td key={header?.name ?? header}>
                      {cellValue}
                    </Table.Td>
                  );
                }

                if (Array.isArray(cellValue)) {
                  return (
                    <Table.Td key={header?.name ?? header}>
                      <ul>
                        {cellValue.map((value, index) => (
                          <li key={index}>{value ?? JSON.stringify(value)}</li>
                        ))}
                      </ul>
                    </Table.Td>
                  );
                }

                if (typeof cellValue === 'object' && cellValue !== null) {
                  return (
                    <Table.Td key={header?.name ?? header}>
                      <Table className="inner-table">
                        <Table.Thead>
                          <Table.Tr>
                            {Object.keys(cellValue).map((key) => (
                              <Table.Th key={key}>{key}</Table.Th>
                            ))}
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          <Table.Tr>
                            {Object.values(cellValue).map((value, index) => (
                              <Table.Td key={index}>{value as any}</Table.Td>
                            ))}
                          </Table.Tr>
                        </Table.Tbody>
                      </Table>
                    </Table.Td>
                  );
                }

                if ((header?.name ?? header) !== 'id') {
                  return (
                    <Table.Td key={header?.name ?? header}>
                      {isDate(cellValue)
                        ? formatDateTimeFromString(cellValue, true) || 'N/A'
                        : typeof cellValue === 'boolean'
                          ? JSON.stringify(cellValue)
                          : (header?.name ?? header) === 'certificateUrl'
                            ? cellValue && (
                                <Button
                                  onClick={() => {
                                    open();
                                    setUrl(
                                      `${
                                        process.env.NEXT_PUBLIC_VENDOR_API ??
                                        '/vendors/api/'
                                      }upload/get-file-bo/certificate/${cellValue}/${userId}`,
                                    );
                                  }}
                                >
                                  View
                                </Button>
                              )
                            : cellValue}
                    </Table.Td>
                  );
                }

                return null;
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
