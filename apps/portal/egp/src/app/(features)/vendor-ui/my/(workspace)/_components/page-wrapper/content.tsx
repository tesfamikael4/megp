import { Text } from '@mantine/core';
import React, { memo, PropsWithChildren } from 'react';
import EmptyDataPlaceholder from './empty-data-placeholder';

interface ContentProps extends PropsWithChildren {
  condition?: boolean;
  placeholder?: React.ReactNode;
}

const PageContent: React.FC<ContentProps> = memo(
  ({ condition, placeholder, children }) => {
    return (
      <React.Fragment>
        {condition
          ? children && <div className="p-4">{children}</div>
          : placeholder ?? <EmptyDataPlaceholder />}
      </React.Fragment>
    );
  },
);
PageContent.displayName = 'PageContent';
export default PageContent;
