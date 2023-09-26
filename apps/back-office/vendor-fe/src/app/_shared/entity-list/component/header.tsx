import { Card, Tooltip } from '@mantine/core';
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconX,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFullScreen, toggleFullScreen } from '../store/entity-list.slice';

interface HeaderProps {
  onclose: any;
  title?: string;
}
function Header(props: HeaderProps) {
  const fullScreen: boolean = useSelector(selectFullScreen);
  const dispatch = useDispatch();
  return (
    <Card className="flex   shadow">
      <div className="flex justify-between gap-2 ">
        {' '}
        <div className="text-base font-bold">
          {props?.title ? props?.title : 'New'}
        </div>
        <div className="flex items-center gap-2">
          <Tooltip
            label={fullScreen ? 'Minimize' : 'Full screen'}
            color="sky"
            withArrow
            withinPortal
          >
            <div>
              {fullScreen && (
                <IconArrowsMinimize
                  className="m-0 cursor-pointer"
                  width={20}
                  height={20}
                  color={'gray'}
                  onClick={() => dispatch(toggleFullScreen())}
                />
              )}

              {!fullScreen && (
                <IconArrowsMaximize
                  className="m-0 cursor-pointer"
                  width={20}
                  height={20}
                  color={'gray'}
                  onClick={() => dispatch(toggleFullScreen())}
                />
              )}
            </div>
          </Tooltip>
          <Tooltip label="Close" color="sky" withArrow withinPortal>
            <div>
              <IconX
                className="m-0 cursor-pointer text-primary"
                width={24}
                height={24}
                color={'gray'}
                onClick={props.onclose}
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}

export default Header;
