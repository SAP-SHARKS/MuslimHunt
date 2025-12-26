
import React from 'react';
import { Megaphone, Star, TrendingUp, Users, ArrowRight, CheckCircle2, Globe, Cpu, Code, DollarSign, CheckSquare, Sparkles, Zap, BarChart3, Mail } from 'lucide-react';

const Sponsor: React.FC = () => {
  const avatars = [
    "https://i.pravatar.cc/150?u=a1",
    "https://i.pravatar.cc/150?u=a2",
    "https://i.pravatar.cc/150?u=a3",
    "https://i.pravatar.cc/150?u=a4",
    "https://i.pravatar.cc/150?u=a5",
    "https://i.pravatar.cc/150?u=a6",
  ];

  const campaignOptions = [
    {
      title: "Basic display campaign",
      tag: "Self-serve",
      description: "Test the response of our community with standard display placements across our most visited pages.",
      price: "Starting at $2,500",
      features: ["Sidebar display on desktop", "Daily digest mentions", "Campaign dashboard", "Standard email support"],
      icon: Globe,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Momentum display campaign",
      tag: "High Visibility",
      description: "Maximize your launch day efforts and stay top-of-mind with high-visibility placements on the home feed and newsletter.",
      price: "Starting at $5,000",
      features: ["Sticky home feed sponsorship", "Top of daily newsletter", "Enhanced campaign analytics", "Priority support channel"],
      icon: Zap,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Managed campaigns",
      tag: "Full-Service",
      description: "Fully managed multi-channel campaigns customized to your specific growth goals and product stage.",
      price: "Custom Pricing",
      features: ["Custom creative production", "Newsletter + Social + Web", "A/B testing and optimization", "Dedicated success manager"],
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative py-32 sm:py-48 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Megaphone className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Partner with Muslim Hunt</span>
          </div>
          
          <h1 className="text-6xl sm:text-8xl font-black text-gray-900 mb-8 max-w-5xl mx-auto leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Reach millions of <br/><span className="text-emerald-800 italic font-serif font-normal">early adopters</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Our advertising options will help you build traction with the most influential early adopters in the global Muslim tech community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <button className="w-full sm:w-auto px-12 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-900/20 active:scale-[0.98]">
              Get Started Now
            </button>
            <button className="w-full sm:w-auto px-12 py-5 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all active:scale-[0.98]">
              View Media Kit
            </button>
          </div>

          {/* High-Fidelity Floating Decorative Avatars cluster */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top Left Cluster */}
            <div className="absolute top-24 left-10 flex items-center gap-4 animate-in slide-in-from-left-10 duration-1000">
               <div className="w-16 h-16 rounded-full border-4 border-white shadow-xl rotate-[-12deg]">
                 <img src={avatars[0]} className="w-full h-full rounded-full object-cover" alt="User" />
               </div>
               <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-lg">
                <Code className="w-6 h-6" />
              </div>
            </div>

            {/* Bottom Left Cluster */}
            <div className="absolute bottom-40 left-20 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-10 duration-1000">
               <div className="w-20 h-20 rounded-full border-4 border-white shadow-2xl">
                 <img src={avatars[1]} className="w-full h-full rounded-full object-cover" alt="User" />
               </div>
               <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-md">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            {/* Top Right Cluster */}
            <div className="absolute top-32 right-10 flex flex-col items-end gap-4 animate-in slide-in-from-right-10 duration-1000">
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl">
                 <img src={avatars[2]} className="w-full h-full rounded-full object-cover" alt="User" />
               </div>
               <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-lg translate-x-4">
                <Cpu className="w-6 h-6" />
              </div>
            </div>

            {/* Bottom Right Cluster */}
            <div className="absolute bottom-24 right-24 flex items-center gap-4 animate-in slide-in-from-bottom-10 delay-200 duration-1000">
               <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 shadow-lg">
                <BarChart3 className="w-7 h-7" />
              </div>
               <div className="w-16 h-16 rounded-full border-4 border-white shadow-xl rotate-[15deg]">
                 <img src={avatars[3]} className="w-full h-full rounded-full object-cover" alt="User" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Tiers Grid */}
      <section className="py-24 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800 mb-4 block">Our Placements</span>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Advertising Tiers</h2>
            <p className="text-gray-500 font-medium">Build momentum at every stage of your product journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaignOptions.map((opt, i) => (
              <div key={i} className="group flex flex-col p-10 bg-white border border-gray-100 rounded-[3.5rem] hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 ${opt.bg} ${opt.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <opt.icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">{opt.tag}</span>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{opt.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-1">{opt.description}</p>
                
                <p className="text-sm font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">{opt.price}</p>

                <ul className="space-y-4 mb-10 pt-4">
                  {opt.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm font-bold text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button className="w-full py-4 bg-gray-900 text-white hover:bg-emerald-800 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-gray-900/10 active:scale-[0.98]">
                  Select Tier <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Managed Campaigns Feature Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gray-900 rounded-[4rem] p-12 sm:p-20 text-white flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative shadow-2xl shadow-emerald-900/10">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <Zap className="w-96 h-96 text-emerald-400 rotate-12" />
            </div>
            
            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/30 text-emerald-400 rounded-full mb-8 border border-emerald-700/30">
                <Star className="w-4 h-4 fill-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Featured Partner Option</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-[0.95] tracking-tighter">Fully Managed <br/>Multi-Channel Campaigns</h2>
              <p className="text-xl text-emerald-100/60 mb-12 font-medium leading-relaxed max-w-xl">
                For startups ready for hyper-growth. We handle the strategy, creative production, and continuous optimization so you can stay focused on building.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 mb-12">
                 <div className="space-y-2">
                   <h4 className="font-black text-emerald-400 uppercase text-[10px] tracking-widest">Global Reach</h4>
                   <p className="text-sm font-bold text-emerald-50">Web, Newsletter, Social, and Community placements for maximum Ummah impact.</p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="font-black text-emerald-400 uppercase text-[10px] tracking-widest">A/B Testing</h4>
                   <p className="text-sm font-bold text-emerald-50">Continuous creative optimization driven by data and community engagement.</p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="font-black text-emerald-400 uppercase text-[10px] tracking-widest">Performance</h4>
                   <p className="text-sm font-bold text-emerald-50">Real-time reporting dashboards with granular conversion tracking.</p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="font-black text-emerald-400 uppercase text-[10px] tracking-widest">White Glove</h4>
                   <p className="text-sm font-bold text-emerald-50">Dedicated account managers providing strategic insights and weekly syncs.</p>
                 </div>
              </div>

              <button className="px-12 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/40 active:scale-[0.98]">
                Schedule a Call
              </button>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col gap-4 relative z-10">
               <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">1</div>
                   <h4 className="font-black text-sm uppercase tracking-widest">Discovery</h4>
                 </div>
                 <p className="text-xs text-white/50 leading-relaxed font-medium">We define your goals and identify target demographics within our global ecosystem.</p>
               </div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl translate-x-4">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">2</div>
                   <h4 className="font-black text-sm uppercase tracking-widest">Execution</h4>
                 </div>
                 <p className="text-xs text-white/50 leading-relaxed font-medium">Our designers create bespoke assets optimized for our community's aesthetic.</p>
               </div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl translate-x-8">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">3</div>
                   <h4 className="font-black text-sm uppercase tracking-widest">Scale</h4>
                 </div>
                 <p className="text-xs text-white/50 leading-relaxed font-medium">We launch, monitor, and scale your spend based on verified performance metrics.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Trusted by the Ummah's Leading Brands</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-black text-2xl text-gray-900 italic tracking-tighter">FinDeen</div>
             <div className="flex items-center gap-2 font-black text-2xl text-gray-900 tracking-tight">ETHIC.AI</div>
             <div className="flex items-center gap-2 font-black text-2xl text-gray-900">UmmahHub</div>
             <div className="flex items-center gap-2 font-black text-2xl text-gray-900 tracking-widest uppercase">Baraka</div>
             <div className="flex items-center gap-2 font-black text-2xl text-gray-900 italic">HalalWallet</div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-40 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-800 mx-auto mb-12 shadow-inner">
            <Mail className="w-10 h-10" />
          </div>
          <h2 className="text-5xl sm:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">Ready to grow your <br/>Ummah presence?</h2>
          <p className="text-xl text-gray-500 mb-12 font-medium leading-relaxed max-w-xl mx-auto">
            Join the only discovery platform dedicated to the long-term success of Halal-conscious digital builders.
          </p>
          <button className="px-16 py-6 bg-emerald-800 text-white rounded-[2.5rem] font-black text-xl hover:bg-emerald-900 transition-all active:scale-[0.98] shadow-2xl shadow-emerald-900/30">
            Contact Advertising Sales
          </button>
          <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Direct Inquiries: partners@muslimhunt.com</p>
        </div>
      </section>
    </div>
  );
};

export default Sponsor;
