'use client';
import { ProcurementRequisition } from '@/models/procurement-requsition';
import {
  IconCategory,
  IconCircleCheckFilled,
  IconEye,
  IconEyeFilled,
  IconFolderOpen,
  IconStack2,
} from '@tabler/icons-react';
import React from 'react';

type DetailPRListProps = {
  procurementRequisition: ProcurementRequisition;
  isDetailOpen?: boolean;
  PRType: 'Open' | 'Closed';
  PRStage: string;
  PRCategory: string;
  onClickShowPrDetail: (id: string) => void;
  onClickSelectedPr: (id: string) => void;
  isSelectedPr?: boolean;
};

export default function DetailPRList({
  procurementRequisition,
  PRType,
  PRCategory,
  PRStage,
  isDetailOpen,
  isSelectedPr,
  onClickShowPrDetail,
  onClickSelectedPr,
}: DetailPRListProps) {
  return (
    <div className="w-full flex gap-3 items-start justify-start p-2 border-b border-gray-200 cursor-pointer ">
      <div className="pt-2">
        {isSelectedPr ? (
          <button onClick={() => onClickSelectedPr(procurementRequisition.id)}>
            <IconCircleCheckFilled className="w-full" />
          </button>
        ) : (
          <button className="w-6 h-6 rounded-full border-2 border-gray-200"></button>
        )}
      </div>
      <div className="w-full flex flex-col items-start gap-2">
        <p className="text-base font-medium">{procurementRequisition.name}</p>
        <p className="text-sm">{procurementRequisition.description}</p>
        <div className="w-full flex px-3 py-2 gap-3 justify-between items-center bg-[#F4F4FF] rounded-md">
          <div className="flex gap-3 justify-between items-center">
            <div className="flex gap-1">
              <IconFolderOpen className="w-4" />
              <p>{PRType}</p>
            </div>
            <div className="flex gap-1">
              <IconStack2 className="w-4" />
              <p>{PRStage}</p>
            </div>
            <div className="flex gap-1">
              <IconCategory className="w-4" />
              <p>{PRCategory}</p>
            </div>
          </div>
          <button
            className="w-10 h-10 rounded bg-gray-200 flex justify-center items-center cursor-pointer"
            onClick={() => onClickShowPrDetail(procurementRequisition.id)}
          >
            {isDetailOpen ? (
              <IconEyeFilled className="w-6 fill-gray-900" />
            ) : (
              <IconEye className="w-6 stroke-gray-900" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
