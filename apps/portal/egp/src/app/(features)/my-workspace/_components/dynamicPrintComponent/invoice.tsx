/* eslint-disable @next/next/no-img-element */
import { Table } from '@mantine/core';
import { InvoiceData } from '@/models/vendorInvoice';
import './invoice.css';

export default function InvoiceTemplate({
  invoiceData,
}: {
  invoiceData: InvoiceData;
}) {
  const data = [
    {
      itemNo: 1,
      description: 'Office Supplies',
      contractValue: 5000,
      totalLevyAmount: 250,
    },
    {
      itemNo: 2,
      description: 'IT Equipment',
      contractValue: 12000,
      totalLevyAmount: 600,
    },
    // Add more data objects as needed
  ];

  const date = new Date(invoiceData.createdOn);

  // Convert the date to a desired format, e.g., "YYYY-MM-DD HH:mm:ss"
  const invoiceDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const maxRows = 7; // Maximum number of rows to display

  if (data.length > maxRows) {
    data.splice(0, data.length - maxRows); // Remove old rows if more than maxRows
  }

  return (
    <div className="flex flex-col w-full h-full bg-white ">
      {/* Header */}
      <div className="flex items-center flex-col gap-4 p-4 min-h-[15%]">
        <div className="flex w-full items-center gap-2">
          <img
            alt="PPDA-Logo"
            className="w-24"
            src="data:image/png;base64,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"
          />
          <h1 className="text2xl  font-extrabold">
            Public Procurement and <br /> Disposal of Assets Authority
          </h1>
        </div>
        <div className="flex w-full font-bold text-xs">
          Private Bag 383, Lilongwe 3, Phone (265)0887083261 / 0887083262 /
          08870083263
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full py-4  min-h-[60%]">
        <div className="flex justify-between items-end p-4 flex-col gap-4  ">
          <div className="flex w-full items-center justify-center">
            <p className=" text-sm font-bold">
              INVOICE{' '}
              <span className=" text-blue-600">
                #{invoiceData.applicationNo}
              </span>
            </p>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-400 mb-1 font-bold">Bill To:</p>
              <p className="text-sm ml-2 font-semibold">
                {invoiceData.payerName}
              </p>
            </div>
            <div className="flex flex-col"></div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col"></div>
            <div className="flex flex-col">
              <p className="text-xs text-gray-400 mb-1 font-bold">
                Invoice Details:
              </p>
              <p className=" text-xs ml-2 font-semibold">Date: {invoiceDate}</p>
              <p className=" text-xs ml-2 font-semibold">
                For: {invoiceData.serviceName}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full p-4 mt-5">
          <table className="border w-full text-xs font-semibold">
            <thead>
              <tr>
                <th className="border p-2 w-4">Item No</th>
                <th className="border p-2">Description of Procurement</th>
                <th className="border p-2 w-32">Contract Value</th>
                <th className="border p-2 w-40">Total Levy Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{item.itemNo}</td>
                  <td className="border p-2 items-center">
                    {item.description}
                  </td>
                  <td className="border p-2 text-center">
                    {item.contractValue}
                  </td>
                  <td className="border p-2 text-center">
                    {item.totalLevyAmount}
                  </td>
                </tr>
              ))}
              <tr className="w-full">
                <td></td>
                <td></td>
                <td></td>
                <td className="p-2 border text-center">{invoiceData.amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <div className="p-4 flex flex-col justify-end  ml-2 w-full min-h-[25%]">
        <p className="text-sm text-gray-400 mb-2 font-semibold">
          Payment Instruction
        </p>
        <p className="text-xs font-semibold">
          Account name: {invoiceData.payToAccName}
        </p>
        <p className="text-xs font-semibold">
          Bank name: {invoiceData.payToBank}
        </p>
        <p className="text-xs font-semibold mb-3">
          Account number: {invoiceData.payToAccNo}
        </p>

        <p className="text-sm font-bold mb-1">Terms and Conditions</p>
        <p className="text-xs font-semibold">
          In the event that the procuring and disposing entity has failed to
          fulfill its obligation under subregulation (3), the Controlling
          Officer and the Head of Finance shall be liable to a fine prescribed
          in the First Schedule as per Sec.7 (5) of Public Procurement
          Regulations 2020.
        </p>
      </div>
    </div>
  );
}
