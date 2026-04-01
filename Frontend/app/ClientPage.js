'use client';

import dynamic from 'next/dynamic';

const GenCode = dynamic(() => import('./pages/Gencode'), {
  ssr: false,
});

export default function ClientPage() {
  return <GenCode />;
}
