'use client';
import { ReactNode, useEffect, useState } from 'react';
import { Button, ButtonProps } from '@mantine/core';

interface Props<T> {
  id: string;
  template: () => ReactNode;
  buttonLabel?: string;
  buttonProps?: ButtonProps;
}
function DynamicPrintComponent<T>({
  id,
  template,
  buttonLabel,
  buttonProps,
}: Props<T>) {
  const [visible, setVisible] = useState<boolean>(false);

  const handlePrint = () => {
    setVisible(true);
  };

  useEffect(() => {
    const invoiceElement = document.querySelector(
      `.print-data-container-a4-${id}`,
    );

    if (invoiceElement && visible) {
      const body = document.body;
      const children = Array.from(body.children);
      children.forEach((child) => {
        body.removeChild(child);
      });
      body.appendChild(invoiceElement);
      window.print();
      body.removeChild(invoiceElement);
      children.forEach((child) => {
        body.appendChild(child);
      });

      const invoiceRootElement = document.querySelector(
        `.print-data-root-container-${id}`,
      );
      if (invoiceRootElement) {
        invoiceRootElement.appendChild(invoiceElement);
      }

      setVisible(false);
    }
    setVisible(false);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <div className={`print-data-root-container-${id}`}>
      <div
        className={`print-data-container-a4-${id} w-[210mm] h-[297mm] hidden print:block`}
      >
        {visible && template()}
      </div>
      <Button onClick={handlePrint} {...buttonProps}>
        {buttonLabel || 'Print'}
      </Button>
    </div>
  );
}

export default DynamicPrintComponent;
