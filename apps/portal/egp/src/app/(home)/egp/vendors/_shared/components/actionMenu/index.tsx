import { Menu, Button } from '@mantine/core';
interface ActionMenuProps {
  data: {
    label: string;
    action: () => any;
    icon: React.ReactNode;
  }[];
  renderOpenButton: () => React.ReactNode;
}
const ActionMenu: React.FC<ActionMenuProps> = ({ data, renderOpenButton }) => {
  return (
    <Menu
      shadow="md"
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      withinPortal
    >
      <Menu.Target>{renderOpenButton()}</Menu.Target>

      <Menu.Dropdown>
        {data.map((val, index) => (
          <Menu.Item
            key={index}
            leftSection={val.icon}
            onClick={() => val.action()}
          >
            {val.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
export default ActionMenu;
