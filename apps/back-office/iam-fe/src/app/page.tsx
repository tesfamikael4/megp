import Link from 'next/link';
import styles from './page.module.scss';
export default function Home() {
  return (
    <main>
      <Link href="/dashboard" className="text-blue-900">
        GO to Dashboard page
      </Link>
    </main>
  );
}
