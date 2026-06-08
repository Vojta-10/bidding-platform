'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateListing } from '@/lib/actions/updateListing';
import { createClient } from '@/lib/supabase/client';
import { listingEditSchema, listingEditValues } from '@/lib/validations/auction';
import { MyListingsType } from '@/lib/queries/auctions';

async function uploadFile(
  file: File,
  title: string,
  supabase: SupabaseClient,
): Promise<string | undefined> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') return undefined;
  const { data, error } = await supabase.storage
    .from('auction-images')
    .upload(
      `${user.id}/${Date.now()}-${title.replace(/\s+/g, '-')}`,
      file,
    );
  if (error) return undefined;
  const { data: fileUrl } = supabase.storage
    .from('auction-images')
    .getPublicUrl(data.path);
  return fileUrl.publicUrl;
}

interface EditListingModalProps {
  listing: MyListingsType;
  open: boolean;
  onClose: () => void;
}

export function EditListingModal({
  listing,
  open,
  onClose,
}: EditListingModalProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<listingEditValues>({
    resolver: zodResolver(listingEditSchema),
    defaultValues: { title: listing.title, description: listing.description },
  });

  function onSubmit(data: listingEditValues) {
    startTransition(async () => {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, data.title, supabase);
        if (!imageUrl)
          toast.warning(
            'Image upload failed — listing will be updated without changing the image.',
          );
      }

      const result = await updateListing(
        listing.id,
        data.title,
        data.description,
        imageUrl,
      );

      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success('Listing updated!');
        router.refresh();
        onClose();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={errors.title ? 'true' : undefined}>
              <FieldLabel htmlFor='edit-title'>Title</FieldLabel>
              <Input
                id='edit-title'
                placeholder='Enter title'
                {...register('title')}
              />
              {errors.title && (
                <FieldError>{errors.title.message}</FieldError>
              )}
            </Field>
            <Field data-invalid={errors.description ? 'true' : undefined}>
              <FieldLabel htmlFor='edit-description'>Description</FieldLabel>
              <Input
                id='edit-description'
                placeholder='Enter description'
                {...register('description')}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
              <FieldDescription>Max 200 characters</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor='edit-image'>Image</FieldLabel>
              {listing.image_url && (
                <div className='relative mb-2 h-24 w-full overflow-hidden rounded-md'>
                  <Image
                    src={listing.image_url}
                    alt='Current listing image'
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <Input
                id='edit-image'
                type='file'
                accept='image/jpeg,image/png'
                onChange={(e) => setImageFile(e.target.files?.[0])}
              />
              <FieldDescription>
                Upload a new image to replace the current one.
              </FieldDescription>
            </Field>
            <Button
              type='submit'
              className='w-full'
              disabled={isPending}
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
