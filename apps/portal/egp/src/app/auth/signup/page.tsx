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
import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doesEmailExist } from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import Image from 'next/image';
import countries from './countries';
import z from 'zod';
import { notifications } from '@mantine/notifications';
import styles from './page.module.scss';
import { signupWithEmailPassword } from '../supertokensUtilities';

const schema = z.object({
  organizationName: z.string().min(1, { message: 'This field is required.' }),
  firstName: z.string().min(1, { message: 'This field is required.' }),
  lastName: z.string().min(1, { message: 'This field is required.' }),
  phone: z.string().min(1, { message: 'This field is required.' }),
  // securityQuestion1: z.object({
  //   question: z.string({ required_error: 'This field is required' }),
  //   answer: z.string().min(1, { message: 'This field is required.' }),
  // }),
  // securityQuestion2: z.object({
  //   question: z.string({ required_error: 'This field is required' }),
  //   answer: z.string().min(1, { message: 'This field is required.' }),
  // }),
  // securityQuestion3: z.object({
  //   question: z.string({ required_error: 'This field is required' }),
  //   answer: z.string().min(1, { message: 'This field is required.' }),
  // }),
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

  const securityQuestion = [
    { value: '1', label: 'What was the name of your first childhood friend?' },
    { value: '2', label: 'In which city did your parents meet?' },
    { value: '3', label: 'What is the manufacturer of your first car?' },
    { value: '4', label: "What is your mother's maiden name?" },
    { value: '5', label: 'What is your favorite movie?' },
    { value: '6', label: "What was your favourite school teacher's name?" },
  ];

  // const securityQuestion1 = watch('securityQuestion1.question');
  // const securityQuestion2 = watch('securityQuestion2.question');
  // const securityQuestion3 = watch('securityQuestion3.question');

  // State
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const [emailExists, setEmailExists] = React.useState(false);
  const [accordionValue, setAccordionValue] = React.useState<string[]>([
    'accountInformation',
  ]);
  const [securityQuestions, setSecurityQuestions] =
    React.useState(securityQuestion);

  // Functions
  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    console.log('Onsubmit called');
    try {
      setIsSigningUp(true);
      let response = await signupWithEmailPassword({
        email: data.email,
        password: data.password,
        organizationName: data.organizationName,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (response.status === 'FIELD_ERROR') {
        response.formFields.map((formField) => {
          if (formField.id === 'email') {
            setEmailExists(true);
          }
        });
      } else {
        router.push('/auth/verification');
      }
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
                <p className={styles.title}>Create Account</p>

                <Text color="dimmed" className={styles.title}>
                  Already have an account?{' '}
                  <Link href="/auth/login" className={styles.sign_in}>
                    Sign In
                  </Link>
                </Text>
                {/* <Accordion
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
                > */}
                {/* <Accordion.Item value="accountInformation">
                    <Accordion.Control>Account Information</Accordion.Control>
                    <Accordion.Panel> */}
                <TextInput
                  label="Name of the Business/Company"
                  placeholder="Name of the Business/Company"
                  className="mt-3"
                  error={errors.organizationName?.message}
                  {...register('organizationName')}
                  withAsterisk
                />
                <Flex direction={'row'} className="gap-2">
                  <TextInput
                    label="First Name"
                    placeholder="First name"
                    className="w-1/2"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                    withAsterisk
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Last name"
                    className="w-1/2"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                    withAsterisk
                  />
                </Flex>
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
                {/* </Accordion.Panel>
                  </Accordion.Item> */}
                {/* <Accordion.Item value="securityQuestions">
                    <Accordion.Control>Account Recovery</Accordion.Control>
                    <Accordion.Panel>
                      <Text>
                        Fill out the security questions below before procceding.
                      </Text>
                      <Divider />
                      <Controller
                        control={control}
                        name="securityQuestion1.question"
                        render={({ field: { value, name, onChange } }) => (
                          <Select
                            label={`Question 1`}
                            placeholder={`Select Question 1`}
                            searchable
                            nothingFound="No options"
                            data={securityQuestion.filter((question) => {
                              return (
                                question.value !== securityQuestion2 &&
                                question.value !== securityQuestion3
                              );
                            })}
                            onChange={onChange}
                            value={value}
                            name={name}
                            error={errors.securityQuestion1?.question?.message}
                            withAsterisk
                          />
                        )}
                      />
                      <TextInput
                        label={`Answer 1`}
                        placeholder={`Answer 1`}
                        {...register('securityQuestion1.answer')}
                        error={errors.securityQuestion1?.answer?.message}
                        withAsterisk
                      />
                      <Divider />
                      <Controller
                        control={control}
                        name="securityQuestion2.question"
                        render={({ field: { value, name, onChange } }) => (
                          <Select
                            label={`Question 2`}
                            placeholder={`Select Question 2`}
                            searchable
                            nothingFound="No options"
                            data={securityQuestion.filter((question) => {
                              return (
                                question.value !== securityQuestion1 &&
                                question.value !== securityQuestion3
                              );
                            })}
                            onChange={onChange}
                            value={value}
                            name={name}
                            error={errors.securityQuestion2?.question?.message}
                            withAsterisk
                          />
                        )}
                      />
                      <TextInput
                        label={`Answer 2`}
                        placeholder={`Answer 2`}
                        {...register('securityQuestion2.answer')}
                        error={errors.securityQuestion2?.answer?.message}
                        withAsterisk
                      />
                      <Divider />
                      <Controller
                        control={control}
                        name="securityQuestion3.question"
                        render={({ field: { value, name, onChange } }) => (
                          <Select
                            label={`Question 3`}
                            placeholder={`Select Question 3`}
                            searchable
                            nothingFound="No options"
                            data={securityQuestion.filter((question) => {
                              return (
                                question.value !== securityQuestion1 &&
                                question.value !== securityQuestion2
                              );
                            })}
                            onChange={onChange}
                            value={value}
                            name={name}
                            error={errors.securityQuestion3?.question?.message}
                            withAsterisk
                          />
                        )}
                      />
                      <TextInput
                        label={`Answer 3`}
                        placeholder={`Answer 3`}
                        {...register('securityQuestion3.answer')}
                        error={errors.securityQuestion3?.answer?.message}
                        withAsterisk
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion> */}
                <Flex className={styles.sign_up_wrapper}>
                  <Button
                    type="submit"
                    className={styles.sign_up_button}
                    loading={isSigningUp}
                    onClick={() => setEmailExists(false)}
                  >
                    Create Account
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
