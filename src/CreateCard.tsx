import { useState } from 'react';
import { Card } from "@/components/ui/card";

interface CreateCardProps {
  onClose?: () => void;
  onSave?: () => Promise<void>;
  language?: 'en' | 'ja';
}

const translations = {
  title: {
    en: 'Title',
    ja: 'タイトル'
  },
  content: {
    en: 'Content',
    ja: '内容'
  },
  preview: {
    en: 'Preview',
    ja: 'プレビュー'
  },
  addMedia: {
    en: 'Add Media',
    ja: 'メディアを追加'
  },
  shareKnowledge: {
    en: 'Share your knowledge...',
    ja: '知識を共有しましょう...'
  },
  enterTitle: {
    en: 'Enter knowledge title',
    ja: 'タイトルを入力'
  },
  tag: {
    en: '# Tag',
    ja: '# タグ'
  }
}

export default function CreateCard({ onClose, onSave, language = 'en' }: CreateCardProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedMedia(e.target.files);
      // Clear old previews
      previews.forEach(url => URL.revokeObjectURL(url));
      setPreviews([]);
      
      // Create new previews
      const newPreviews: string[] = [];
      Array.from(e.target.files).forEach(file => {
        const url = URL.createObjectURL(file);
        newPreviews.push(url);
      });
      setPreviews(newPreviews);
    }
  };

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
          <span className="text-lg">{translations.preview[language]}</span>
          <button 
            onClick={async () => {
              let uploadedMediaUrls: string[] = [];
              if (selectedMedia) {
                const formData = new FormData();
                for (let i = 0; i < selectedMedia.length; i++) {
                  formData.append("files", selectedMedia[i]);
                }
                try {
                  const response = await fetch("https://cardnote-backend-wbgoevjh.fly.dev/api/upload/media", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await response.json();
                  uploadedMediaUrls = data.media_urls || [];
                } catch (error) {
                  console.error("Failed to upload media:", error);
                }
              }

              // Create the card with media URLs
              try {
                const createCardResponse = await fetch("https://cardnote-backend-wbgoevjh.fly.dev/api/cards", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title,
                    content,
                    media_urls: uploadedMediaUrls,
                    tags: [],
                  }),
                });
                
                if (createCardResponse.ok && onSave) {
                  await onSave();
                }
              } catch (error) {
                console.error("Failed to create card:", error);
              }
            }}
            className="text-xl p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            ✓
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            {translations.title[language]}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={translations.enterTitle[language]}
          />
        </div>

        {/* Media Upload */}
        <div className="mb-6">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="hidden"
            id="media-upload"
          />
          <label 
            htmlFor="media-upload" 
            className="inline-flex items-center justify-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-2">📷</span>
            <span className="font-medium">{translations.addMedia[language]}</span>
          </label>
          
          {/* Media Previews */}
          {previews.length > 0 && (
            <div className="mt-4 space-y-4">
              {previews.map((preview, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-video">
                    {preview.startsWith('data:video') ? (
                      <video
                        src={preview}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            {translations.content[language]}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={translations.shareKnowledge[language]}
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
            {translations.tag[language]}
          </button>
        </div>
      </div>
    </div>
  );
}
