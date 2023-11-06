'use client';
import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Divider,
  Select,
} from '@mantine/core';
import z from 'zod';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../../context/auth.context';

const schema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
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
interface Params {
  mode: 'new' | 'update' | 'reset-password';
  setContent?: React.Dispatch<React.SetStateAction<'content1' | 'content2'>>;
  setResponse?: React.Dispatch<React.SetStateAction<any>>;
}

export function ChangeSecurity({
  mode,
  setContent,
  setResponse,
}: Params): JSX.Element {
  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
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
  const { resetPasswordByQue, setSecurityQuestions } = useAuth();

  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSetting, setIsSetting] = useState<boolean>(false);

  //Api calls

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
      try {
        setIsSetting(true);
        const setSecurity = await setSecurityQuestions({
          password: data.password ? data.password : '',
          questions,
        });
        if (!setSecurity) {
          return;
        }
        if (setSecurity.statusCode) {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: 'Incorrect Password.',
          });
        } else if (setSecurity.status) {
          notifications.show({
            title: 'Success',
            color: 'green',
            message: 'Security questions set successfully.',
          });
          reset();
          if (mode === 'new') {
            router.push('/');
          }
        }
      } finally {
        setIsSetting(false);
      }
    } else if (setContent && setResponse) {
      try {
        setIsChecking(true);
        const checkSecurity = await resetPasswordByQue({
          questions,
          username: data.username ? data.username : '',
        });
        if (!checkSecurity) {
          return;
        }
        if (checkSecurity.statusCode === 400) {
          notifications.show({
            title: 'Error',
            color: 'red',
            message: 'Check username or security answers.',
          });
        } else {
          reset();
          setContent('content2');
          setResponse(checkSecurity);
        }
      } finally {
        setIsChecking(false);
      }
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      {mode === 'reset-password' ? (
        <TextInput
          label="Username"
          placeholder="Enter your username"
          required
          {...register('username')}
        />
      ) : (
        <PasswordInput
          label="Password"
          required
          {...register('password')}
          error={errors.password?.message}
          placeholder="********"
        />
      )}
      <Controller
        control={control}
        name="securityQuestion1.question"
        render={({ field: { value, name, onChange } }) => (
          <Select
            data={securityQuestion.filter((question) => {
              return (
                question !== securityQuestion2 && question !== securityQuestion3
              );
            })}
            error={errors.securityQuestion1?.question?.message}
            label="Question 1"
            name={name}
            nothingFoundMessage="No options"
            onChange={onChange}
            placeholder="Select Question 1"
            searchable
            value={value}
            withAsterisk
          />
        )}
      />
      <TextInput
        label="Answer 1"
        placeholder="Answer 1"
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
            data={securityQuestion.filter((question) => {
              return (
                question !== securityQuestion1 && question !== securityQuestion3
              );
            })}
            error={errors.securityQuestion2?.question?.message}
            label="Question 2"
            name={name}
            nothingFoundMessage="No options"
            onChange={onChange}
            placeholder="Select Question 2"
            searchable
            value={value}
            withAsterisk
          />
        )}
      />
      <TextInput
        label="Answer 2"
        placeholder="Answer 2"
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
            data={securityQuestion.filter((question) => {
              return (
                question !== securityQuestion1 && question !== securityQuestion2
              );
            })}
            error={errors.securityQuestion3?.question?.message}
            label="Question 3"
            name={name}
            nothingFoundMessage="No options"
            onChange={onChange}
            placeholder="Select Question 3"
            searchable
            value={value}
            withAsterisk
          />
        )}
      />
      <TextInput
        label="Answer 3"
        placeholder="Answer 3"
        {...register('securityQuestion3.answer')}
        error={errors.securityQuestion3?.answer?.message}
        withAsterisk
      />

      {mode === 'new' && (
        <Button loading={isSetting} mt={15} type="submit">
          <IconDeviceFloppy /> Save
        </Button>
      )}
      {mode === 'update' && (
        <Button
          loading={isSetting}
          mt={15}
          style={{ width: 'fit-content' }}
          type="submit"
        >
          <IconDeviceFloppy /> Save
        </Button>
      )}

      {mode === 'reset-password' && (
        <Button loading={isChecking} mt={15} type="submit">
          Reset Password
        </Button>
      )}
    </form>
  );
}
