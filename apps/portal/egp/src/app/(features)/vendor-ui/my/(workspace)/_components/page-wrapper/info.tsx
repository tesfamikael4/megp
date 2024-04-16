import { Text } from '@mantine/core';
import React, { memo } from 'react';

interface InfoProps {
  text?: string;
}

const PageInfo: React.FC<InfoProps> = memo(({ text }) => {
  return (
    <React.Fragment>
      {text && (
        <div className="px-4">
          <Text fz={14} c="#37415199">
            {text}
          </Text>
        </div>
      )}
    </React.Fragment>
  );
});
PageInfo.displayName = 'PageInfo';
export default PageInfo;
