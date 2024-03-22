import { PropsWithChildren } from 'react';
import PageWrapper from './_components/page-wrapper';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <PageWrapper>{children}</PageWrapper>;
};

export default Layout;
