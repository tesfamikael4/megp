import { Button, List, Table, Text } from '@mantine/core';
import { formatDateTimeFromString, isDate } from '.';
import { addSpacesToCamelCase } from './addSpaceToCamelCase';

export function renderTable(
  data,
  filterColumns,
  selected?: any,
  open?: any,
  setUrl?: any,
  userId?: any,
  minWidth?: number,
) {
  if (data.length === 0) {
    return null; // No data to display in the table
  }

  const headers = Object.keys(data[0]);

  return (
    <Table.ScrollContainer minWidth={minWidth ?? 400}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {filterColumns[selected]
              ? filterColumns[selected].map(
                  (header) =>
                    header !== 'id' && (
                      <Table.Th
                        key={header.name}
                        title={addSpacesToCamelCase(
                          header.displayName || header.name,
                        )}
                      >
                        <Text truncate w={150}>
                          {addSpacesToCamelCase(
                            header.displayName || header.name,
                          )}
                        </Text>
                      </Table.Th>
                    ),
                )
              : headers.map(
                  (header) =>
                    header !== 'id' && (
                      <Table.Th
                        key={header}
                        title={addSpacesToCamelCase(header)}
                      >
                        <Text truncate w={150}>
                          {addSpacesToCamelCase(header)}
                        </Text>
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
                      <List spacing="xs" size="sm" center>
                        {cellValue.map((value, index) => (
                          <List.Item key={index}>
                            <Text
                              truncate
                              w={200}
                              title={value ?? JSON.stringify(value)}
                            >
                              {value ?? JSON.stringify(value)}
                            </Text>
                          </List.Item>
                        ))}
                      </List>
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
                            : (header?.name ?? header) === 'share'
                              ? `${cellValue} %`
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
