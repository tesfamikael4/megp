import { IconFolderOpen } from '@tabler/icons-react';
import React from 'react';

const MyInvitationDetailPage = () => {
  return (
    <div>
      {' '}
      <div className="w-full bg-white flex flex-col h-[100vh] justify-center items-center">
        <IconFolderOpen className="w-32 h-16 stroke-1" />
        <p className="text-base font-semibold">No tab selected.</p>
        <p>Please Select a tab from the left first.</p>
      </div>
    </div>
  );
};

export default MyInvitationDetailPage;
