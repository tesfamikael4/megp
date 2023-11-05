import { Auth } from '@megp/auth';
import { logger } from '@megp/core-fe';
export default function AuthPage({ params }: { params: { slug: string } }) {
  logger.log(process.env.NEXT_PUBLIC_IAM_API);
  // import auth
  return (
    <>
      <Auth path={params.slug} />-
      {JSON.stringify(process.env.NEXT_PUBLIC_IAM_API)}
      {JSON.stringify(process.env)}
    </>
  );
}
