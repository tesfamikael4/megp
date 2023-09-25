import { Button } from '@mantine/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FileInput } from './file-input';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as React from 'react';

export default {
  title: 'File Input',
  component: FileInput,
} as ComponentMeta<typeof FileInput>;

/* Template */
const Template: ComponentStory<typeof FileInput> = (args) => (
  <FileInput {...args} />
);

const ReactHookTemplate: ComponentStory<typeof FileInput> = (args) => {
  const Form = () => {
    /* Hooks */
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm({
      resolver: yupResolver(
        yup.object({
          fileInput: yup
            .mixed()
            .test(
              'fileSize',
              'File size should not be more than 2MB',
              (value) => {
                if (!value?.length) return true; // attachment is optional
                return value[0]?.size <= 2000000;
              },
            ),
        }),
      ),
    });
    args.reactHookFormRegister = register;
    args.reactHookFormSetValue = setValue;
    args.error = errors?.['fileInput']?.message;

    /* Event handlers */
    const onSubmit = (data: any) => {
      console.log(data);
    };
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FileInput {...args} />
        <Button type="submit" className="my-4 bg-primary">
          Save
        </Button>
      </form>
    );
  };

  return <Form />;
};

const ReactHookMultipleTemplate: ComponentStory<typeof FileInput> = (args) => {
  const Form = () => {
    /* Hooks */
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm({
      resolver: yupResolver(
        yup.object({
          fileInput: yup.array().of(
            yup
              .mixed()
              .test(
                'fileSize',
                'File size should not be more than 2MB',
                (value) => {
                  if (!value?.length) return true; // attachment is optional
                  return value[0]?.size <= 2000000;
                },
              ),
          ),
        }),
      ),
    });
    args.reactHookFormRegister = register;
    args.reactHookFormSetValue = setValue;
    const errorIndex = errors?.['fileInput']?.findIndex(
      (error: any) => error?.message !== undefined,
    );
    args.error = errors?.['fileInput']?.[errorIndex]?.message;

    /* Event handlers */
    const onSubmit = (data: any) => {
      console.log(data);
    };
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FileInput {...args} />
        <Button type="submit" className="my-4 bg-primary">
          Save
        </Button>
      </form>
    );
  };

  return <Form />;
};

/* Stories */
export const Default = Template.bind({});
Default.args = {
  label: 'Profile picture',
  withPreview: true,
};

export const WithNoPreview = Template.bind({});
WithNoPreview.args = {
  ...Default.args,
  withPreview: false,
};

export const Multiple = Template.bind({});
Multiple.args = {
  ...Default.args,
  multiple: true,
};

export const MultipleMaxFileInput = Template.bind({});
MultipleMaxFileInput.args = {
  ...Multiple.args,
  maxNoFileInput: 3,
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  ...Default.args,
  required: true,
  fileFormats: ['jpg', 'mp4', 'pdf'],
  minFileSize: 1000000,
  maxFileSize: 3000000,
};

export const WithReactHookFormDefault = ReactHookTemplate.bind({});
WithReactHookFormDefault.args = {
  ...Default.args,
  name: 'fileInput',
};
WithReactHookFormDefault.parameters = {
  docs: {
    source: {
      code: `
      /* First import the following */
      import { Button } from '@mantine/core';
      import { useForm } from 'react-hook-form';
      import { FileInput } from '@ui';
      import { yupResolver } from '@hookform/resolvers/yup';
      import * as yup from 'yup';

      /* Hooks */
      const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
      } = useForm({
        resolver: yupResolver(
          yup.object({
            fileInput: yup
              .mixed()
              .test(
                'fileSize',
                'File size should not be more than 2MB',
                (value) => {
                  if (!value?.length) return true; // attachment is optional
                  return value[0]?.size <= 2000000;
                }
              ),
          })
        ),
      });

      /* Event handlers */
      const onSubmit = (data: any) => {
        console.log(data);
      };
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <FileInput
        label= {'Profile picture'}
        name= {'fileInput'}
        withPreview= {true}
        reactHookFormRegister = {register}
        reactHookFormSetValue = {setValue}
        error = {errors?.['fileInput']?.message}
      />
          <Button type="submit" className="my-4 bg-primary">
            Save
          </Button>
        </form>
      );`,
      language: 'tsx',
      type: 'auto',
    },
  },
};

export const WithReactHookFormMultiple = ReactHookMultipleTemplate.bind({});
WithReactHookFormMultiple.args = {
  ...Multiple.args,
  name: 'fileInput',
};
WithReactHookFormMultiple.parameters = {
  docs: {
    source: {
      code: `
      /* First import the following */
      import { Button } from '@mantine/core';
      import { useForm } from 'react-hook-form';
      import { FileInput } from '@ui';
      import { yupResolver } from '@hookform/resolvers/yup';
      import * as yup from 'yup';

      /* Hooks */
      const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
      } = useForm({
        resolver: yupResolver(
          yup.object({
            fileInput: yup.array().of(
              yup.mixed().test('fileSize','File size should not be more than 2MB',
                  (value) => {
                    if (!value?.length) return true; // attachment is optional
                    return value[0]?.size <= 2000000;
                  }
                )
            ),
          })
        ),
      });

      const errorIndex = errors?.['fileInput']?.findIndex(
        (error: any) => error?.message !== undefined
      );
  
      /* Event handlers */
      const onSubmit = (data: any) => {
        console.log(data);
      };

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <FileInput
        label= {'Profile picture'}
        name= {'fileInput'}
        withPreview= {true}
        multiple: {true}
        reactHookFormRegister = {register}
        reactHookFormSetValue = {setValue}
        error = {errors?.['fileInput']?.[errorIndex]?.message}
      />
          <Button type="submit" className="my-4 bg-primary">
            Save
          </Button>
        </form>
      );`,
      language: 'tsx',
      type: 'auto',
    },
  },
};
