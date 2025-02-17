import * as React from 'react';

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect: (file: File | null) => void;
  maxSize?: number;
}

export function FileInput({ onFileSelect, maxSize = 300 * 1024 * 1024, ...props }: FileInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > maxSize) {
      alert('ファイルサイズが大きすぎます（300MB以下）');
      event.target.value = '';
      return;
    }
    onFileSelect(file);
  };

  return (
    <input
      type="file"
      onChange={handleChange}
      accept="image/*"
      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      {...props}
    />
  );
}
