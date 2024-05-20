import { useUpdateMutation } from '@/app/(features)/preparation/_api/lot/bid-security.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Flex, TextInput } from '@mantine/core';
import { Section, logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

interface QualificationCategoryInterface {
  category: string;
  lotId: string;
}

export default function QualificationCategoryEditor({
  category,
  lotId,
}: {
  category: string;
  lotId: string;
}) {
  const qualificationCategorySchema: ZodType<
    Partial<QualificationCategoryInterface>
  > = z.object({
    category: z.string().min(1, { message: 'This field is required ' }),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(qualificationCategorySchema),
  });

  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onUpdate = async (data) => {
    await update({
      ...data,
      lotId: lotId,
    })
      .unwrap()
      .then(() => {
        notify('Success', 'Qualification Category updated successfully');
      })
      .catch(() => {
        notify('Error', 'Error in updating Qualification Category');
      });
  };

  useEffect(() => {
    logger.log(category, lotId);
  }, [category, lotId]);
  return (
    <Box>
      <TextInput
        label="Category"
        withAsterisk
        value={category}
        error={errors?.category ? errors?.category?.message?.toString() : ''}
        {...register('category')}
      />
      <EntityButton
        mode={'detail'}
        data={{ category }}
        onUpdate={handleSubmit(onUpdate)}
        isUpdating={isUpdating}
      />
    </Box>
  );
}
