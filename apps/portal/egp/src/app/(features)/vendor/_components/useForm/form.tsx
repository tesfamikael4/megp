import {
  useForm as useReactHookForm,
  Control,
  UseFormRegisterReturn,
  RegisterOptions,
  ChangeHandler,
} from 'react-hook-form';

export const useForm = (props) => {
  const useReactHookFormReturn = useReactHookForm(props);

  return useReactHookFormReturn;
};
