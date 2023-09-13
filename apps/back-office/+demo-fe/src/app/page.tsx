import Link from 'next/link';
import styles from './page.module.scss';
export default function Home() {
  return (
    <main className={styles.center}>
      <Link href="/dashboard" className="text-blue-900">
        GO to Dashboard page landing
      </Link>
    </main>
  );
}
