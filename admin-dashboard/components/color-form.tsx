'use client';
import { Color } from '@/lib/generated/prisma';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Trash } from 'lucide-react';
import * as z from 'zod';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';

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

interface ColorPageProps {
  initialData: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Le titre est requis',
  }),
  value: z
    .string()
    .min(4, {
      message: 'la valeur est requise',
    })
    .regex(/^#/, {
      message: 'La valeur doit commencer par # et une valeur hex',
    }),
});

const ColorForm: React.FC<ColorPageProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useColor('#561ecb');

  const title = initialData ? 'Modification' : 'Création';
  const description = initialData ? 'Modifier la couleur' : 'Créer une couleur';
  const toastMessage = initialData ? 'Couleur mise à jour' : 'Couleur créé';
  const action = initialData ? 'Modifier' : 'Créer';

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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

      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.replace(`/${params.storeId}/colors`);
      toast.success('Couleur supprimée');
    } catch (error) {
      toast.error(
        "Assurez-vous d'avoir supprimé toutes les produits pour cette couleur"
      );
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    form.setValue('value', color.hex || initialData?.value || '');
    console.log(form.getValues());
  }, [color, form, initialData]);

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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la couleur</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={() => (
                <FormItem>
                  <FormLabel>Valeur</FormLabel>
                  <FormControl>
                    {/* <Input
                      disabled={loading}
                      placeholder="Valeur"
                      {...field}
                    /> */}
                    <div className="w-[60%]">
                      <ColorPicker
                        color={color}
                        onChange={setColor}
                        height={150}
                        hideAlpha
                        hideInput
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-[60%]"></div>
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

export default ColorForm;
