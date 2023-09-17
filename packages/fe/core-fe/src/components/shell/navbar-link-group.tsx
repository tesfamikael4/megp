'use client';
import {
  Box,
  Collapse,
  Group,
  ThemeIcon,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colors.gray[0],
      color: theme.black,
      textDecoration: 'none',
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${theme.colors.gray[3]}`,

    '&:hover': {
      backgroundColor: theme.colors.gray[0],
      color: theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },

  active: {
    backgroundColor: theme.colors[theme.primaryColor][1],
    color: theme.black,
    borderRight: `2px solid ${theme.colors[theme.primaryColor][3]}`,
  },
}));

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  link?: string;
  external?: boolean;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  external,
  initiallyOpened,
  links,
}: LinksGroupProps): React.ReactElement {
  const { classes, theme, cx } = useStyles();
  const hasLinks = Array.isArray(links);

  const pathname = usePathname();

  const [opened, setOpened] = useState(initiallyOpened || false);

  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;

  const items = (hasLinks ? links : []).map((l) => (
    <Link
      className={cx(classes.link, {
        [classes.active]: pathname.startsWith(l.link),
      })}
      href={l.link}
      key={l.label}
    >
      {l.label}
    </Link>
  ));

  return (
    <>
      <UnstyledButton<'a' | typeof Link>
        className={cx(classes.control, {
          [classes.active]: pathname.startsWith(link ?? '#'),
        })}
        component={external ? 'a' : Link}
        href={link ?? '#'}
        onClick={() => setOpened((o) => !o)}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon size={30} variant="light">
              <Icon size="1.1rem" />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks ? (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                  : 'none',
              }}
            />
          ) : null}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
