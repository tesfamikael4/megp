'use client';

import {
  Anchor,
  Breadcrumbs,
  Container,
  ContainerProps,
  Space,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { FC, ReactNode } from 'react';

import style from './pagecontainer.module.scss';
type PageContainerProps = {
  children: ReactNode;
  title: string;
  items?: { label: string; href: string }[];
} & Pick<ContainerProps, 'fluid'>;

export const PageContainer: FC<PageContainerProps> = ({
  children,
  title,
  items,
  fluid = true,
}) => {
  const theme = useMantineTheme();
  const titleColor = theme.colorScheme === 'dark' ? 'gray' : 'dark';

  return (
    <Container fluid={fluid} className={style.container}>
      {items && items.length > 0 ? (
        <Breadcrumbs>
          {items.map((item) => (
            <Anchor key={item.label} href={item.href}>
              {item.label}
            </Anchor>
          ))}
        </Breadcrumbs>
      ) : null}

      {/* <Title order={4} color={titleColor}>
				{title}
			</Title> */}

      {children}
    </Container>
  );
};
