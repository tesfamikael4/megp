'use client';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Flex,
  Box,
  Divider,
  Select,
  Accordion,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from 'supertokens-web-js/recipe/emailpassword';
import { doesEmailExist } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import Image from 'next/image';
import countries from './countries';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import styles from './page.module.scss';

const schema = z.object({
  name: z.string().min(1, { message: 'This field is required.' }),
  formOfBusiness: z.string({ required_error: 'This field is required' }),
  businessOrigin: z.string({ required_error: 'This field is required' }),
  country: z.string({ required_error: 'This field is required' }),
  phone: z.string().min(1, { message: 'This field is required.' }),
  district: z.string().optional(),
  securityQuestion1: z.object({
    question: z.string({ required_error: 'This field is required' }),
    answer: z.string().min(1, { message: 'This field is required.' }),
  }),
  securityQuestion2: z.object({
    question: z.string({ required_error: 'This field is required' }),
    answer: z.string().min(1, { message: 'This field is required.' }),
  }),
  securityQuestion3: z.object({
    question: z.string({ required_error: 'This field is required' }),
    answer: z.string().min(1, { message: 'This field is required.' }),
  }),
  email: z
    .string()
    .min(1, { message: 'This field is required.' })
    .email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(1, { message: 'This field is required.' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-zA-Z]/, {
      message: 'Password must have at least one alphabet character',
    })
    .regex(/[0-9]/, { message: 'Password must have at least one number' }),
});

type FormSchema = z.infer<typeof schema>;

