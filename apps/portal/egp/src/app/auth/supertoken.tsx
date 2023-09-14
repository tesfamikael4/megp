// 'use client';

import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import SessionReact from 'supertokens-auth-react';
import EmailPassword from 'supertokens-web-js/recipe/emailpassword';
import { SuperTokensWrapper } from 'supertokens-auth-react';
import { frontendConfig } from './config/frontendConfig';
import SuperTokensReact from 'supertokens-auth-react';

if (typeof window !== undefined) {
  SuperTokensReact.init(frontendConfig());
}

export default function SuperToken({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
}
