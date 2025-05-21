'use client';
import { Store } from '@/lib/generated/prisma';
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
import ApiAlert from './ui/api-alert';
import { useOrigin } from '@/hooks/use-origine';

interface SettingsPageProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Nom de la boutique requis',
  }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsPageProps> = ({ initialData }) => {
  const originData = useOrigin();
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success('Paramètres mis à jour');
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
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast.success('Boutique supprimée');
    } catch (error) {
      toast.error(
        "Assurez-vous d'avoir supprimé tous les produits et categories"
      );
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
        <Heading
          title="Paramètres"
          description="Gérer les paramètres de votre boutique"
        />
        <Button
          variant={'destructive'}
          size={'icon'}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la boutique</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nom de la boutique"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Enregistrer
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${originData}/api/${params.storeId}`}
        variant="public"
      />
    </div>
  );
};

export default SettingsForm;
