import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <Link href="/dashboard" className="text-blue-900">
        GO to Dashboard page
      </Link>
    </div>
  );
}
