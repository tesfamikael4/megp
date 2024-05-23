import { Auth } from '@megp/auth';
export default function AuthPage({ params }: { params: { slug: string } }) {
  return <Auth path={params.slug} config={{ basePath: '/marketplace' }} />;
}
