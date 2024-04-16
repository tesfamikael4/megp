import { Flex, Text } from '@mantine/core';
import React, { memo } from 'react';

interface ActionsProps {
  actions?: React.ReactNode;
}

const PageActions: React.FC<ActionsProps> = memo(({ actions }) => {
  return (
    <React.Fragment>
      {actions && (
        <Flex className="p-4" justify="flex-end">
          {actions}
        </Flex>
      )}
    </React.Fragment>
  );
});
PageActions.displayName = 'PageActions';
export default PageActions;
