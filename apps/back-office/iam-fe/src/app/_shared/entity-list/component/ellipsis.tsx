import { useState } from 'react';

type EllipsisProps = {
  text: string;
};

export default function Ellipsis(props: EllipsisProps) {
  const [showMore, setShowMore] = useState(false);
  return props.text == null || undefined ? (
    <></>
  ) : props.text?.toString().length <= 250 ? (
    <>{props.text}</>
  ) : showMore ? (
    <>
      {props.text}{' '}
      <span
        className="text-slate-400 hover:cursor-pointer"
        onClick={() => setShowMore(false)}
      >
        {' '}
        see less
      </span>
    </>
  ) : (
    <>
      {props.text?.toString().slice(0, 250)}
      <span
        className="text-slate-400	hover:cursor-pointer"
        onClick={() => setShowMore(true)}
      >
        {' '}
        . . . see more
      </span>
    </>
  );
}
