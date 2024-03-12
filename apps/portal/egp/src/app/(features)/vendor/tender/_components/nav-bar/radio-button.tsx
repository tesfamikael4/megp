import { Radio, RadioProps, Text } from '@mantine/core';
interface RadioProps2 extends RadioProps {}
function RadioButton(props: RadioProps2) {
  return (
    <div className="flex items-center gap-1.5">
      <Radio {...props} label="" width={30} miw={20} />

      <div className={Radio.classes.label}>
        <Text
          fz={13}
          fw={400}
          lh={'30px'}
          w={180}
          className="hover:text-green-500 "
          truncate
        >
          {props.label}
        </Text>
      </div>
    </div>
  );
}

export default RadioButton;
