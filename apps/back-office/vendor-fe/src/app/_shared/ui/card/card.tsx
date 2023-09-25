import { Button, Card, Collapse } from '@mantine/core';
import * as React from 'react';
import { useState } from 'react';

type CollapsibleCardProps = {
  dropped?: boolean;
  className?: string;
  title: string | JSX.Element;
  subTitle?: string;
  customAction?: React.ReactNode;
  children: React.ReactNode;
  isOpenedByDefault?: boolean;
  required?: boolean;
};

const CollapsibleCard = (props: CollapsibleCardProps) => {
  const [isDropped, setIsDropped] = useState<boolean>(
    props?.dropped === true
      ? props?.dropped
      : props?.isOpenedByDefault === true
      ? true
      : false,
  );

  return (
    <Card className={props.className} style={{ paddingBottom: 0 }}>
      <Card.Section className="border-b border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-base font-bold">
              {props.title}{' '}
              {props?.required && <span className="text-red-600">*</span>}
            </div>
            <div className="text-xs font-light">{props.subTitle}</div>
          </div>
          <div className="flex">
            {props.customAction && isDropped && (
              <div className="mr-2">{props.customAction}</div>
            )}

            <Button
              className={'px-2 py-1'}
              variant="outline"
              color="#e0f2fe"
              size="xs"
              onClick={() => setIsDropped(!isDropped)}
            >
              {isDropped ? 'collapse' : 'expand'}
            </Button>
          </div>
        </div>
      </Card.Section>

      <Collapse in={isDropped}>
        <>{isDropped && props.children}</>
      </Collapse>
    </Card>
  );
};

export default CollapsibleCard;
