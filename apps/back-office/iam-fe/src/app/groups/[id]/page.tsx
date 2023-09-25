'use client';
import { Box, Group } from '@mantine/core';
import { Section } from '@megp/core-fe';
import Link from 'next/link';
import { useState } from 'react';

export default function GroupPage() {
  const [count, setCount] = useState(0);

  // Function to increment the counter
  const increment = () => {
    setCount(count + 1);
  };

  // Function to decrement the counter
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <Section title="Detail">
      <Group>
        <Link href="/groups">Detail</Link>
        <Link href="/groups/new">New Detail</Link>
      </Group>
      <div>Detail form</div>
      <h1>Counter: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </Section>
  );
}
