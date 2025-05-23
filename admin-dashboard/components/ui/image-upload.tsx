'use client';
import React, { useEffect, useState } from 'react';
import { ImagePlus, Trash } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

import { Button } from './button';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              sizes="200px"
              priority
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget uploadPreset="novaMarket" onSuccess={onUpload}>
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Télécharger une image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
