import { useState } from 'react';

interface CreateCardProps {
  onClose?: () => void;
  onSave?: () => void;
}

export default function CreateCard({ onClose, onSave }: CreateCardProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="p-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onClose}
            className="text-xl p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            ✕
          </button>
          <span className="text-lg">Preview</span>
          <button 
            onClick={onSave}
            className="text-xl p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            ✓
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ナレッジのタイトル"
          />
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            内容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="知識をシェア..."
            rows={8}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="text-lg px-4 py-2 border rounded-lg hover:bg-gray-100">
            📷
          </button>
          <button className="text-lg px-4 py-2 border rounded-lg hover:bg-gray-100">
            🎥
          </button>
          <button className="text-lg px-4 py-2 border rounded-lg hover:bg-gray-100">
            # タグ
          </button>
        </div>
      </div>
    </div>
  );
}
