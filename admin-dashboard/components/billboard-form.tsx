'use client';
import { BillBoard } from '@/lib/generated/prisma';
import React, { useState } from 'react';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';

import Heading from './ui/heading';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import AlertModal from './modals/alert-modal';
import ImageUpload from './ui/image-upload';

interface BillboardPageProps {
  initialData: BillBoard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  label: z.string().min(1, {
    message: 'Le titre est requis',
  }),
  imageUrl: z.string().min(1, {
    message: "l'image est requise",
  }),
});

const BillboardsForm: React.FC<BillboardPageProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Modifier le bandeau' : 'Créer un bandeau';
  const description = initialData
    ? 'Modifier le bandeau de la boutique'
    : 'Créer un nouveau bandeau pour la boutique';
  const toastMessage = initialData ? 'Bandeau mis à jour' : 'Bandeau créé';
  const action = initialData ? 'Modifier' : 'Créer';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Une erreur s'est produite");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push('/');
      toast.success('Bandeau supprimé');
    } catch (error) {
      toast.error("Assurez-vous d'avoir supprimé toutes les categories");
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full gap-4">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex w-full items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={'destructive'}
            size={'icon'}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image de couverture</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Titre du bandeau"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </div>
  );
};

export default BillboardsForm;
