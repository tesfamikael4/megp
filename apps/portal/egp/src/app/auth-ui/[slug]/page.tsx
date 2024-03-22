import { notFound } from 'next/navigation';
import { authSlug, AuthSlug } from '../_model/auth';
import AuthCard from '../_components/auth-card';

export default function Page({ params }: { params: { slug: AuthSlug } }) {
  if (!authSlug.safeParse(params.slug).success) {
    return notFound();
  }
  return <AuthCard type={params.slug} />;
}
