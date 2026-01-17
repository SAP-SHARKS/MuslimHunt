import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { View } from '../types';

interface LegalProps {
  onBack: () => void;
  setView: (view: View, path?: string) => void;
}

const Legal: React.FC<LegalProps> = ({ onBack, setView }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  // Sync tab with URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#privacy') {
      setActiveTab('privacy');
    } else {
      setActiveTab('terms');
    }
  }, []);

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
            <h1 className="text-3xl font-black text-gray-900 mb-3">Legal</h1>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Our commitment to transparency and your rights on Muslim Hunt.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-8 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('terms');
                window.history.pushState({}, '', '/legal#terms');
              }}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${
                activeTab === 'terms'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Terms of Service
              {activeTab === 'terms' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('privacy');
                window.history.pushState({}, '', '/legal#privacy');
              }}
              className={`pb-4 px-2 text-sm font-bold transition-colors relative ${
                activeTab === 'privacy'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Privacy Policy
              {activeTab === 'privacy' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'terms' ? (
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 18, 2026</p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to Muslim Hunt! These Terms of Service govern your use of the Muslim Hunt website and services.
              By accessing or using Muslim Hunt, you agree to be bound by these Terms. If you don't agree to these Terms,
              please don't use Muslim Hunt.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">1. About Muslim Hunt</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Muslim Hunt is a platform for discovering and sharing the best products, tools, and innovations created by
              and for the global Muslim community. Our mission is to empower Muslim entrepreneurs, developers, and creators
              while maintaining Islamic values and ethics in technology.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must be at least 13 years old to use Muslim Hunt. By using our services, you represent and warrant that
              you meet this age requirement and have the legal capacity to enter into these Terms.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of Muslim Hunt, you may need to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your information to keep it accurate and current</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to use Muslim Hunt in accordance with Islamic values and ethics. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Post content that violates Islamic principles or promotes haram activities</li>
              <li>Harass, threaten, or intimidate other users</li>
              <li>Post false, misleading, or deceptive content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Distribute spam, malware, or other harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Manipulate voting or engagement metrics</li>
              <li>Use automated systems or bots without permission</li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">5. Content and Intellectual Property</h2>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Your Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of any content you post on Muslim Hunt. By posting content, you grant us a worldwide,
              non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and distribute your content
              in connection with operating and promoting Muslim Hunt.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Muslim Hunt Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on Muslim Hunt, including text, graphics, logos, and software, is owned by Muslim Hunt or our
              licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">6. Product Submissions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you submit a product to Muslim Hunt, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>You have the right to submit the product</li>
              <li>The product information is accurate and truthful</li>
              <li>The product complies with Islamic values and principles</li>
              <li>The product does not infringe on third-party rights</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to remove any product submission that violates these Terms or our community guidelines.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">7. Comments and Community Interaction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Muslim Hunt encourages respectful community interaction. All comments and discussions must:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Be respectful and constructive</li>
              <li>Align with Islamic values of kindness and integrity</li>
              <li>Not contain hate speech, discrimination, or offensive language</li>
              <li>Stay on topic and add value to the conversation</li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">8. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
              and protect your personal information. By using Muslim Hunt, you consent to our data practices as
              described in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">9. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Conduct that harms Muslim Hunt or other users</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may also terminate your account at any time by contacting us at hello@muslim-hunt.vercel.app.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">10. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Muslim Hunt is provided "as is" and "as available" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy or reliability of content</li>
              <li>That the service will meet your requirements</li>
              <li>That defects will be corrected</li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, Muslim Hunt and its team shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the service.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">12. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to indemnify and hold harmless Muslim Hunt from any claims, damages, losses, liabilities, and
              expenses arising from your use of the service or violation of these Terms.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update these Terms from time to time. We will notify you of material changes by posting the new
              Terms on this page and updating the "Last Updated" date. Your continued use of Muslim Hunt after changes
              constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">14. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with applicable international laws,
              with disputes resolved through fair arbitration or mediation in accordance with Islamic principles
              of justice where applicable.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">15. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Email: hello@muslim-hunt.vercel.app
            </p>

            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg mt-12">
              <p className="text-sm text-gray-700">
                By using Muslim Hunt, you acknowledge that you have read, understood, and agree to be bound by these
                Terms of Service. Thank you for being part of the Muslim Hunt community and contributing to the growth
                of the Muslim tech ecosystem.
              </p>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last Updated: January 18, 2026</p>

            <p className="text-gray-700 leading-relaxed mb-6">
              At Muslim Hunt, we respect your privacy and are committed to protecting your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our service.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Account information (name, email, username, password)</li>
              <li>Profile information (bio, avatar, social links)</li>
              <li>Content you post (products, comments, reviews)</li>
              <li>Communications with us</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, interactions)</li>
              <li>IP address and location data</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Send you updates and notifications</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Service providers who help us operate Muslim Hunt</li>
              <li>Other users (public profile information and content you post)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your consent</li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information,
              including encryption, secure servers, and access controls. However, no method of transmission over
              the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">6. Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, and deliver
              personalized content. You can control cookies through your browser settings.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Muslim Hunt is not intended for children under 13. We do not knowingly collect personal information
              from children under 13. If we become aware of such collection, we will delete the information.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your information may be transferred to and processed in countries other than your country of residence.
              We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">9. Changes to Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of material changes by
              posting the new policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-12 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Email: hello@muslim-hunt.vercel.app
            </p>

            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg mt-12">
              <p className="text-sm text-gray-700">
                Your privacy is important to us. We are committed to protecting your personal information and
                maintaining transparency in our data practices. Thank you for trusting Muslim Hunt.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Legal;
