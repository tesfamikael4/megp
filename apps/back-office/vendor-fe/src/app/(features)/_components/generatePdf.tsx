'use client';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

interface GeneratePdfProps {
  label: string;
  selector?: string;
  templateUrl?: string;
  apiUrl: string;
  className?: string;
  mode: 'download' | 'view';
  id: string;
  setHideUnPick: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GeneratePdf({
  id,
  apiUrl,
  setHideUnPick,
}: GeneratePdfProps): React.ReactElement {
  const [pdfUrl, setPdfUrl] = useState('');
  const baseUrl = `${apiUrl}certificates/generate-certeficate/${id}`;
  const token = getCookie('token');
  const [showPdf, setShowPdf] = useState(false);

  const getPdf = async () => {
    try {
      const response = await fetch(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching PDF');
      }
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setHideUnPick(true);
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <>
      {!showPdf && (
        <Button
          onClick={async () => {
            setShowPdf(true);
            getPdf().catch((error) => {
              notifications.show({
                title: 'Error',
                color: 'red',
                message: 'Something went wrong while generating Certificate',
              });
            });
          }}
          my={'md'}
        >
          Generate Certificate
        </Button>
      )}
      {showPdf && (
        <embed
          className="mt-5"
          height="500px"
          src={pdfUrl}
          type="application/pdf"
          width="100%"
        />
      )}
    </>
  );
}
