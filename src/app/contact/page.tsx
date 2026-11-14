import { Suspense } from "react";
import type { Metadata } from "next";
import { ContactView } from "@/views/contact-view";
import { site } from "@/data/site";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: `Contact | ${site.name}`,
  description: `Get in touch with ${site.name} for engineering opportunities, collaborations, and discussions.`,
  alternates: {
    canonical: "/contact",
  },
};

async function ContactContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const topic = typeof params.topic === "string" ? params.topic : undefined;
  const hasResendConfig = Boolean(process.env.RESEND_API_KEY);

  return <ContactView initialTopic={topic} hasResendConfig={hasResendConfig} />;
}

export default function ContactPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<ContactView />}>
      <ContactContent searchParams={searchParams} />
    </Suspense>
  );
}
