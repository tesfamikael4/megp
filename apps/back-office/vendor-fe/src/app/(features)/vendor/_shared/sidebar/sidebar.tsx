import { Carousel } from '@mantine/carousel';
import { Box, Button, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Section } from '@megp/core-fe';
import Link from 'next/link';
import { useState } from 'react';
import { BusinessClassification } from '../../sidebar/BusinessClassification';
import { BusinessLicense } from '../../sidebar/BusinessLicense';
import { CommercialRegistration } from '../../sidebar/CommercialRegistration';
import { CompetencyCertficate } from '../../sidebar/CompetencyCertficate';
import classes from './sidebar.module.scss';

export default function SidebarPage({
  onItemClick,
}: {
  onItemClick: (linkName: string) => void;
}) {
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
      <Section title="BPM Completed Tasks" collapsible={false}>
        <ul className={classes.list}>
          <button
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
                <Carousel height={50} slideSize="33.333333%" align="start">
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
          </button>
          <button
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
          </button>
          <button
            className={`${classes.listItem} ${
              activeLink === 'Revision Process' ? classes.active : ''
            }`}
            onClick={() => handleListItemClick('Revision Process')}
          >
            <Link href="" onClick={() => handleClick('Payment')}>
              Invoice
            </Link>
          </button>
        </ul>
      </Section>
    </div>
  );
}
