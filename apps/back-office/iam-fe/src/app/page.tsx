'use client';
import Link from 'next/link';
import {
  CollectionQuery,
  encodeCollectionQuery,
  decodeCollectionQuery,
} from '@megp/entity';
import { logger } from '@megp/core-fe';
export default function Home() {
  // Example usage
  const query: CollectionQuery = {
    select: [
      'id',
      'name',
      'age',
      'city',
      'department',
      'COUNT(*)',
      'roles',
      'profile',
      'isActive',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'createdBy',
      'updatedBy',
      'deletedBy',
    ],
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

  const encodedQuery = encodeCollectionQuery(query);
  const en = encodeURIComponent(encodedQuery);
  logger.log('Encoded Query:', en, en.length);
  logger.log('Encoded Query:', encodedQuery, encodedQuery.length);

  const de = decodeURIComponent(en);

  const decodedQuery = decodeCollectionQuery(de);
  logger.log('Decoded Query:', decodedQuery);

  return (
    <main>
      <Link href="/dashboard" className="text-blue-900">
        GO to Dashboard page
      </Link>
    </main>
  );
}
