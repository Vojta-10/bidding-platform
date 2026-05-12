'use client';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { newAuction } from '@/lib/actions/newAuction';
import { createClient } from '@/lib/supabase/client';
import { newAuctionSchema, newAuctionValues } from '@/lib/validations/auction';
import { zodResolver } from '@hookform/resolvers/zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

async function uploadFile(
  file: File | undefined,
  title: string,
  supabase: SupabaseClient,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (!file) return;
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') return;
  const { data, error } = await supabase.storage
    .from('auction-images')
    .upload(`${user?.id}/${Date.now()}-${title.replace(/\s+/g, '-')}`, file);
  if (error) {
    return;
  } else {
    const { data: fileUrl } = supabase.storage
      .from('auction-images')
      .getPublicUrl(`${data.path}`);

    return fileUrl.publicUrl;
  }
}

export function NewAuctionForm() {
  const [imageFile, setImageFile] = useState<File>();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<newAuctionValues>({ resolver: zodResolver(newAuctionSchema) });

  async function onSubmit(_data: newAuctionValues) {
    let imageUrl: string | undefined;
    const correctDate = new Date(_data.deadline).toISOString();

    if (imageFile) {
      imageUrl = await uploadFile(imageFile, _data.title, supabase);
      if (!imageUrl)
        toast.warning(
          'Image upload failed — listing will be created with a placeholder.',
        );
    }

    const result = await newAuction(
      _data.title,
      _data.description,
      _data.startingPrice,
      correctDate,
      imageUrl,
    );
    if (result?.error) toast.error(result.error);
  }

  return (
    <div className='w-full max-w-2xl mx-auto mt-10 px-4'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label='Create new auction listing'
      >
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field data-invalid={errors.title ? 'true' : undefined}>
                <FieldLabel htmlFor='title-field'>Title</FieldLabel>
                <Input
                  id='title-field'
                  placeholder='Enter title'
                  aria-required='true'
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  {...register('title')}
                />
                {errors.title && (
                  <FieldError id='title-error'>{errors.title.message}</FieldError>
                )}
              </Field>
              <Field data-invalid={errors.description ? 'true' : undefined}>
                <FieldLabel htmlFor='desc-field'>Description</FieldLabel>
                <Input
                  id='desc-field'
                  placeholder='Enter description'
                  aria-required='true'
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? 'desc-error desc-hint' : 'desc-hint'
                  }
                  {...register('description')}
                />
                {errors.description && (
                  <FieldError id='desc-error'>{errors.description.message}</FieldError>
                )}
                <FieldDescription id='desc-hint'>Max 200 characters</FieldDescription>
              </Field>
              <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2'>
                <Field
                  className='flex-1'
                  data-invalid={errors.startingPrice ? 'true' : undefined}
                >
                  <FieldLabel htmlFor='starting-price'>Starting Price</FieldLabel>
                  <Input
                    id='starting-price'
                    placeholder='Enter starting price'
                    type='number'
                    min={1}
                    aria-required='true'
                    aria-invalid={!!errors.startingPrice}
                    aria-describedby={errors.startingPrice ? 'price-error' : undefined}
                    {...register('startingPrice', { valueAsNumber: true })}
                  />
                  {errors.startingPrice && (
                    <FieldError id='price-error'>{errors.startingPrice.message}</FieldError>
                  )}
                </Field>
                <Field
                  className='flex-1'
                  data-invalid={errors.deadline ? 'true' : undefined}
                >
                  <FieldLabel htmlFor='deadline-field'>Deadline</FieldLabel>
                  <Input
                    type='datetime-local'
                    id='deadline-field'
                    aria-required='true'
                    aria-invalid={!!errors.deadline}
                    aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                    {...register('deadline')}
                  />
                  {errors.deadline && (
                    <FieldError id='deadline-error'>{errors.deadline.message}</FieldError>
                  )}
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor='image-upload'>Image</FieldLabel>
                <Input
                  id='image-upload'
                  type='file'
                  aria-describedby='image-hint'
                  onChange={(e) => setImageFile(e.target.files?.[0])}
                  accept='image/jpeg,image/png'
                />
                <FieldDescription id='image-hint'>
                  If unselected then generic image icon will be shown
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field
            orientation={'horizontal'}
            className='flex items-center justify-center gap-10 mt-4'
          >
            <Button
              variant='default'
              type='submit'
              className='w-full sm:w-auto min-w-30 h-10'
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              formNoValidate
            >
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
