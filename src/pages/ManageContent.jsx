import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ManageContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    grade: '10',
    contentType: 'text',
    textContent: '',
    difficulty: 'intermediate',
    tags: '',
    duration: 0
  });
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchContent();
    }
  }, [id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/content/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const content = res.data.data;
      
      // Check if user owns this content
      if (content.createdBy._id !== user._id && user.role !== 'admin') {
        toast.error('You do not have permission to edit this content');
        navigate('/dashboard');
        return;
      }

      setFormData({
        title: content.title,
        description: content.description,
        subject: content.subject,
        grade: content.grade.toString(),
        contentType: content.contentType,
        textContent: content.textContent || '',
        difficulty: content.difficulty,
        tags: content.tags?.join(', ') || '',
        duration: content.duration || 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEdit && formData.contentType !== 'text' && !uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      if (isEdit) {
        // Update existing content
        const updateData = {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        };

        await axios.put(
          `${import.meta.env.VITE_API_URL}/content/${id}`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success('Content updated successfully!');
      } else {
        // Create new content
        const submitFormData = new FormData();
        
        Object.keys(formData).forEach(key => {
          if (key === 'tags') {
            submitFormData.append(key, formData[key]);
          } else {
            submitFormData.append(key, formData[key]);
          }
        });
        
        if (uploadFile) {
          submitFormData.append('file', uploadFile);
        }

        await axios.post(
          `${import.meta.env.VITE_API_URL}/content`,
          submitFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Content created successfully!');
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error(error.response?.data?.message || 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading && isEdit) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {isEdit ? 'Edit Content' : 'Create New Content'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEdit ? 'Update your educational content' : 'Add new educational material to the library'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input
                  type="text"
                  name="title"
                  className="input"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to Algebra"
                  required
                />
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea
                  name="description"
                  className="input"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the content..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Subject *</label>
                  <select
                    name="subject"
                    className="input"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="General Knowledge">General Knowledge</option>
                  </select>
                </div>

                <div>
                  <label className="label">Grade Level *</label>
                  <select
                    name="grade"
                    className="input"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Content Type *</label>
                  <select
                    name="contentType"
                    className="input"
                    value={formData.contentType}
                    onChange={handleInputChange}
                    required
                    disabled={isEdit}
                  >
                    <option value="text">Text/Markdown</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="pdf">PDF Document</option>
                    <option value="image">Image</option>
                  </select>
                  {isEdit && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Content type cannot be changed
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Difficulty Level *</label>
                  <select
                    name="difficulty"
                    className="input"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="input"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., algebra, equations, mathematics, grade-10"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add relevant tags to help students find this content
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Content Details</h2>
            
            {formData.contentType === 'text' ? (
              <div>
                <label className="label">
                  Content (Markdown Supported) *
                </label>
                <textarea
                  name="textContent"
                  className="input font-mono text-sm"
                  rows="20"
                  value={formData.textContent}
                  onChange={handleInputChange}
                  placeholder="Enter your content here... You can use Markdown formatting.

Example:
# Main Heading
## Sub Heading
**Bold Text**
*Italic Text*
- List item 1
- List item 2

1. Numbered item
2. Another item

```code block```

> Blockquote"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 Tip: Use Markdown formatting for better content presentation. 
                  Supports headings, lists, code blocks, tables, and more!
                </p>
              </div>
            ) : (
              <div>
                <label className="label">
                  {isEdit ? 'Upload New File (Optional)' : 'Upload File *'}
                </label>
                <input
                  type="file"
                  className="input"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  accept={
                    formData.contentType === 'video' ? 'video/*' :
                    formData.contentType === 'audio' ? 'audio/*' :
                    formData.contentType === 'pdf' ? '.pdf' :
                    formData.contentType === 'image' ? 'image/*' : '*'
                  }
                  required={!isEdit}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max file size: 50MB
                  {isEdit && ' • Leave empty to keep existing file'}
                </p>
                {uploadFile && (
                  <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>
            )}

            {formData.contentType === 'text' && (
              <div className="mt-4">
                <label className="label">Additional Text Content (Optional)</label>
                <textarea
                  className="input"
                  rows="4"
                  placeholder="Add supplementary notes, exercises, or additional information..."
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    textContent: prev.textContent + '\n\n' + e.target.value 
                  }))}
                />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-4">
              <button
                type="submit"
                className="btn-primary flex items-center justify-center flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    {isEdit ? 'Update Content' : 'Create Content'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex items-center justify-center"
                disabled={loading}
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ManageContent;
