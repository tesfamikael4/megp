'use client';
import React, { useEffect } from 'react';
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
} from '@mantine/core';
import z from 'zod';
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconDeviceFloppy } from '@tabler/icons-react';
import {
  useCheckSecurityQuestionsMutation,
  useSetSecurityQuestionsMutation,
} from '@/store/api/auth/auth.api';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import type { Response } from '@/app/auth/pass-reset-by-que/page';

const schema = z.object({
  username: z.string().optional(),
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
});

type FormSchema = z.infer<typeof schema>;
type props = {
  mode: 'new' | 'update' | 'reset-password';
  setContent?: React.Dispatch<React.SetStateAction<'content1' | 'content2'>>;
  setResponse?: React.Dispatch<React.SetStateAction<Response>>;
};

export default function ChangeSecurity({
  mode,
  setContent,
  setResponse,
}: props) {
  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  // Variables

  const securityQuestion = [
    'What was the name of your first childhood friend?',
    'In which city did your parents meet?',
    'What is the manufacturer of your first car?',
    "What is your mother's maiden name?",
    'What is your favorite movie?',
    "What was your favourite school teacher's name?",
  ];

  const securityQuestion1 = watch('securityQuestion1.question');
  const securityQuestion2 = watch('securityQuestion2.question');
  const securityQuestion3 = watch('securityQuestion3.question');

  const router = useRouter();

  //Api calls

  const [
    setSecurityQuestions,
    {
      isLoading: isSettingSecuirtyQuestions,
      isSuccess: isSetSecurityQuestions,
      error: isSetSecurityQuestionsError,
    },
  ] = useSetSecurityQuestionsMutation();

  const [
    checkSecurityQuestions,
    {
      isLoading: isCheckingSecuirtyQuestions,
      isSuccess: isCheckSecurityQuestionsSuccess,
      error: isCheckSecurityQuestionsError,
    },
  ] = useCheckSecurityQuestionsMutation();

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    const questions = Object.keys({
      securityQuestion1,
      securityQuestion2,
      securityQuestion3,
    }).map((key) => ({
      question: data[key].question,
      answer: data[key].answer,
    }));
    if (mode === 'new' || mode === 'update') {
      await setSecurityQuestions({ questions: questions });
    } else if (mode === 'reset-password') {
      await checkSecurityQuestions({
        questions: questions,
        username: data.username,
      })
        .unwrap()
        .then((res) => {
          setResponse && setResponse(res);
          if (res.status === true) {
            setContent && setContent('content2');
          } else if (res.status === false) {
            notifications.show({
              title: 'Error',
              message:
                'Security question qnswers are not correct. Please correct and try again.',
              color: 'red',
            });
          }
        })
        .catch((err) => {
          notifications.show({
            title: 'Error',
            message: err.message,
            color: 'red',
          });
        });
    }
  };

  useEffect(() => {
    if (isSetSecurityQuestions) {
      notifications.show({
        title: 'Success',
        message: 'Security questions set successfully',
      });
      if (mode == 'new') {
        router.push('/');
      }
      reset({
        securityQuestion1: {
          question: '',
          answer: '',
        },
        securityQuestion2: {
          question: '',
          answer: '',
        },
        securityQuestion3: {
          question: '',
          answer: '',
        },
      });
    } else if (isSetSecurityQuestionsError) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  }, [
    isSetSecurityQuestions,
    isSetSecurityQuestionsError,
    mode,
    reset,
    router,
  ]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {mode == 'reset-password' && (
        <TextInput
          label="Username"
          placeholder="Enter your username"
          required
          {...register('username')}
        />
      )}
      <Controller
        control={control}
        name="securityQuestion1.question"
        render={({ field: { value, name, onChange } }) => (
          <Select
            label={`Question 1`}
            placeholder={`Select Question 1`}
            searchable
            nothingFoundMessage="No options"
            data={securityQuestion.filter((question) => {
              return (
                question !== securityQuestion2 && question !== securityQuestion3
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
            nothingFoundMessage="No options"
            data={securityQuestion.filter((question) => {
              return (
                question !== securityQuestion1 && question !== securityQuestion3
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
            nothingFoundMessage="No options"
            data={securityQuestion.filter((question) => {
              return (
                question !== securityQuestion1 && question !== securityQuestion2
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

      {(mode === 'new' || mode === 'update') && (
        <Button mt={15} type="submit" loading={isSettingSecuirtyQuestions}>
          <IconDeviceFloppy /> Save
        </Button>
      )}

      {mode === 'reset-password' && (
        <Button mt={15} type="submit" loading={isCheckingSecuirtyQuestions}>
          Reset Password
        </Button>
      )}
    </form>
  );
}
