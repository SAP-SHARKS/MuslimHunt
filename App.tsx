
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SubmitForm from './components/SubmitForm';
import { Product, User, View, Comment } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { Shield, Sparkles, LogIn } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [votes, setVotes] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persistence
  useEffect(() => {
    const savedProducts = localStorage.getItem('mh_products_v2');
    const savedVotes = localStorage.getItem('mh_votes');
    const savedUser = localStorage.getItem('mh_user');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(INITIAL_PRODUCTS);

    if (savedVotes) setVotes(new Set(JSON.parse(savedVotes)));
    if (savedUser) setUser(JSON.parse(savedUser));
    
    setIsLoading(false);
  }, []);

  // Sync persistence
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mh_products_v2', JSON.stringify(products));
      localStorage.setItem('mh_votes', JSON.stringify(Array.from(votes)));
    }
  }, [products, votes, isLoading]);

  const handleLogin = () => {
    const mockUser = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      email: 'brother@ummah.com',
      username: 'Saad Al-Ummah',
      avatar_url: 'https://i.pravatar.cc/150?u=saad'
    };
    setUser(mockUser);
    localStorage.setItem('mh_user', JSON.stringify(mockUser));
    setView(View.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mh_user');
    setView(View.HOME);
  };

  const handleUpvote = (productId: string) => {
    if (!user) {
      setView(View.LOGIN);
      return;
    }

    const voteKey = `${user.id}_${productId}`;
    setVotes(prev => {
      const next = new Set(prev);
      if (next.has(voteKey)) {
        next.delete(voteKey);
        setProducts(curr => curr.map(p => p.id === productId ? { ...p, upvotes_count: p.upvotes_count - 1 } : p));
      } else {
        next.add(voteKey);
        setProducts(curr => curr.map(p => p.id === productId ? { ...p, upvotes_count: p.upvotes_count + 1 } : p));
      }
      return next;
    });
  };

  const handleNewProduct = (formData: any) => {
    const newProduct: Product = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      founder_id: user?.id || 'anonymous',
      upvotes_count: 0,
      comments: []
    };
    setProducts([newProduct, ...products]);
    setView(View.HOME);
  };

  const handleAddComment = (text: string) => {
    if (!user || !selectedProduct) return;
    
    const newComment: Comment = {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
      text,
      created_at: new Date().toISOString(),
      is_maker: selectedProduct.founder_id === user.id
    };

    setProducts(prev => prev.map(p => {
      if (p.id === selectedProduct.id) {
        const updated = { ...p, comments: [newComment, ...(p.comments || [])] };
        setSelectedProduct(updated);
        return updated;
      }
      return p;
    }));
  };

  const groupedProducts = useMemo(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    return {
      today: products.filter(p => new Date(p.created_at).toDateString() === today),
      yesterday: products.filter(p => new Date(p.created_at).toDateString() === yesterday),
      past: products.filter(p => {
        const d = new Date(p.created_at).toDateString();
        return d !== today && d !== yesterday;
      })
    };
  }, [products]);

  const renderContent = () => {
    if (view === View.LOGIN) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-6 text-emerald-800 shadow-xl shadow-emerald-100">
            <Shield className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-emerald-900 mb-4">Assalamu Alaikum</h2>
          <p className="text-gray-500 mb-8 text-lg">Join the premier gateway for discoverable Halal tech.</p>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-emerald-800 hover:bg-emerald-900 text-white py-5 rounded-2xl font-black shadow-lg transition-all active:scale-[0.98] text-xl"
          >
            <LogIn className="w-6 h-6" />
            Sign in with Email
          </button>
        </div>
      );
    }

    if (view === View.SUBMIT) {
      return <SubmitForm onCancel={() => setView(View.HOME)} onSubmit={handleNewProduct} />;
    }

    if (view === View.DETAIL && selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct} 
          user={user}
          onBack={() => setView(View.HOME)}
          onUpvote={handleUpvote}
          hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)}
          onAddComment={handleAddComment}
        />
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Hero Section */}
        <header className="mb-12 text-center md:text-left md:flex md:items-center md:justify-between border-b border-emerald-50 pb-12">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-800 font-black mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs tracking-[0.2em] uppercase">Halal Trust Layer</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-emerald-900 leading-[1.1]">
              Discovery for the <br /><span className="text-emerald-700 italic">Modern Ummah.</span>
            </h1>
          </div>
          <div className="hidden md:block max-w-[200px] text-gray-400 font-bold text-xs leading-loose tracking-widest text-right">
            CURATED SOFTWARE<br />BUILT BY BELIEVERS<br />FOR THE GLOBAL HUB
          </div>
        </header>

        <main className="space-y-16">
          {groupedProducts.today.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-emerald-800/40 mb-6 uppercase tracking-[0.3em]">Freshly Launched</h2>
              <div className="space-y-3 bg-white rounded-[2rem] border border-gray-100 p-3 shadow-sm">
                {groupedProducts.today.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onUpvote={handleUpvote} 
                    hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                    onClick={(prod) => { setSelectedProduct(prod); setView(View.DETAIL); }}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedProducts.yesterday.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-gray-300 mb-6 uppercase tracking-[0.3em]">Yesterday's Highlights</h2>
              <div className="space-y-3 bg-white/50 rounded-[2rem] border border-gray-100 p-3 shadow-sm">
                {groupedProducts.yesterday.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onUpvote={handleUpvote} 
                    hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                    onClick={(prod) => { setSelectedProduct(prod); setView(View.DETAIL); }}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedProducts.past.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-gray-300 mb-6 uppercase tracking-[0.3em]">The Archives</h2>
              <div className="space-y-3 bg-white/50 rounded-[2rem] border border-gray-100 p-3 shadow-sm">
                {groupedProducts.past.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onUpvote={handleUpvote} 
                    hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                    onClick={(prod) => { setSelectedProduct(prod); setView(View.DETAIL); }}
                  />
                ))}
              </div>
            </section>
          )}
          
          {!products.length && (
            <div className="text-center py-20 bg-white border-4 border-dashed border-emerald-50 rounded-[3rem]">
              <p className="text-emerald-900/20 font-serif text-3xl italic">Awaiting the next great launch...</p>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar user={user} currentView={view} setView={setView} onLogout={handleLogout} />
      <div className="pt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
