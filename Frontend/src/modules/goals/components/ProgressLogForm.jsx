import { useState } from 'react';

const ProgressLogForm = ({ goal, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        description: '',
        timeSpent: '',
        newProgress: goal.progress,
        mood: 'neutral'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.description.trim()) {
            alert('Please describe what you did to make progress');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                description: formData.description.trim(),
                timeSpent: formData.timeSpent ? parseInt(formData.timeSpent) : undefined,
                newProgress: parseInt(formData.newProgress),
                mood: formData.mood
            });
        } catch (err) {
            console.error('Error adding progress log:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getMoodEmoji = (mood) => {
        const moods = {
            frustrated: '😤',
            neutral: '😐',
            satisfied: '😊',
            excited: '🎉'
        };
        return moods[mood] || '😐';
    };

    const getMoodColor = (mood) => {
        const colors = {
            frustrated: 'border-red-500 bg-red-50 text-red-700',
            neutral: 'border-gray-500 bg-gray-50 text-gray-700',
            satisfied: 'border-green-500 bg-green-50 text-green-700',
            excited: 'border-yellow-500 bg-yellow-50 text-yellow-700'
        };
        return colors[mood] || colors.neutral;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Log Progress</h2>
                        <p className="text-sm text-gray-600 mt-1">{goal.title}</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Progress Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What did you do to make progress? *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows="4"
                            placeholder="e.g., Completed chapter 3 exercises, practiced vocabulary for 30 minutes, finished the first draft..."
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.description.length}/500 characters
                        </p>
                    </div>

                    {/* Time Spent and Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Spent (minutes)
                            </label>
                            <input
                                type="number"
                                value={formData.timeSpent}
                                onChange={(e) => setFormData({...formData, timeSpent: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="30"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Progress Level *
                            </label>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.newProgress}
                                    onChange={(e) => setFormData({...formData, newProgress: e.target.value})}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span className="font-medium text-blue-600">{formData.newProgress}%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mood Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            How do you feel about this progress?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['frustrated', 'neutral', 'satisfied', 'excited'].map((mood) => (
                                <label key={mood} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mood"
                                        value={mood}
                                        checked={formData.mood === mood}
                                        onChange={(e) => setFormData({...formData, mood: e.target.value})}
                                        className="sr-only"
                                    />
                                    <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                                        formData.mood === mood
                                            ? getMoodColor(mood)
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                    }`}>
                                        <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>
                                        <div className="text-xs font-medium capitalize">{mood}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Progress Change Indicator */}
                    {formData.newProgress !== goal.progress && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-blue-600 font-medium">Progress Change:</span>
                                <span className="text-gray-700">
                                    {goal.progress}% → {formData.newProgress}%
                                </span>
                                <span className={`font-medium ${
                                    formData.newProgress > goal.progress ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    ({formData.newProgress > goal.progress ? '+' : ''}{formData.newProgress - goal.progress}%)
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center space-x-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Logging...</span>
                                </span>
                            ) : (
                                'Log Progress'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgressLogForm;