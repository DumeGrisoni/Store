'use client';

import React, { useEffect, useState } from 'react';

import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Etes-vous certain?"
      description="Cette action est irreversible"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Confirmer
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
