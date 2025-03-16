'use client'
import React, { useState } from 'react';
import { Title, Subtitle, TextArea, Button, FeatureCard } from '../ui';
import { Sparkles, Code2, Rocket } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/builder?query=${query}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Sparkles size={40} className="text-blue-400" />
            <Title text="ZenCode AI" />
          </div>
          <Subtitle text="Transform your app ideas into web applications with restricted design library choice" />
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <TextArea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your dream website (e.g., 'Create a modern portfolio website with a dark theme, project showcase, and contact form')"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
              <Button onClick={handleSubmit} />
            </div>
          </form>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="mx-auto mb-4 text-yellow-400" size={32} />}
              title="Customizable AI"
              description="Define your design components and CSS standards for tailored code generation."
            />
            <FeatureCard
              icon={<Code2 className="mx-auto mb-4 text-green-400" size={32} />}
              title="Enterprise-Ready"
              description="Seamlessly integrate generated components into your existing codebase."
            />
            <FeatureCard
              icon={<Rocket className="mx-auto mb-4 text-blue-400" size={32} />}
              title="Rapid Development"
              description="Transform your app ideas into web applications quickly and efficiently."
            />
          </div>
        </div>
      </div>
    </div>
  );
}