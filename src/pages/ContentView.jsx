import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import {
  FaBook,
  FaTag,
  FaUser,
  FaEye,
  FaDownload,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaChartLine,
  FaEdit,
  FaExternalLinkAlt,
  FaFilePdf,
  FaFileImage,
  FaVolumeUp
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * multer-storage-cloudinary stores the Cloudinary secure_url in file.path.
 * This helper ensures we always get a proper https:// Cloudinary URL.
 */
const resolveFileUrl = (url) => {
  if (!url) return '';
  // Already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Relative path stored by accident — nothing we can do client-side
  return url;
};

// ─── Media Renderer ───────────────────────────────────────────────────────────

const MediaRenderer = ({ content }) => {
  const { contentType, fileUrl: rawUrl, title } = content;
  const fileUrl = resolveFileUrl(rawUrl);
  const [pdfFallback, setPdfFallback] = useState(false);

  // Debug — remove after confirming URLs are correct
  useEffect(() => {
    console.log('[MediaRenderer]', { contentType, fileUrl });
  }, [contentType, fileUrl]);

  if (!fileUrl) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        No media file attached to this content.
      </div>
    );
  }

  switch (contentType) {
    // ── Video ────────────────────────────────────────────────────────────────
    case 'video':
      return (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            🎥 Video
          </h2>
          <div className="rounded-xl overflow-hidden bg-black shadow-lg aspect-video">
            <video
              key={fileUrl}
              controls
              controlsList="nodownload"
              className="w-full h-full"
              preload="metadata"
            >
              <source src={fileUrl} />
              <p className="text-white p-4">
                Your browser cannot play this video.{' '}
                <a href={fileUrl} className="underline" target="_blank" rel="noreferrer">
                  Open directly
                </a>
              </p>
            </video>
          </div>
        </div>
      );

    // ── Audio ────────────────────────────────────────────────────────────────
    case 'audio':
      return (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <FaVolumeUp className="text-primary-600 dark:text-primary-400" /> Audio
          </h2>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-6 border border-primary-200 dark:border-primary-700">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-2xl shadow-md">
                <FaVolumeUp />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Audio Content</p>
              </div>
            </div>
            {/* key forces re-mount when URL changes */}
            <audio key={fileUrl} controls className="w-full" preload="metadata">
              <source src={fileUrl} type="audio/mpeg" />
              <source src={fileUrl} type="audio/ogg" />
              <source src={fileUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-3 text-right">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 justify-end"
              >
                <FaExternalLinkAlt className="text-xs" /> Open in new tab
              </a>
            </div>
          </div>
        </div>
      );

    // ── PDF ──────────────────────────────────────────────────────────────────
    case 'pdf': {
      /**
       * Cloudinary stores PDFs under /image/upload/. Browsers can embed them
       * directly via the secure_url. We add fl_attachment:false to ensure
       * Cloudinary serves it inline rather than as a download.
       *
       * If the iframe fails (CSP / browser policy), we show a download button.
       */
      const pdfEmbedUrl = fileUrl.includes('cloudinary.com')
  ? fileUrl.replace('/upload/', '/upload/fl_attachment:false/')
  : fileUrl;

      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaFilePdf className="text-red-500" /> PDF Document
            </h2>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              <FaExternalLinkAlt className="text-xs" /> Open in new tab
            </a>
          </div>

          {!pdfFallback ? (
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <iframe
  src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
  className="w-full"
  style={{ height: '78vh' }}
/>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-10 text-center bg-gray-50 dark:bg-gray-800/50">
              <FaFilePdf className="text-red-400 text-5xl mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This PDF cannot be displayed inline. Open it directly:
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <FaExternalLinkAlt /> Open PDF
              </a>
            </div>
          )}
        </div>
      );
    }

    // ── Image ────────────────────────────────────────────────────────────────
    case 'image':
      return (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <FaFileImage className="text-primary-600 dark:text-primary-400" /> Image
          </h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <img
              key={fileUrl}
              src={fileUrl}
              alt={title}
              className="max-w-full h-auto max-h-[75vh] object-contain rounded-lg"
              loading="lazy"
              onError={(e) => {
                console.error('[Image] Failed to load:', fileUrl);
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="mt-2 text-right">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 justify-end"
            >
              <FaExternalLinkAlt className="text-xs" /> Open full size
            </a>
          </div>
        </div>
      );

    // ── Text-only (no media file) ─────────────────────────────────────────────
    case 'text':
    default:
      return null;
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ContentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchContent();
    if (user) fetchProgress();
  }, [id, user]);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/content/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = res.data.data;
      setContent(data);
      setLiked(data.likes?.includes(user?._id));

      // Debug
      console.log('[ContentView] loaded:', {
        contentType: data.contentType,
        fileUrl: data.fileUrl,
        hasTextContent: !!data.textContent
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/progress/content/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(res.data.data); // null if no progress yet
    } catch {
      // Silently ignore
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like content');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/content/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(!liked);
      toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Failed to update like status');
    }
  };

  const handleDownload = async () => {
    if (!user) return toast.error('Please login to download');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/content/${id}/download`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.open(content.fileUrl, '_blank');
    } catch {
      toast.error('Failed to initiate download');
    }
  };

  const markAsComplete = async () => {
    if (!user) return toast.error('Please login to track progress');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/progress`,
        { contentId: id, status: 'completed', progressPercentage: 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Marked as completed!');
      fetchProgress();
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const getDifficultyColor = (d) => {
    switch (d) {
      case 'beginner':     return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':     return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:             return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getContentTypeIcon = (t) => {
    switch (t) {
      case 'video': return '🎥';
      case 'audio': return '🔊';
      case 'pdf':   return '📄';
      case 'image': return '🖼️';
      case 'text':  return '📝';
      default:      return '📚';
    }
  };

  // Show media player for every type except pure text
  const hasMediaFile = content?.fileUrl && content?.contentType !== 'text';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400" />
        </div>
      </Layout>
    );
  }

  if (!content) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Content Not Found</h2>
          <button onClick={() => navigate('/content')} className="btn-primary">Back to Library</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        {/* ── Back + Header card ────────────────────────────────────────────── */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{getContentTypeIcon(content.contentType)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                    {content.difficulty}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{content.title}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">{content.description}</p>
              </div>

              <div className="flex gap-2 ml-4">
                {user && (user.role === 'teacher' || user.role === 'admin') &&
                 (content.createdBy._id === user._id || user.role === 'admin') && (
                  <button
                    onClick={() => navigate(`/content/${id}/edit`)}
                    className="p-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    title="Edit content"
                  >
                    <FaEdit />
                  </button>
                )}
                <button
                  onClick={handleLike}
                  className={`p-3 rounded-lg border transition-colors ${
                    liked
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {liked ? <FaHeart /> : <FaRegHeart />}
                </button>
                {content.fileUrl && (
                  <button
                    onClick={handleDownload}
                    className="p-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <FaBook className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className="font-medium">{content.subject}</span>
              </div>
              <div className="flex items-center">
                <FaTag className="mr-2 text-primary-600 dark:text-primary-400" />
                <span>Grade {content.grade}</span>
              </div>
              <div className="flex items-center">
                <FaUser className="mr-2 text-primary-600 dark:text-primary-400" />
                <span>{content.createdBy?.name}</span>
              </div>
              <div className="flex items-center">
                <FaEye className="mr-2 text-primary-600 dark:text-primary-400" />
                <span>{content.views} views</span>
              </div>
              <div className="flex items-center">
                <FaDownload className="mr-2 text-primary-600 dark:text-primary-400" />
                <span>{content.downloads} downloads</span>
              </div>
            </div>

            {/* Tags */}
            {content.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {content.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {progress && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{progress.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progressPercentage}%` }}
                  />
                </div>
                {progress.status === 'completed' && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    ✓ Completed on {new Date(progress.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Mark complete */}
            {user?.role === 'student' && (!progress || progress.status !== 'completed') && (
              <button onClick={markAsComplete} className="btn-primary flex items-center">
                <FaChartLine className="mr-2" /> Mark as Completed
              </button>
            )}
          </div>
        </div>

        {/* ── Media Player ──────────────────────────────────────────────────── */}
        {hasMediaFile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <MediaRenderer content={content} />
          </div>
        )}

        {/* ── Text / Markdown Content ───────────────────────────────────────── */}
        {content.textContent && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
            {hasMediaFile && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">📝 Written Content</h2>
            )}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 pb-2 border-b-2 border-primary-200 dark:border-primary-800" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-5 mb-2" {...props} />,
                  h4: ({ node, ...props }) => <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2" {...props} />,
                  p:  ({ node, ...props }) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
                  li: ({ node, ...props }) => <li className="ml-4 dark:text-gray-300" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />,
                  em: ({ node, ...props }) => <em className="italic text-gray-800 dark:text-gray-200" {...props} />,
                  code: ({ node, inline, ...props }) =>
                    inline
                      ? <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400 rounded text-sm font-mono" {...props} />
                      : <code className="block p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg overflow-x-auto mb-4 font-mono text-sm" {...props} />,
                  pre: ({ node, ...props }) => <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary-500 dark:border-primary-400 pl-4 italic text-gray-700 dark:text-gray-300 my-4" {...props} />,
                  table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700" {...props} /></div>,
                  thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
                  tbody: ({ node, ...props }) => <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700" {...props} />,
                  tr:   ({ node, ...props }) => <tr {...props} />,
                  th:   ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider" {...props} />,
                  td:   ({ node, ...props }) => <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300" {...props} />,
                  a:    ({ node, ...props }) => <a className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline" {...props} />,
                }}
              >
                {content.textContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* No content at all */}
        {!hasMediaFile && !content.textContent && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center mb-6">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No content available yet.</p>
          </div>
        )}

        {/* ── About card ────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">About this Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              ['Subject',      content.subject],
              ['Grade Level',  `Class ${content.grade}`],
              ['Difficulty',   content.difficulty],
              ['Content Type', content.contentType],
              ['Created By',   content.createdBy?.name],
              ['Published',    new Date(content.createdAt).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-gray-600 dark:text-gray-400 mb-1">{label}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default ContentView;