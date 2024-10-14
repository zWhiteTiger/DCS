// Pwr.tsx
import { Modal } from 'antd';
import React from 'react';

type PwrProps = {
  isOpen: boolean;
  toggleModal: () => void;
};

export default function Pwr({ isOpen, toggleModal }: PwrProps) {
  return (
    <Modal
      title="Basic Modal"
      open={isOpen}
      onOk={toggleModal}
      onCancel={toggleModal}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}
