import { languages, loadDictionary } from '#/lib/i18n/settings';
import { cn } from '#/lib/utils';
import '#/styles/globals.css';
import Footer from '#/ui/Footer';
import GlobalNav from '#/ui/GlobalNav';
import PlausibleTracker from '#/ui/PlausibleTracker';
import { Work_Sans as WorkSans } from '@next/font/google';
import localFont from '@next/font/local';
import type { ReactNode } from 'react';

const fontSerif = localFont({
  variable: '--font-serif',
  src: './fonts/animales-fantastic.woff2',
});

const fontSans = WorkSans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const RootLayout = async ({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: string };
}) => {
  const { globalNav: translations } = await loadDictionary(lang);

  return (
    <html
      lang={lang}
      dir="ltr"
      className={cn(
        '[color-scheme:dark] select-none bg-gray-1100',
        fontSerif.variable,
        fontSans.variable,
      )}
    >
      <head>
        <PlausibleTracker />
      </head>
      <body className="relative min-h-screen">
        <GlobalNav translations={translations} />
        <div className="pt-14">{children}</div>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}