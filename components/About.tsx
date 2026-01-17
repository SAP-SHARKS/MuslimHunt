import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { View } from '../types';

interface AboutProps {
  onBack: () => void;
  setView: (view: View, path?: string) => void;
}

const About: React.FC<AboutProps> = ({ onBack, setView }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'branding'>('about');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-black">M</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">About Muslim Hunt</h1>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Discover the best new products for the Muslim community — ranked daily by our members.
              Browse by category or topic to find halal apps, tools, and startups across AI, design, developer tools,
              and more. Read real reviews, explore alternatives, and see what has traction.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-8 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('about');
                window.history.pushState({}, '', '/about');
              }}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${
                activeTab === 'about'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About us
              {activeTab === 'about' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('branding');
                window.history.pushState({}, '', '/branding');
              }}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${
                activeTab === 'branding'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Brand guidelines
              {activeTab === 'branding' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'about' ? (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-base leading-relaxed mb-6 italic">
              Muslim Hunt has become a must-read site in the global Muslim tech ecosystem.
            </p>

            <div className="flex items-center gap-3 mb-12 pb-12 border-b border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary text-xl font-black">M</span>
              </div>
              <span className="text-gray-400 text-sm font-medium">THE UMMAH</span>
            </div>

            {/* Team Section */}
            <h2 className="text-2xl font-black text-gray-900 mb-8">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Founder */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark mx-auto mb-4 overflow-hidden">
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="Founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Zeir Islam</h3>
                <p className="text-sm text-gray-500 mb-1">Founder</p>
                <a href="#" className="text-sm text-primary hover:underline">@zeirislam</a>
              </div>

              {/* Team members can be added here */}
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-4">
                Muslim Hunt is a platform dedicated to discovering and showcasing the best products,
                tools, and innovations created by and for the global Muslim community.
              </p>
              <p className="text-gray-700 text-base leading-relaxed">
                We believe in empowering Muslim entrepreneurs, developers, and creators to share
                their work with the world while maintaining Islamic values and ethics in technology.
              </p>
            </div>

            {/* Values */}
            <h2 className="text-2xl font-black text-gray-900 mb-6">Our Values</h2>
            <div className="space-y-6 mb-12">
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Community First
                </h3>
                <p className="text-gray-600 text-sm ml-4">
                  We prioritize the needs and voices of our community members in every decision we make.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Islamic Ethics
                </h3>
                <p className="text-gray-600 text-sm ml-4">
                  All products and services featured on our platform align with Islamic values and principles.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Innovation & Excellence
                </h3>
                <p className="text-gray-600 text-sm ml-4">
                  We celebrate innovation and excellence in technology that serves the Ummah.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Transparency
                </h3>
                <p className="text-gray-600 text-sm ml-4">
                  We operate with complete transparency in our processes and decision-making.
                </p>
              </div>
            </div>

            {/* Join Us CTA */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-black text-gray-900 mb-3">Join Our Community</h2>
              <p className="text-gray-600 text-sm mb-6">
                Be part of the growing Muslim tech ecosystem. Share your products, discover new tools,
                and connect with fellow Muslim entrepreneurs.
              </p>
              <button
                onClick={() => setView(View.POST_SUBMIT)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                Submit Your Product
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Brand Guidelines</h2>

            {/* Logo Section */}
            <div className="mb-12">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Logo</h3>
              <div className="bg-gray-50 rounded-2xl p-8 mb-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="bg-white p-8 rounded-xl mb-3">
                      <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                        <span className="text-white text-4xl font-black">M</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Primary Logo</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-900 p-8 rounded-xl mb-3">
                      <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto">
                        <span className="text-primary text-4xl font-black">M</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Light Version</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-12">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Brand Colors</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="w-full h-24 bg-primary rounded-xl mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Primary</p>
                  <p className="text-xs text-gray-500">#004D40</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-primary-dark rounded-xl mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Primary Dark</p>
                  <p className="text-xs text-gray-500">#00332B</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-primary-light rounded-xl mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Primary Light</p>
                  <p className="text-xs text-gray-500">#E0F2F1</p>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="mb-12">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Typography</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-3xl font-black text-gray-900 mb-1">Inter Black</p>
                  <p className="text-sm text-gray-500">Headings and Titles</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <p className="text-base text-gray-700 mb-1">Inter Regular</p>
                  <p className="text-sm text-gray-500">Body text and descriptions</p>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Usage Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Always maintain minimum clear space around the logo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Do not alter the logo colors or proportions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Use the appropriate logo version based on background</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>Maintain brand consistency across all platforms</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
