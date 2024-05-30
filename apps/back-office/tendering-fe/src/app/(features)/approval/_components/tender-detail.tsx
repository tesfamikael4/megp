import React from 'react';
import { Table } from '@mantine/core';

export default function TenderDetail({ tender }: any) {
  return (
    <div>
      <div>
        <Table withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-2/6">
                Name
              </Table.Td>
              <Table.Td>{tender?.name}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-2/6">
                Description
              </Table.Td>
              <Table.Td>{tender?.description}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-2/6">
                Procurment Referance
              </Table.Td>
              <Table.Td>{tender?.procurementReferenceNo}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-2/6">
                Budget Amount
              </Table.Td>
              <Table.Td>{tender?.budgetAmount}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-2/6">
                Budget Amount Currency
              </Table.Td>
              <Table.Td>{tender?.budgetAmountCurrency}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-2/6">
                Market Estimate
              </Table.Td>
              <Table.Td>{tender?.marketEstimate}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-200 font-semibold w-2/6">
                Market Estimate Currency
              </Table.Td>
              <Table.Td>{tender?.marketEstimateCurrency}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
