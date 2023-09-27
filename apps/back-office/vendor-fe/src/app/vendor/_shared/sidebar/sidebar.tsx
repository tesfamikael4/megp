import classes from './sidebar.module.scss';
import { Tabs } from '@mantine/core';
import Link from 'next/link';
import { Button, Group, Text, Collapse, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import { CommercialRegistration } from '../../sidebar/CommercialRegistration';
import { useState } from 'react';
import { BusinessClassification } from '../../sidebar/BusinessClassification';
import { BusinessLicense } from '../../sidebar/BusinessLicense';
import { CompetencyCertficate } from '../../sidebar/CompetencyCertficate';
import { Section } from '@megp/core-fe';

export default function SidebarPage({ onItemClick }) {
  const [opened, { toggle }] = useDisclosure(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [activeLink, setActiveLink] = useState(null); // State to track the active link

  const handleButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };
  const handleListItemClick = (link) => {
    setActiveLink(link);
  };

  const handleClick = (linkName) => {
    onItemClick(linkName); // Call onItemClick with the link name
    setActiveLink(linkName); // Set the active link
    setActiveComponent(linkName); // Set the active component
  };

  return (
    <div className={classes.completedTasks}>
      <Section title="BPM Completed Tasks" isCollapsible={false}>
        <ul className={classes.list}>
          <li
            className={`${classes.listItem} ${
              activeLink === 'Business Application' ? classes.active : ''
            }`}
            onClick={() => handleListItemClick('Business Application')}
          >
            <div>
              <Link
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  toggle();
                  handleClick('Business Application');
                }}
                style={{
                  backgroundColor:
                    activeLink === 'Business Application'
                      ? '#d9edf7'
                      : 'transparent',
                }}
              >
                Business Application
              </Link>

              <Collapse in={opened}>
                <Carousel
                  height={50}
                  slideSize="33.333333%"
                  align="start"
                  breakpoints={[
                    { maxWidth: 'md', slideSize: '50%' },
                    { maxWidth: 'sm', slideSize: '100%', slideGap: 0 },
                  ]}
                >
                  <Box>
                    <Button
                      className={classes.button}
                      onClick={() =>
                        handleButtonClick('CommercialRegistration')
                      }
                    >
                      CommercialRegistration
                    </Button>
                  </Box>

                  <Button
                    className={classes.button}
                    onClick={() => handleButtonClick('BusinessClassification')}
                  >
                    Business Classification
                  </Button>

                  <Button
                    className={classes.button}
                    onClick={() => handleButtonClick('BusinessLicense')}
                  >
                    Business License
                  </Button>

                  <Button
                    className={classes.button}
                    onClick={() => handleButtonClick('CompetencyCertficate')}
                  >
                    CompetencyCertficate
                  </Button>
                </Carousel>
              </Collapse>
              {activeComponent === 'CommercialRegistration' && (
                <CommercialRegistration />
              )}
              {activeComponent === 'BusinessClassification' && (
                <BusinessClassification />
              )}
              {activeComponent === 'BusinessLicense' && <BusinessLicense />}
              {activeComponent === 'CompetencyCertficate' && (
                <CompetencyCertficate />
              )}
            </div>
          </li>
          <li
            className={`${classes.listItem} ${
              activeLink === 'Review by team leade' ? classes.active : ''
            }`}
            onClick={() => handleListItemClick('Review by team leade')}
          >
            <Link
              href=""
              onClick={() => handleClick('Review by team leader')}
              style={{
                backgroundColor:
                  activeLink === 'Renewal Process' ? 'yellow' : 'transparent',
              }}
            >
              Review by team leader
            </Link>
          </li>
          <li
            className={`${classes.listItem} ${
              activeLink === 'Revision Process' ? classes.active : ''
            }`}
            onClick={() => handleListItemClick('Revision Process')}
          >
            <Link href="" onClick={() => handleClick('Payment')}>
              Invoice
            </Link>
          </li>
        </ul>
      </Section>
    </div>
  );
}
