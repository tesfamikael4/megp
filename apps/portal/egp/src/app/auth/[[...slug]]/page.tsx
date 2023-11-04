import { Auth } from '@megp/auth';
export default function AuthPage({ params }: { params: { slug: string } }) {
  // import auth
  return <Auth path={params.slug} />;
}
