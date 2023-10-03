'use client';
import Link from 'next/link';
import {
  CollectionQuery,
  encodeCollectionQuery,
  decodeCollectionQuery,
} from '@megp/entity';
export default function Home() {
  // Example usage:
  const query: CollectionQuery = {
    select: ['id', 'name'],
    where: [
      [{ column: 'age', value: 30, operator: '>=' }],
      [{ column: 'city', value: 'New York', operator: '=' }],
    ],
    take: 10,
    skip: 0,
    orderBy: [{ column: 'name', direction: 'asc' }],
    includes: ['roles', 'profile'],
    groupBy: ['department'],
    having: [[{ column: 'COUNT(*)', value: 5, operator: '>' }]],
    count: true,
  };

  const queryString = encodeCollectionQuery(query);

  // Example usage:
  // const queryString =
  //   'select=id,name&where=(age>=30 AND city=New%20York) OR (city=San%20Francisco)&take=10&skip=0&orderBy=name:asc&includes=roles,profile&groupBy=department&having=(COUNT(*)>5)&count=true';

  const parsedQuery = decodeCollectionQuery(queryString);
  console.log(queryString);
  console.log(parsedQuery);
  console.log(JSON.stringify(parsedQuery));

  return (
    <main>
      <Link href="/dashboard" className="text-blue-900">
        GO to Dashboard page
      </Link>
    </main>
  );
}
