import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, MessageCircle, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Story, StoryCategory } from '../types';

interface StoriesProps {
  onStoryClick: (storySlug: string) => void;
  categorySlug?: string;
}

const Stories: React.FC<StoriesProps> = ({ onStoryClick, categorySlug }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<StoryCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(categorySlug || 'all');
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('story_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  // Fetch stories based on active category
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);

      let query = supabase
        .from('stories')
        .select(`
          *,
          category:story_categories(*)
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      // Filter by category if not "all"
      if (activeCategory !== 'all') {
        const category = categories.find(c => c.slug === activeCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching stories:', error);
      } else if (data) {
        setStories(data);
      }

      setLoading(false);
    };

    if (categories.length > 0) {
      fetchStories();
    }
  }, [activeCategory, categories]);

  // Update active category when categorySlug prop changes
  useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    }
  }, [categorySlug]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    const newUrl = slug === 'all'
      ? 'https://muslim-hunt.vercel.app/stories'
      : `https://muslim-hunt.vercel.app/stories/category/${slug}`;
    window.history.pushState(null, '', newUrl);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-b border-gray-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4">
              <BookOpen className="w-3 h-3" />
              Stories
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4">
              Muslim Hunt Stories
            </h1>
            <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
              Insights, interviews, and stories from the Muslim maker community. Discover the journeys behind the products.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.slug;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-bold text-sm sm:text-base whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <article
                key={story.id}
                onClick={() => onStoryClick(story.slug)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Cover Image */}
                {story.cover_image_url && (
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={story.cover_image_url}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  {story.category && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                      {story.category.name}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {story.title}
                  </h2>

                  {/* Subtitle/Excerpt */}
                  {(story.subtitle || story.excerpt) && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {story.subtitle || story.excerpt}
                    </p>
                  )}

                  {/* Author & Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {story.author_avatar_url ? (
                        <img
                          src={story.author_avatar_url}
                          alt={story.author_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          {story.author_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{story.author_name}</p>
                        <p className="text-xs text-gray-500">{formatDate(story.published_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                      {story.reading_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{story.reading_time} min</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{story.comments_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
