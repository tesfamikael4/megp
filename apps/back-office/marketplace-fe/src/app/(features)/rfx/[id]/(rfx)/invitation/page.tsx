'use client';
import React, { useState } from 'react';
import { Flex } from '@mantine/core';
import { Items } from '../../../_components/item/items';
import { Section } from '@megp/core-fe';

export default function InvitationPage() {
  return (
    <Flex className="gap-4">
      <Section title="Items" collapsible={false}>
        <Items layout="partition" viewMode="list" />
      </Section>
    </Flex>
  );
}
