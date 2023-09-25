'use client';

import 'react-international-phone/style.css';
import {
  defaultCountries,
  FlagEmoji,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import { Box, Flex, Menu, Text, TextInput } from '@mantine/core';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

interface PhoneInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: any;
  className?: string;
  disableValidation?: boolean;
}

export default function Phone(props: PhoneInputProps) {
  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'mw',
      value: props.value,
      countries: defaultCountries,
      onChange: (data) => {
        props.onChange(data.phone);
      },
    });

  const isPhoneValid = (phoneNum: string): boolean => {
    try {
      if (props.disableValidation) return true;
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phoneNum));
    } catch (error) {
      return false;
    }
  };
  const isValid = isPhoneValid(phone);

  return (
    <>
      <Text fw="500" size="sm">
        {props.label}
      </Text>
      <Flex>
        <Menu
          shadow="md"
          styles={{
            dropdown: {
              maxHeight: '300px',
              overflowY: 'auto',
            },
          }}
          width={200}
          withArrow
        >
          <Menu.Target>
            <Box className="cursor-pointer">
              <FlagEmoji
                iso2={country}
                size={35}
                style={{ marginRight: '8px' }}
              />
            </Box>
          </Menu.Target>
          <Menu.Dropdown>
            {defaultCountries.map((c) => {
              const selectedCountry = parseCountry(c);
              return (
                <Menu.Item
                  key={selectedCountry.iso2}
                  onClick={() => setCountry(selectedCountry.iso2)}
                  value={selectedCountry.iso2}
                >
                  <Flex>
                    <FlagEmoji
                      iso2={selectedCountry.iso2}
                      style={{ marginRight: '8px' }}
                    />
                    <Text>{selectedCountry.name}</Text>
                    <Text color="gray">+{selectedCountry.dialCode}</Text>
                  </Flex>
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>

        <TextInput
          className={props.className ? props.className : 'w-full'}
          error={!isValid && 'Invalid Phone Number'}
          onChange={handlePhoneValueChange}
          placeholder={props.placeholder}
          ref={inputRef}
          type="tel"
          value={phone}
        />
      </Flex>
    </>
  );
}