const SignUpPage = () => {
  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  // Variables
  const formOfBuisness = [
    { value: 'soleProprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'singleMemberCompany', label: 'Single Member Company' },
    { value: 'privateLimitedCompany', label: 'Private Limited Company' },
    { value: 'publicLimitedCompany', label: 'Public Limited Company' },
    { value: 'stateOwnedCompany', label: 'State Owned Company' },
    { value: 'forignCompany', label: 'Foreign Company' },
  ];

  const securityQuestion = [
    { value: '1', label: "What is your mother's maiden name?" },
    { value: '2', label: 'What is your favorite movie?' },
    { value: '3', label: "What was your favourite school teacher's name?" },
  ];

  const businessOrigin = watch('businessOrigin');

  // State
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const [emailExists, setEmailExists] = React.useState(false);
  const [accordionValue, setAccordionValue] = React.useState<string[]>([
    'basicInformation',
  ]);
  const [securityQuestions, setSecurityQuestions] =
    React.useState(securityQuestion);

  //Hooks
  React.useEffect(() => {
    if (businessOrigin === 'local') {
      setValue('country', 'Malawi');
    }
  }, [businessOrigin, setValue]);

  // Functions
  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      setIsSigningUp(true);
      console.log('email exist chekc passed');
      let response = await signUp({
        formFields: [
          {
            id: 'email',
            value: data.email,
          },
          {
            id: 'password',
            value: data.password,
          },
        ],
      });
      router.push('/signin');
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        //this may be a custom error message sent from the API by you.
        notifications.show({
          title: 'Error',
          message: err.message,
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Oops! Something went wrong!',
          color: 'red',
        });
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  async function checkEmail(email: string) {
    try {
      let response = await doesEmailExist({
        email,
      });
      setEmailExists(response.doesExist);
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    }
  }

  return (
    <Container className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper withBorder className={styles.paper_wrapper}>
          <Flex direction={'column'}>
            <Box className={styles.intro_wrapper}>
              <Image
                src="/ppda.png"
                alt="Malawi Republic"
                width={100}
                height={100}
                className={styles.image_style}
              />
              <Title
                className={styles.title}
                styles={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 800,
                })}
              >
                Welcome to eGP Malawi
              </Title>
              <Divider my="sm" />
              <p className={styles.welcome_content}>
                The eGP Malawi Platform is a web-based, collaborative system to
                manage the full lifecycle of a tendering and contract management
                process, for both government agencies and suppliers. It offers a
                secure, interactive, dynamic environment for procurements of any
                nature, complexity or value, enforcing compliance to
                regulations, and encouraging recognized best practices.
              </p>
            </Box>
            <Paper
              className={styles.form_wrapper}
              styles={{ root: { backgroundColor: 'rgb(243 244 246)' } }}
            >
              <Box>
                <Title
                  styles={(theme) => ({
                    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                    fontWeight: 850,
                  })}
                  className={styles.title}
                >
                  Sign Up
                </Title>

                <Text color="dimmed" className={styles.title}>
                  Already have an account?{' '}
                  <Link href="/auth/login" className={styles.sign_in}>
                    Sign In
                  </Link>
                </Text>
                <Accordion
                  className={styles.accordion}
                  multiple
                  value={accordionValue}
                  onChange={setAccordionValue}
                  variant="contained"
                  chevronPosition="left"
                  styles={{
                    content: {
                      gap: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                    },
                  }}
                >
                  <Accordion.Item value="basicInformation">
                    <Accordion.Control>Basic Information</Accordion.Control>
                    <Accordion.Panel py={10}>
                      <TextInput
                        label="Name of Business/Company"
                        placeholder="Name of Business/Company"
                        error={errors.name?.message}
                        {...register('name')}
                        withAsterisk
                      />
                      <Controller
                        control={control}
                        name="formOfBusiness"
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            data={formOfBuisness}
                            label="Form of Business"
                            placeholder="Form of Business"
                            nothingFound="No options"
                            value={value}
                            onChange={onChange}
                            name={name}
                            error={errors.formOfBusiness?.message}
                            searchable
                            withAsterisk
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="businessOrigin"
                        render={({ field: { value, name, onChange } }) => (
                          <Select
                            data={[
                              { value: 'local', label: 'Local' },
                              { value: 'foreign', label: 'Foreign' },
                            ]}
                            label="Business/Company Origin"
                            placeholder="Business/Company Origin"
                            value={value}
                            name={name}
                            onChange={onChange}
                            error={errors.businessOrigin?.message}
                            withAsterisk
                          />
                        )}
                      />
                      {businessOrigin === 'local' && (
                        <TextInput
                          label="District"
                          placeholder="District"
                          {...register('district')}
                          withAsterisk
                          required
                        />
                      )}
                      <Controller
                        control={control}
                        name="country"
                        render={({
                          field: { value, name, onBlur, onChange },
                        }) => (
                          <Select
                            label="Country"
                            placeholder="Country"
                            searchable
                            nothingFound="No options"
                            data={countries.map((country) => ({
                              label: country.name,
                              value: country.name,
                            }))}
                            value={value}
                            disabled={businessOrigin === 'local'}
                            name={name}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={errors.country?.message}
                            withAsterisk
                          />
                        )}
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item value="accountInformation">
                    <Accordion.Control>Account Information</Accordion.Control>
                    <Accordion.Panel>
                      <TextInput
                        label="Mobile Phone"
                        placeholder="Your mobile phone"
                        error={errors.phone?.message}
                        {...register('phone')}
                        withAsterisk
                      />
                      <TextInput
                        label="Email"
                        placeholder="Your email"
                        error={
                          errors.email?.message ||
                          (emailExists ? 'This email already exists' : '')
                        }
                        onBlurCapture={(event) =>
                          checkEmail(event.currentTarget.value)
                        }
                        {...register('email')}
                        withAsterisk
                      />
                      <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        error={errors.password?.message}
                        {...register('password')}
                        withAsterisk
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item value="securityQuestions">
                    <Accordion.Control>Account Recovery</Accordion.Control>
                    <Accordion.Panel>
                      <Controller
                        control={control}
                        name="securityQuestion1.question"
                        render={({ field: { value, name, onChange } }) => (
                          <Select
                            label={`Security Question 1`}
                            placeholder={`Select Security Question 1`}
                            searchable
                            nothingFound="No options"
                            data={securityQuestions}
                            onChange={onChange}
                            value={value}
                            name={name}
                            error={errors.securityQuestion1?.question?.message}
                            withAsterisk
                          />
                        )}
                      />
                      <TextInput
                        label={`Security Answer 1`}
                        placeholder={`Security Answer 1`}
                        {...register('securityQuestion1.answer')}
                        error={errors.securityQuestion1?.answer?.message}
                        withAsterisk
                      />

                      <Controller
                        control={control}
                        name="securityQuestion2.question"
                        render={({ field: { value, name, onChange } }) => (
                          <Select
                            label={`Security Question 2`}
                            placeholder={`Select Security Question 2`}
                            searchable
                            nothingFound="No options"
                            data={securityQuestions}
                            onChange={onChange}
                            value={value}
                            name={name}
                            error={errors.securityQuestion2?.question?.message}
                            withAsterisk
                          />
                        )}
                      />
                      <TextInput
                        label={`Security Answer 2`}
                        placeholder={`Security Answer 2`}
                        {...register('securityQuestion2.answer')}
                        error={errors.securityQuestion2?.answer?.message}
                        withAsterisk
                      />

                      <Controller
                        control={control}
                        name="securityQuestion3.question"
                        render={({ field: { value, name, onChange } }) => (
                          <Select
                            label={`Security Question 3`}
                            placeholder={`Select Security Question 3`}
                            searchable
                            nothingFound="No options"
                            data={securityQuestions}
                            onChange={onChange}
                            value={value}
                            name={name}
                            error={errors.securityQuestion3?.question?.message}
                            withAsterisk
                          />
                        )}
                      />
                      <TextInput
                        label={`Security Answer 3`}
                        placeholder={`Security Answer 3`}
                        {...register('securityQuestion3.answer')}
                        error={errors.securityQuestion3?.answer?.message}
                        withAsterisk
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
                <Flex className={styles.sign_up_wrapper}>
                  <Button
                    type="submit"
                    className={styles.sign_up_button}
                    loading={isSigningUp}
                    onClick={() => setEmailExists(false)}
                  >
                    Sign up
                  </Button>
                </Flex>
              </Box>
            </Paper>
          </Flex>
        </Paper>
      </form>
    </Container>
  );
};

export default SignUpPage;
