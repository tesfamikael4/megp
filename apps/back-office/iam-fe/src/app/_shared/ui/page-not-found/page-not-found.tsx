import {
  Button,
  Container,
  createStyles,
  Image,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import Link from 'next/link';
import * as React from 'react';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 700,
    fontSize: 24,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: 'red',
    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));
export interface PageNotFoundProps {
  message?: string;
}

export function PageNotFound(props: PageNotFoundProps) {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}
      >
        <Image src={''} className={classes.mobileImage} alt="" />

        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text size="lg">
            {props.message ??
              'Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support.'}
          </Text>
          <Link href="/home" passHref>
            <Button
              variant="outline"
              leftIcon={<IconArrowBack />}
              size="md"
              mt="xl"
              className={classes.control}
            >
              Back to home page
            </Button>
          </Link>
        </div>
        <div className="mt-4"></div>
      </SimpleGrid>
    </Container>
  );
}
