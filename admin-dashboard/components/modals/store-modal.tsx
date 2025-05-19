'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';

import { useStoreModal } from '@/hooks/use-store-modal';
import { Modal } from '@/components/ui/modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Nom de la boutique requis',
  }),
});

export const StoreModal = () => {
  const [loading, setLoading] = useState(false);
  const storeModal = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log('Nom de la boutique', values);
    try {
      setLoading(true);
      const response = await axios.post('/api/stores', values);
      toast.success('Boutique créee');
      redirect(`/${response.data.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Créer une boutique"
      description="Ajoute une nouvelle boutique avec de nouveaux produits"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom de la boutique"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage lang="fr">
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant={'outline'}
                onClick={storeModal.onClose}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                Continuer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
