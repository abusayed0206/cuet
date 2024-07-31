// app/upload/page.tsx
"use client"
import { useState, ChangeEvent, FormEvent } from 'react';

export default function UploadPage() {
  const [id, setId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !file) return;

    const formData = new FormData();
    formData.append('id', id);
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Upload successful');
      } else {
        const result = await response.json();
        alert(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ID:
        <input
          type="text"
          value={id}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
          required
        />
      </label>
      <label>
        File:
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
          accept="image/webp"
          required
        />
      </label>
      <button type="submit">Upload</button>
    </form>
  );
}
