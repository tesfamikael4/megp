import React from 'react';

export function EntityLayout({ children }): React.ReactElement {
  return <div className="flex gap-4">{children}</div>;
}
