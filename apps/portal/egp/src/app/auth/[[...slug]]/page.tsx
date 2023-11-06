import { Auth } from '@megp/auth';
import { theme as baseTheme } from '@/utilities/theme';
export default function AuthPage({ params }: { params: { slug: string } }) {
  // import auth
  return <Auth path={params.slug} theme={baseTheme} />;
}
