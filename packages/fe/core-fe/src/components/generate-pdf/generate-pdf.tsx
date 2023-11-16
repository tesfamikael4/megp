'use client';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

interface GeneratePdfProps {
  label: string;
  selector: string;
  templateUrl: string;
  apiUrl: string;
  className?: string;
  mode: 'download' | 'view';
}

export function GeneratePdf({
  label,
  selector,
  templateUrl,
  className = '',
  mode,
  apiUrl,
}: GeneratePdfProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const baseUrl = `${apiUrl}application-execution/generate-certeficate-pdf?templateUrl=${encodeURIComponent(
    templateUrl,
  )}&selector=${encodeURIComponent(selector)}`;
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error('Server returned an error.');
      }

      const blob = await response.blob();

      // Create a download link and trigger the click event
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'ppda.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notifications.show({
        message: 'Error while downloading PDF',
        color: 'red',
        title: 'Error',
      });
    }
  };
  const getPdf = async () => {
    try {
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error('Error fetching PDF');
      }
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    if (mode === 'view') {
      getPdf().catch(() => {
        // console.log(err);
      });
    }
  }, [mode]);

  return (
    <>
      {mode === 'download' && (
        <Button
          className={className}
          loading={isLoading}
          onClick={handleDownload}
        >
          {label}
        </Button>
      )}

      {mode === 'view' && (
        <embed
          height="500px"
          src={pdfUrl}
          type="application/pdf"
          width="100%"
        />
      )}
    </>
  );
}
