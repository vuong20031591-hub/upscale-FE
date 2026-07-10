import { createFileRoute } from '@tanstack/react-router';
import { FaceEnhancement } from '@/components/FaceEnhancement';

export const Route = createFileRoute('/face-enhancement')({
  head: () => ({
    meta: [
      { title: 'Face Enhancement — AI Upscaler' },
      { name: 'description', content: 'Khôi phục và tô màu khuôn mặt bằng AI CodeFormer.' },
      { property: 'og:title', content: 'Face Enhancement' },
      { property: 'og:description', content: 'Khôi phục và tô màu khuôn mặt bằng AI.' },
    ],
  }),
  component: FaceEnhancementPage,
});

function FaceEnhancementPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <FaceEnhancement />
    </main>
  );
}
