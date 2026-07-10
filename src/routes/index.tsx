import { createFileRoute } from '@tanstack/react-router';

import React, { useState } from 'react';
import { Upload, Zap, Download, ImageIcon, ChevronRight, Star, ArrowRight, Shield, Clock, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { UpscaleProvider, useUpscale } from '@/context/UpscaleContext';
import { FaceEnhancementProvider, useFaceEnhancement } from '@/context/FaceEnhancementContext';
import { UnifiedUploadZone } from '@/components/upload/UnifiedUploadZone';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { ResultView } from '@/components/result/ResultView';
import { FaceEnhancementSection } from '@/components/FaceEnhancement/FaceEnhancementSection';
import { TabSwitcher, TabValue } from '@/components/ui/AppTabSwitcher';
import { ToastContainer } from '@/components/feedback/ToastContainer';
import { cn } from '@/lib/utils';

function StepsSection() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload ảnh',
      description: 'Kéo thả hoặc chọn ảnh từ thiết bị của bạn',
    },
    {
      icon: Zap,
      title: 'AI xử lý',
      description: 'Công nghệ AI nâng cấp chất lượng ảnh tự động',
    },
    {
      icon: Download,
      title: 'Tải về',
      description: 'Nhận ảnh đã nâng cấp với chất lượng cao nhất',
    },
  ];

  return (
    <section className="py-20 aurora-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Quy trình đơn giản
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-indigo-950 dark:text-slate-100 mb-4">
            Chỉ 3 bước đơn giản
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">
            Nâng cấp ảnh chưa bao giờ dễ dàng đến thế. Không cần đăng ký, không watermark.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="w-24 h-24 rounded-2xl glass-card flex items-center justify-center mb-6 relative z-10 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-400 text-white flex items-center justify-center text-sm font-bold mb-4 shadow-glow-purple">
                {index + 1}
              </div>
              <h3 className="text-xl font-heading font-semibold text-indigo-950 dark:text-slate-100 mb-2">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: ImageIcon,
      title: 'Chất lượng 2K/4K',
      description: 'Nâng cấp ảnh lên độ phân giải cao với chi tiết sắc nét, phù hợp in ấn lớn',
      color: 'from-primary to-primary-400',
    },
    {
      icon: Zap,
      title: 'Xử lý nhanh',
      description: 'Công nghệ AI tối ưu, xử lý ảnh trong vài giây thay vì phút',
      color: 'from-cta to-cta-400',
    },
    {
      icon: Shield,
      title: 'Bảo mật & An toàn',
      description: 'Ảnh của bạn được xử lý an toàn và tự động xóa sau 24 giờ',
      color: 'from-emerald-500 to-emerald-400',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cta/10 dark:bg-cta/20 text-cta text-sm font-medium mb-4">
            Tính năng nổi bật
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-indigo-950 dark:text-slate-100 mb-4">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">
            Công nghệ AI tiên tiến kết hợp với trải nghiệm ngườidùng tuyệt vờI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bento-card p-8 group cursor-pointer"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                feature.color
              )}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-indigo-950 dark:text-slate-100 mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              <div className="mt-6 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Tìm hiểu thêm</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const useCases = [
    { title: 'Nhiếp ảnh gia', desc: 'Nâng cấp ảnh chụp để in ấn lớn với chất lượng chuyên nghiệp' },
    { title: 'E-commerce', desc: 'Cải thiện chất lượng ảnh sản phẩm để tăng tỷ lệ chuyển đổi' },
    { title: 'AI Art', desc: 'Nâng cấp ảnh AI lên độ phân giải cao để in ấn hoặc bán' },
    { title: 'Cá nhân', desc: 'Phục chế ảnh cũ, ảnh thấp chất lượng từ điện thoại' },
  ];

  return (
    <section className="py-20 aurora-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium mb-4">
            Đa dạng ứng dụng
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-indigo-950 dark:text-slate-100 mb-4">
            Dành cho mọi nhu cầu
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">
            Dù bạn là ai, chúng tôi đều có thể giúp nâng cao chất lượng hình ảnh
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.title}
              className="glass-card p-6 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-cta/20 dark:from-primary/30 dark:to-cta/30 flex items-center justify-center mb-4 group-hover:from-primary group-hover:to-cta transition-all">
                <span className="text-lg font-bold text-primary group-hover:text-white transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h4 className="font-heading font-semibold text-indigo-950 dark:text-slate-100 text-lg mb-2">
                {useCase.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{useCase.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '50K+', label: 'Ảnh đã xử lý' },
    { value: '99%', label: 'Hài lòng' },
    { value: '<5s', label: 'Thờigian xử lý' },
    { value: '4K', label: 'Độ phân giải tối đa' },
  ];

  return (
    <section className="py-16 bg-indigo-950 dark:bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cta/20 dark:bg-cta/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-indigo-200 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroContent() {
  const [activeTab, setActiveTab] = useState<TabValue>('upscale');
  
  // Upscale context
  const upscaleContext = useUpscale();
  const { status: upscaleStatus, result: upscaleResult, setFile: setUpscaleFile, setResolution, upload } = upscaleContext;
  
  // Face enhancement context
  const faceContext = useFaceEnhancement();
  const { status: faceStatus, file: faceFile, setFile: setFaceFile } = faceContext;

  const isUpscaleTab = activeTab === 'upscale';
  const isFaceTab = activeTab === 'face-enhancement';

  // Determine what to show based on active tab
  const showUpscaleProgress = isUpscaleTab && (upscaleStatus === 'uploading' || upscaleStatus === 'processing');
  const showUpscaleResult = isUpscaleTab && upscaleStatus === 'success' && upscaleResult;
  const showFaceSection = isFaceTab && faceFile;
  const showUploadZone = (isUpscaleTab && !showUpscaleProgress && !showUpscaleResult) || (isFaceTab && !faceFile);

  // Handle file selection from UnifiedUploadZone
  const handleFileSelect = (file: File) => {
    if (isUpscaleTab) {
      // For upscale: set file and auto-trigger upload
      setResolution('2k'); // Default to 2K
      setUpscaleFile(file);
      setTimeout(() => {
        upload();
      }, 100);
    } else if (isFaceTab) {
      // For face enhancement: just set file, user will configure and click enhance
      setFaceFile(file);
    }
  };

  // Disable tab switching when processing
  const isProcessing = upscaleStatus === 'uploading' || upscaleStatus === 'processing' || faceStatus === 'processing';

  return (
    <>
      {/* Hero Text */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary text-sm font-medium mb-4">
          <Star className="w-4 h-4" />
          <span>Miễn phí 100% • Không watermark</span>
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-indigo-950 dark:text-slate-100 mb-4 leading-tight">
          Nâng cấp ảnh với{' '}
          <span className="gradient-text-animated">AI</span>
        </h1>
      </div>

      {/* Tab Switcher */}
      <TabSwitcher 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        disabled={isProcessing}
      />

      {/* Upload Area / Processing / Result */}
      <div className="mx-auto">
        {/* Upload Zone - Show when no file or not processing */}
        {showUploadZone && (
          <div className="max-w-2xl mx-auto">
            <UnifiedUploadZone
              activeTab={activeTab}
              onFileSelect={handleFileSelect}
              disabled={isProcessing}
              error={isUpscaleTab ? upscaleContext.error : faceContext.error}
            />
          </div>
        )}

        {/* Upscale Progress */}
        {showUpscaleProgress && (
          <div className="glass-card rounded-3xl p-8">
            <UploadProgress />
          </div>
        )}

        {/* Upscale Result */}
        {showUpscaleResult && (
          <div className="glass-card rounded-3xl p-6">
            <ResultView />
          </div>
        )}

        {/* Face Enhancement Section */}
        {showFaceSection && (
          <div className="max-w-4xl mx-auto">
            <FaceEnhancementSection />
          </div>
        )}
      </div>
    </>
  );
}

function MainContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Upload */}
      <section className="pt-24 pb-12 aurora-bg flex items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <HeroContent />

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-cta" />
              Xử lý trong 5 giây
            </span>
            <span className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-primary" />
              Bảo mật tuyệt đối
            </span>
            <span className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              Chất lượng 4K
            </span>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <div id="how-it-works">
        <StepsSection />
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Use Cases */}
      <UseCasesSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-600 to-primary-700 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 dark:bg-slate-800/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
            Sẵn sàng nâng cấp ảnh của bạn?
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">
            Bắt đầu miễn phí ngay bây giờ. Không cần đăng ký, không giới hạn số lượng ảnh.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-primary dark:text-primary-400 font-semibold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg"
          >
            <Upload className="w-5 h-5" />
            Upload ảnh ngay
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 dark:bg-slate-950 text-slate-400 dark:text-slate-500 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <img 
                  src="/logo-icon.png" 
                  alt="AI Upscaler Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-heading font-bold text-white">
                AI Upscaler
              </span>
            </div>
            <p className="text-sm text-center">
              © 2025 AI Image Upscaler. Powered by Real-ESRGAN.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                JPG, PNG
              </span>
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Tối đa 10MB
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <UpscaleProvider>
      <FaceEnhancementProvider>
        <MainContent />
      </FaceEnhancementProvider>
    </UpscaleProvider>
  );
}

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'AI Image Upscaler — Enhance ảnh 2K/4K' },
      { name: 'description', content: 'Nâng cấp ảnh bằng AI lên 2K/4K trong vài giây. Không cần đăng ký.' },
      { property: 'og:title', content: 'AI Image Upscaler' },
      { property: 'og:description', content: 'Nâng cấp ảnh bằng AI lên 2K/4K.' },
    ],
  }),
  component: Home,
});
