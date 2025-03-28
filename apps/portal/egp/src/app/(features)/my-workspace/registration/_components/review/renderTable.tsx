import { Box, Button, Table, Text } from '@mantine/core';
import tableClasses from './table.module.scss';
import {
  addSpacesToCamelCase,
  formatDateTimeFromString,
  isDate,
} from './utils';

const TableCell = ({ value }) => <Table.Td>{value}</Table.Td>;

const renderArrayCell = (cellValue) => (
  <Table.Td>
    <ul>
      {cellValue.map((value, index) => (
        <li key={index}>{value}</li>
      ))}
    </ul>
  </Table.Td>
);

const renderObjectCell = (cellValue) => (
  <Table.Td>
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
            <TableCell key={index} value={value} />
          ))}
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.Td>
);

const renderCell = (header, item, open, setUrl, userId) => {
  const cellValue = item[header.name ?? header];

  if (header.format) {
    return <TableCell value={cellValue} />;
  }

  if (Array.isArray(cellValue)) {
    return renderArrayCell(cellValue);
  }

  if (typeof cellValue === 'object' && cellValue !== null) {
    return renderObjectCell(cellValue);
  }

  if (
    (header.name ?? header) === 'isDefualt' ||
    (header.name ?? header) === 'authorityToAppointGov'
  ) {
    return (
      <>
        <Table.Td>{cellValue ? 'Yes' : 'No'}</Table.Td>
      </>
    );
  }
  if ((header.name ?? header) === 'type') {
    return <Table.Td>{cellValue?.toUpperCase()}</Table.Td>;
  }
  if (
    (header.name ?? header) === 'share' ||
    (header.name ?? header) === 'votingRights'
  ) {
    return (
      <>
        <Table.Td>{cellValue + '%'}</Table.Td>
      </>
    );
  }
  if ((header.name ?? header) === 'certificateUrl') {
    return (
      <>
        <Table.Td>
          {cellValue && (
            <Button
              onClick={() => {
                open && open();
                setUrl &&
                  setUrl({
                    url: `${process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api'}/upload/get-file/preferential-documents/${cellValue}`,
                    filename: cellValue,
                  });
              }}
            >
              View
            </Button>
          )}
        </Table.Td>
      </>
    );
  }

  return (
    <Table.Td>
      {typeof cellValue === 'string' && isDate(cellValue)
        ? formatDateTimeFromString(cellValue, true) || 'N/A'
        : typeof cellValue === 'boolean'
          ? JSON.stringify(cellValue)
          : cellValue}
    </Table.Td>
  );
};

export function renderTable(
  data,
  filterColumns,
  selected,
  open?: any,
  setUrl?: any,
  userId?: any,
) {
  if (data.length === 0) {
    return null; // No data to display in the table
  }

  const headers = Object.keys(data[0]);

  return (
    <Table.ScrollContainer
      minWidth={400}
      styles={{
        scrollContainer: {
          maxWidth: `100%`,
        },
      }}
    >
      <Table className={`${tableClasses}`} striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {(filterColumns[selected] || headers).map((header) => {
              if (header === 'id' || header === 'serviceId') return null;
              return (
                <Table.Th key={header.name ?? header}>
                  <Text
                    truncate
                    w={150}
                    title={addSpacesToCamelCase(
                      header.displayName ?? header.name ?? header,
                    )}
                  >
                    {addSpacesToCamelCase(
                      header.displayName ?? header.name ?? header,
                    )}
                  </Text>
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item, index) => (
            <Table.Tr key={index}>
              {(filterColumns[selected] || headers).map((header) => {
                if (header === 'id' || header === 'serviceId') return null;
                return renderCell(header, item, open, setUrl, userId);
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
