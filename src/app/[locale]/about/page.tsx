import { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import generatePageMetadata from '@/lib/utils/seo';
import { getPathname, Link } from '@/i18n/routing';

import GithubIcon from '@/components/brand-icons/github';
import LinkedinIcon from '@/components/brand-icons/linkedin';
import XIcon from '@/components/brand-icons/x';
import { fetchPage, readFields } from '../../../lib/vunora';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage' });

  const pathname = getPathname({ locale, href: '/about' });

  return generatePageMetadata({
    title: t('metadata.title'),
    description: t('metadata.description'),
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
    locale,
  });
}

function getAge(): number {
  const diff = Date.now() - new Date('2002-11-27T23:02:00').getTime();
  const age = new Date(diff);

  return Math.abs(age.getUTCFullYear() - 1970);
}

const socialMedias = [
  {
    name: 'GitHub',
    link: 'https://github.com/rodrigo-miranda18',
    icon: GithubIcon,
  },
  {
    name: 'Linkedin',
    link: 'https://www.linkedin.com/in/rodrigoamiranda/',
    icon: LinkedinIcon,
  },
  {
    name: 'x',
    link: 'https://x.com/ro_miranda27',
    icon: XIcon,
  },
];

export default async function AboutPage({ params }: PageProps) {
  const { data: cmsPage } = await fetchPage(
    'about',
    undefined,
    (await cookies()).get('supercms_visitor_id')?.value,
  );
  const f = readFields(cmsPage);
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage' });

  const age = getAge();

  return (
    <section className="mx-auto max-w-4xl px-6 pb-16 pt-20">
      <h1 className="text-3xl font-semibold">{f.heading_1 ?? 'About'}</h1>

      <hr className="mt-6 border-border dark:border-secondary-border" />

      <main className="mt-10 flex flex-col gap-8 md:flex-row">
        <div className="flex basis-[37%] flex-col items-center text-center">
          <Image
            className="rounded-full"
            src="/avatar.webp"
            alt={f.image_alt_1 ?? 'avatar'}
            width={192}
            height={192}
          />

          <h2 className="mt-6 text-xl font-semibold">{f.heading_3 ?? t('name')}</h2>

          <div className="mt-2 text-base leading-7 text-secondary-foreground">
            {f.text_1 ?? t('role')}
            <br />
            {f.text_2 ?? t('bio')}
          </div>

          <div className="mt-6 flex gap-3">
            {socialMedias.map((socialMedia) => (
              <Link
                key={socialMedia.name}
                className="rounded-lg bg-background p-2 transition-colors hover:bg-background-hover"
                href={socialMedia.link}
                target="_blank"
              >
                {socialMedia.icon ? <socialMedia.icon className="h-6 w-6" /> : socialMedia.name}
              </Link>
            ))}
          </div>
        </div>

        <p className="basis-[63%] whitespace-pre-line leading-7 text-secondary-foreground">
          {f.para_1 ?? t('content', { age })}
        </p>
      </main>
    </section>
  );
}
