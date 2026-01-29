import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import UserLayout from '@/layout/UserLayout';

export default function App({ Component, pageProps }) {
  // 1. Check if the individual page has a custom layout (optional future proofing)
  const getLayout = Component.getLayout || ((page) => <UserLayout>{page}</UserLayout>);

  return getLayout(<Component {...pageProps} />);
}