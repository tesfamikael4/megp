import { Button, Flex, Textarea } from '@mantine/core';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { GuaranteeRelease } from '@/models/guarantee-release/guarantee-release';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const gauarnteeRequestSchema: ZodType<Partial<GuaranteeRelease>> = z.object({
  remark: z.string({
    required_error: 'Description is required',
  }),
});

export function FormDetail({ mode }: FormDetailProps) {
  const { register } = useForm<Partial<GuaranteeRelease>>({
    resolver: zodResolver(gauarnteeRequestSchema),
  });

  return (
    <>
      <Textarea
        label="Remark"
        resize="vertical"
        autosize
        minRows={2}
        maxRows={6}
        {...register('remark')}
      />
      <Flex justify="flex-end" gap={10}>
        <Button className="mt-5">Accept</Button>
        <Button variant="outline" className="mt-5">
          Reject
        </Button>
      </Flex>
    </>
  );
}
