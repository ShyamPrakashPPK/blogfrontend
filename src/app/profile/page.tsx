'use client';

import { Suspense } from 'react';
import ProfilePageContent from '@/components/profile/profile-page-component';

function ProfilePageWithSearchParams() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}

export default ProfilePageWithSearchParams;
