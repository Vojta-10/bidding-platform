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
      _data.deadline,
      imageUrl,
    );
    if (result?.error) toast.error(result.error);
  }

  return (
    <div className='flex flex-col mt-10 w-4/5'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='title-field'>Title</FieldLabel>
                <Input
                  id='title-field'
                  placeholder='Enter title'
                  {...register('title')}
                />
                {errors.title && (
                  <FieldError>{errors.title.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor='desc-field'>Description</FieldLabel>
                <Input
                  id='desc-field'
                  placeholder='Enter description'
                  {...register('description')}
                />
                {errors.description && (
                  <FieldError>{errors.description.message}</FieldError>
                )}
                <FieldDescription>Max 200 characters</FieldDescription>
              </Field>
              <div className='flex justify-around mt-6 gap-8'>
                <Field>
                  <FieldLabel htmlFor='starting-price'>
                    Starting Price
                  </FieldLabel>
                  <Input
                    id='starting-price'
                    placeholder='Enter starting price'
                    type='number'
                    min={1}
                    {...register('startingPrice', { valueAsNumber: true })}
                  />
                  {errors.startingPrice && (
                    <FieldError>{errors.startingPrice.message}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor='deadline-field'>Deadline</FieldLabel>
                  <Input
                    type='datetime-local'
                    id='deadline-field'
                    {...register('deadline')}
                  />
                  {errors.deadline && (
                    <FieldError>{errors.deadline.message}</FieldError>
                  )}
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor='image-upload'>Image</FieldLabel>
                <Input
                  id='image-upload'
                  type='file'
                  placeholder='Choose image file'
                  onChange={(e) => setImageFile(e.target.files?.[0])}
                  accept='image/jpeg,image/png'
                />
                <FieldDescription>
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
              className='min-w-30 h-10'
              disabled={isSubmitting}
              formNoValidate
            >
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
