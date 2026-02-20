import { useState } from 'react';
import { createResource } from '../services/resource.api';

const UploadResourceModal = ({ onClose, onSuccess }) => {
    const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'pdf',
        category: 'Study Material',
        subject: '',
        tags: '',
        externalUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Auto-detect type based on file extension
            const ext = file.name.split('.').pop().toLowerCase();
            let type = 'other';
            if (['pdf'].includes(ext)) type = 'pdf';
            else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'image';
            else if (['doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) type = 'document';
            else if (['mp4', 'avi', 'mov'].includes(ext)) type = 'video';
            
            setFormData({ ...formData, type, title: formData.title || file.name });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (uploadType === 'file' && !selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        if (uploadType === 'link' && !formData.externalUrl) {
            setError('Please enter a URL');
            return;
        }

        setUploading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('type', uploadType === 'link' ? 'link' : formData.type);
            data.append('category', formData.category);
            data.append('subject', formData.subject);
            data.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(t => t)));
            
            if (uploadType === 'file' && selectedFile) {
                data.append('file', selectedFile);
            } else if (uploadType === 'link') {
                data.append('externalUrl', formData.externalUrl);
            }

            await createResource(data);
            onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to upload resource');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Add Resource</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Upload Type Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setUploadType('file')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                uploadType === 'file'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            📁 Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setUploadType('link')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                uploadType === 'link'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            🔗 Add Link
                        </button>
                    </div>

                    {/* File Upload */}
                    {uploadType === 'file' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select File *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.zip,.mp4,.mp3"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    {selectedFile ? (
                                        <div className="text-green-600">
                                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-medium">{selectedFile.name}</p>
                                            <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="font-medium">Click to upload or drag and drop</p>
                                            <p className="text-sm">PDF, Images, Documents (Max 10MB)</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Link Input */}
                    {uploadType === 'link' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                URL *
                            </label>
                            <input
                                type="url"
                                value={formData.externalUrl}
                                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/resource"
                                required={uploadType === 'link'}
                            />
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Calculus Chapter 5 Notes"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Brief description of the resource..."
                        />
                    </div>

                    {/* Category and Subject */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Study Material">Study Material</option>
                                <option value="Lecture Notes">Lecture Notes</option>
                                <option value="Practice Problems">Practice Problems</option>
                                <option value="Reference">Reference</option>
                                <option value="Assignment">Assignment</option>
                                <option value="Project">Project</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Mathematics"
                                required
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., calculus, derivatives, exam-prep"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <span className="flex items-center space-x-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Uploading...</span>
                                </span>
                            ) : (
                                'Add Resource'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadResourceModal;
