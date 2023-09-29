import { Box, Button, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import classes from './sidebar.module.scss';

import { Section } from '@megp/core-fe';
import { useState } from 'react';
import { BusinessClassification } from './BusinessClassification';
import { BusinessLicense } from './BusinessLicense';
import { CommercialRegistration } from './CommercialRegistration';
import { CompetencyCertficate } from './CompetencyCertficate';

import ReviewByTeamLeaderPage from '../body/ReviewByTeamLeader';
import ReviewVendorRequest from '../body/ReviewVendorRequest';

export default function SidebarPage() {
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
    // onItemClick(linkName); // Call onItemClick with the link name
    setActiveLink(linkName); // Set the active link
    setActiveComponent(linkName); // Set the active component
  };

  const response = { data: { taskHandler: { task: { taskType: {} } } } };
  console.log('responsee');
  console.log(response.data);

  let componentToRender: React.ReactNode = null; // Explicitly specify React.ReactNode as the type

  // Determine which component to render based on response.data.type
  if (response.data && response.data.taskHandler.task.taskType === 'ISR') {
    componentToRender = <ReviewVendorRequest />;
  } else if (
    response.data &&
    response.data.taskHandler.task.taskType === 'APPROVAL'
  ) {
    componentToRender = <ReviewByTeamLeaderPage />;
  } else {
    componentToRender = <ReviewVendorRequest />;
  }

  return (
    <div className={classes.formWrapper}>
      <div className={classes.completed}>
        <Section title="BPM Completed Tasks" collapsible={false}>
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
                  {/* <Carousel
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
                      onClick={() =>
                        handleButtonClick('BusinessClassification')
                      }
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
                  </Carousel> */}
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
      <div className={classes.current}>
        <Section title="Current task" collapsible={false}>
          {componentToRender}
        </Section>
      </div>
    </div>
  );
}
