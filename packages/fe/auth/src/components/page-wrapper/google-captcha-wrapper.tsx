'use client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import React from 'react';

export default function GoogleCaptchaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const recaptchaKey: string | undefined =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey ?? '6LcizbgpAAAAACU7mem0dUBjt05Dhd5pza-XZ6c3'}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
