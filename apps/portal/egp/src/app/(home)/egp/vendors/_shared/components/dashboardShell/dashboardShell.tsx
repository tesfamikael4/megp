import React, { useState } from 'react';
import styles from './dashboardShell.module.css';

interface AppShellProps {
  header?: (appShellState: AppShellState) => React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: (appShellState: AppShellState) => React.ReactNode;
  asidebar?: (appShellState: AppShellState) => React.ReactNode;
  state?: (appShellState: AppShellState) => React.ReactNode;
}

interface PageInfo {
  name: string;
  description: string;
  pageIcon: string;
}

interface AppShellState {
  sidebarVisible: boolean;
  asidebarVisible: boolean;
  pageInfo: PageInfo;
  toggleSidebarVisible: () => void;
  toggleAsidebarVisible: () => void;
  getPageInfo: (pageInfo: PageInfo) => void;
}

export const DashboardAppShell: React.FC<AppShellProps> = ({
  header,
  children,
  footer,
  sidebar,
  asidebar,
  state,
}) => {
  const [appShellState, setAppShellState] = useState<AppShellState>(() => ({
    sidebarVisible: true,
    asidebarVisible: false,
    pageInfo: {
      name: ' ',
      description: ' ',
      pageIcon: ' ',
    },
    toggleSidebarVisible: () => {
      setAppShellState((prevState) => ({
        ...prevState,
        sidebarVisible: !prevState.sidebarVisible,
      }));
    },
    toggleAsidebarVisible: () => {
      setAppShellState((prevState) => ({
        ...prevState,
        asidebarVisible: !prevState.asidebarVisible,
      }));
    },
    getPageInfo: (pageInfo) => {
      setAppShellState((prevState) => ({
        ...prevState,
        pageInfo,
      }));
    },
  }));

  return (
    <div className={styles.appshell}>
      {header && (
        <header
          className={
            appShellState.sidebarVisible ? styles.header : styles.headerFull
          }
        >
          {header(appShellState)}
        </header>
      )}
      <div className={styles.container}>
        {sidebar && appShellState.sidebarVisible && (
          <aside className={styles.sidebar}>{sidebar(appShellState)}</aside>
        )}

        {children && (
          <main
            className={
              appShellState.sidebarVisible ? styles.main : styles.mainFull
            }
          ></main>
        )}
        {asidebar && appShellState.asidebarVisible && (
          <aside className={styles.asidebar}>
            <section className={styles.asidebarBox}>
              {asidebar(appShellState)}
            </section>
          </aside>
        )}
      </div>
      {footer && (
        <footer
          className={
            appShellState.sidebarVisible ? styles.footer : styles.footerFull
          }
        >
          {footer}
        </footer>
      )}
    </div>
  );
};
