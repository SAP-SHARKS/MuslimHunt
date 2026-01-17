import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, MessageCircle, Heart, Share2, User, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Story, StoryComment } from '../types';

interface StoryDetailProps {
  storySlug: string;
  onBack: () => void;
}

const StoryDetail: React.FC<StoryDetailProps> = ({ storySlug, onBack }) => {
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<StoryComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // Fetch story details
  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          category:story_categories(*)
        `)
        .eq('slug', storySlug)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching story:', error);
      } else if (data) {
        setStory(data);
        // Increment view count
        await supabase
          .from('stories')
          .update({ views_count: data.views_count + 1 })
          .eq('id', data.id);
      }

      setLoading(false);
    };

    fetchStory();
  }, [storySlug]);

  // Fetch comments
  useEffect(() => {
    if (story) {
      const fetchComments = async () => {
        const { data, error } = await supabase
          .from('story_comments')
          .select('*')
          .eq('story_id', story.id)
          .order('created_at', { ascending: false });

        if (data) {
          setComments(data);
        }
      };

      fetchComments();
    }
  }, [story]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const toggleCommentExpand = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((paragraph, idx) => {
      if (paragraph.trim()) {
        // Handle headings
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">
              {paragraph.slice(3)}
            </h2>
          );
        }
        if (paragraph.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-3xl sm:text-4xl font-bold text-gray-900 mt-8 mb-4">
              {paragraph.slice(2)}
            </h1>
          );
        }

        // Handle bullet points
        if (paragraph.includes('\n- ')) {
          const items = paragraph.split('\n').filter(line => line.startsWith('- '));
          return (
            <ul key={idx} className="space-y-2 my-4 ml-6">
              {items.map((item, i) => (
                <li key={i} className="text-base sm:text-lg text-gray-700 leading-relaxed list-disc">
                  {item.slice(2)}
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraphs
        return (
          <p key={idx} className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            {paragraph}
          </p>
        );
      }
      return null;
    });
  };

  const organizeComments = (comments: StoryComment[]) => {
    const commentMap = new Map<string, StoryComment & { replies: StoryComment[] }>();
    const rootComments: (StoryComment & { replies: StoryComment[] })[] = [];

    // Initialize all comments with empty replies array
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Organize into tree structure
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const renderComment = (comment: StoryComment & { replies: StoryComment[] }, depth: number = 0) => {
    const isExpanded = expandedComments.has(comment.id);
    const hasReplies = comment.replies.length > 0;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-start gap-3">
            {comment.avatar_url ? (
              <img
                src={comment.avatar_url}
                alt={comment.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                {comment.username.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">{comment.username}</span>
                <span className="text-xs text-gray-500">{formatRelativeTime(comment.created_at)}</span>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.text}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{comment.likes_count}</span>
                </button>
                <button className="hover:text-primary transition-colors">Reply</button>
                {hasReplies && (
                  <button
                    onClick={() => toggleCommentExpand(comment.id)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Hide replies ({comment.replies.length})</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>View replies ({comment.replies.length})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Render replies */}
        {hasReplies && isExpanded && (
          <div className="mt-2">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Story not found</h2>
          <p className="text-gray-600 mb-6">The story you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  const organizedComments = organizeComments(comments);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Stories
          </button>
        </div>
      </div>

      {/* Article Header */}
      <article className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Badge */}
          {story.category && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
              {story.category.name}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            {story.title}
          </h1>

          {/* Subtitle */}
          {story.subtitle && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {story.subtitle}
            </p>
          )}

          {/* Author & Meta Info */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
            <div className="flex items-center gap-3">
              {story.author_avatar_url ? (
                <img
                  src={story.author_avatar_url}
                  alt={story.author_name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                  {story.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900">{story.author_name}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(story.published_at)}
                  </span>
                  {story.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {story.reading_time} min read
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="font-semibold">{story.likes_count}</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cover Image */}
          {story.cover_image_url && (
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-12">
              <img
                src={story.cover_image_url}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {renderContent(story.content)}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Comments ({story.comments_count})
            </h2>

            {/* Comment Input */}
            <div className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
                rows={4}
              />
              <div className="flex justify-end mt-3">
                <button
                  disabled={!commentText.trim()}
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            {organizedComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div>
                {organizedComments.map(comment => renderComment(comment))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
