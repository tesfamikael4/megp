import styles from './layout.module.scss';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={styles.bod}>ee{children}</section>;
}
