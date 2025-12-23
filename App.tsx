
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SubmitForm from './components/SubmitForm';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { Product, User, View, Comment } from './types';
import { Sparkles, X, Search, Loader2, Rocket } from 'lucide-react';
import { supabase } from './lib/supabase';
import { searchProducts } from './utils/searchUtils';
import { INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [votes, setVotes] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldScrollToComments, setShouldScrollToComments] = useState(false);

  // Auth State Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Member',
          avatar_url: session.user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Member',
          avatar_url: session.user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data directly from Supabase (Source of Truth)
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, comments(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error details:', error);
        throw error;
      }
      
      // FIX: If the fetch is successful, we use the returned data even if it's empty [].
      // We no longer fallback to INITIAL_PRODUCTS here because mock IDs break database constraints.
      setProducts(data as Product[] || []);

      if (selectedProduct) {
        const updated = (data || []).find(p => p.id === selectedProduct.id);
        if (updated) setSelectedProduct(updated as Product);
      }
      
      const session = await supabase.auth.getSession();
      const currentUserId = session.data.session?.user?.id;
      if (currentUserId) {
        const { data: voteData } = await supabase
          .from('votes')
          .select('product_id')
          .eq('user_id', currentUserId);
        
        const voteSet = new Set<string>();
        voteData?.forEach(v => voteSet.add(`${currentUserId}_${v.product_id}`));
        setVotes(voteSet);
      }
    } catch (err: any) {
      console.error('Fetch operation failed:', err);
      // ONLY use mock data if the network request fails completely, to keep UI from being a blank screen
      if (products.length === 0) {
        setProducts(INITIAL_PRODUCTS);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView(View.HOME);
    setVotes(new Set());
  };

  const handleUpvote = async (productId: string) => {
    if (!user) {
      setView(View.LOGIN);
      return;
    }

    const voteKey = `${user.id}_${productId}`;
    const hasVoted = votes.has(voteKey);

    try {
      if (hasVoted) {
        await supabase.from('votes').delete().match({ user_id: user.id, product_id: productId });
        const p = products.find(prod => prod.id === productId);
        if (p) {
          await supabase.from('products').update({ upvotes_count: Math.max(0, (p.upvotes_count || 1) - 1) }).eq('id', productId);
        }
      } else {
        await supabase.from('votes').insert({ user_id: user.id, product_id: productId });
        const p = products.find(prod => prod.id === productId);
        if (p) {
          await supabase.from('products').update({ upvotes_count: (p.upvotes_count || 0) + 1 }).eq('id', productId);
        }
      }
      await fetchProducts();
    } catch (err: any) {
      console.error('Upvote error details:', err);
    }
  };

  const handleNewProduct = async (formData: any) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.from('products').insert([{
        name: formData.name,
        website_url: formData.url,
        tagline: formData.tagline,
        description: formData.description,
        logo_url: formData.logo_url,
        category: formData.category,
        halal_status: formData.halal_status,
        sadaqah_info: formData.sadaqah_info,
        user_id: user.id,
        upvotes_count: 0
      }]).select();

      if (error) throw error;
      if (data) {
        await fetchProducts();
        setView(View.HOME);
      }
    } catch (err: any) {
      console.error('Launch error details:', err);
    }
  };

  const handleAddComment = async (text: string) => {
    if (!user || !selectedProduct) {
      console.error("User must be logged in to comment.");
      return;
    }

    // GUARD: Prevent commenting on mock products (placeholders)
    if (selectedProduct.id.startsWith('00000000')) {
      alert("You cannot comment on sample products. Please launch your own real product or comment on a product retrieved from the live database.");
      return;
    }
    
    // Explicit mapping: ensuring product_id uses the real database UUID
    const newCommentData = {
      product_id: selectedProduct.id, 
      user_id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
      text: text, 
      is_maker: selectedProduct.user_id === user.id, // Maker Ownership Check
    };

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([newCommentData])
        .select();

      if (error) {
        console.error('Supabase Error Details:', error.message, error.details);
        throw error;
      }

      if (data && data[0]) {
        const savedComment = data[0] as Comment;
        setProducts(prev => prev.map(p => {
          if (p.id === selectedProduct.id) {
            const updatedProduct = { 
              ...p, 
              comments: [savedComment, ...(p.comments || [])] 
            };
            if (selectedProduct.id === p.id) {
              setSelectedProduct(updatedProduct as Product);
            }
            return updatedProduct as Product;
          }
          return p;
        }));
      }
    } catch (err: any) {
      console.error("Full technical error details:", err);
      alert(`Error: ${err.message || "Could not save comment."}`);
    }
  };

  const handleViewProfile = (userId: string, username: string, email: string, avatar: string) => {
    setSelectedUser({
      id: userId,
      username,
      email,
      avatar_url: avatar
    });
    setView(View.PROFILE);
  };

  const handleProductClick = (product: Product, andScrollToComments: boolean = false) => {
    setSelectedProduct(product);
    setShouldScrollToComments(andScrollToComments);
    setView(View.DETAIL);
  };

  const groupedProducts = useMemo(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    const filteredProducts = searchProducts(products, searchQuery);
    const sorted = [...filteredProducts].sort((a, b) => b.upvotes_count - a.upvotes_count);
    
    return {
      today: sorted.filter(p => new Date(p.created_at).toDateString() === today),
      yesterday: sorted.filter(p => new Date(p.created_at).toDateString() === yesterday),
      past: sorted.filter(p => {
        const d = new Date(p.created_at).toDateString();
        return d !== today && d !== yesterday;
      })
    };
  }, [products, searchQuery]);

  const renderContent = () => {
    if (isLoading && products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-emerald-800 animate-spin mb-4" />
          <p className="text-emerald-900 font-serif text-xl italic">Gathering the Ummah's best...</p>
        </div>
      );
    }

    if (view === View.LOGIN) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <Auth onSuccess={() => setView(View.HOME)} />
        </div>
      );
    }

    if (view === View.SUBMIT) {
      return <SubmitForm onCancel={() => setView(View.HOME)} onSubmit={handleNewProduct} />;
    }

    if (view === View.PROFILE && selectedUser) {
      return (
        <UserProfile
          profileUser={selectedUser}
          currentUser={user}
          products={products}
          votes={votes}
          onBack={() => setView(View.HOME)}
          onProductClick={(prod) => handleProductClick(prod)}
          onCommentClick={(prod) => handleProductClick(prod, true)}
          onUpvote={handleUpvote}
        />
      );
    }

    if (view === View.DETAIL && selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct} 
          user={user}
          onBack={() => {
            setView(View.HOME);
            setShouldScrollToComments(false);
          }}
          onUpvote={handleUpvote}
          hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)}
          onAddComment={handleAddComment}
          onViewProfile={handleViewProfile}
          scrollToComments={shouldScrollToComments}
        />
      );
    }

    const totalResults = groupedProducts.today.length + groupedProducts.yesterday.length + groupedProducts.past.length;

    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="mb-12 text-center md:text-left md:flex md:items-center md:justify-between border-b border-emerald-50 pb-12">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-800 font-black mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs tracking-[0.2em] uppercase">Halal Trust Layer</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-emerald-900 leading-[1.05] tracking-tight">
              Discovery for the <br /><span className="text-emerald-700 italic">Modern Ummah.</span>
            </h1>
          </div>
          <div className="hidden md:block max-w-[200px] text-gray-400 font-black text-[10px] leading-loose tracking-[0.2em] text-right opacity-60">
            CURATED SOFTWARE<br />BUILT BY BELIEVERS<br />FOR THE GLOBAL HUB
          </div>
        </header>

        {searchQuery && (
          <div className="max-w-4xl mx-auto mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-emerald-900 font-bold">
                  Found {totalResults} {totalResults === 1 ? 'product' : 'products'} matching "{searchQuery}"
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-emerald-800 hover:text-emerald-900 font-bold text-sm flex items-center gap-2 px-3 py-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                Clear search
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <main className="space-y-16">
          {totalResults > 0 ? (
            <>
              {groupedProducts.today.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-black text-emerald-800/40 uppercase tracking-[0.3em]">Freshly Launched</h2>
                    <div className="h-[1px] flex-1 bg-emerald-50 ml-6"></div>
                  </div>
                  <div className="space-y-3 bg-white rounded-[2.5rem] border border-gray-100 p-3 shadow-sm">
                    {groupedProducts.today.map(p => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onUpvote={handleUpvote} 
                        hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                        onClick={(prod) => handleProductClick(prod)}
                        onCommentClick={(prod) => handleProductClick(prod, true)}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                </section>
              )}

              {groupedProducts.yesterday.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Trending Yesterday</h2>
                    <div className="h-[1px] flex-1 bg-gray-50 ml-6"></div>
                  </div>
                  <div className="space-y-3 bg-white/50 rounded-[2.5rem] border border-gray-100 p-3 shadow-sm">
                    {groupedProducts.yesterday.map(p => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onUpvote={handleUpvote} 
                        hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                        onClick={(prod) => handleProductClick(prod)}
                        onCommentClick={(prod) => handleProductClick(prod, true)}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                </section>
              )}

              {groupedProducts.past.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">The Archives</h2>
                    <div className="h-[1px] flex-1 bg-gray-50 ml-6"></div>
                  </div>
                  <div className="space-y-3 bg-white/30 rounded-[2.5rem] border border-gray-100 p-3 shadow-sm">
                    {groupedProducts.past.map(p => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onUpvote={handleUpvote} 
                        hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                        onClick={(prod) => handleProductClick(prod)}
                        onCommentClick={(prod) => handleProductClick(prod, true)}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-white border-4 border-dashed border-emerald-50 rounded-[4rem] flex flex-col items-center justify-center px-8">
              <Rocket className="w-16 h-16 text-emerald-100 mb-6" />
              <p className="text-emerald-900 font-serif text-3xl italic mb-3">The launchpad is ready.</p>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                {searchQuery 
                  ? `No products found matching "${searchQuery}".`
                  : "Be the first to share your Halal-conscious tech product with the global Muslim community."}
              </p>
              <button
                onClick={() => searchQuery ? setSearchQuery('') : setView(View.SUBMIT)}
                className="px-8 py-4 bg-emerald-800 text-white rounded-2xl font-black hover:bg-emerald-900 transition-all shadow-xl active:scale-95"
              >
                {searchQuery ? 'Clear Search' : 'Launch First Product'}
              </button>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        user={user} 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewProfile={() => {
          if (user) {
            handleViewProfile(user.id, user.username, user.email, user.avatar_url);
          }
        }}
      />
      <div className="pt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
