// src/components/ProfilePictureUpload.tsx
import { useState } from 'react'
import { supabaseClient } from '@/lib/supabase'
import { uploadToR2, deleteFromR2 } from '@/lib/cloudflareR2'

export default function ProfilePictureUpload({ userId, onUpload }) {
  const [uploading, setUploading] = useState(false)

  const uploadProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp']

      if (!allowedExtensions.includes(fileExt?.toLowerCase() || '')) {
        throw new Error('File type not allowed. Please upload a JPG, JPEG, PNG, or WebP image.')
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB.')
      }

      // Check image dimensions
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await new Promise((resolve) => {
        img.onload = () => {
          if (img.width < 250 || img.height < 250) {
            throw new Error('Image dimensions must be at least 250x250 pixels.')
          }
          if (img.width > 1000 || img.height > 1000) {
            throw new Error('Image dimensions must not exceed 1000x1000 pixels.')
          }
          resolve(null)
        }
      })

      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      
      // Delete the old image if it exists
      const { data: oldData, error: fetchError } = await supabaseClient
        .from('apidata')
        .select('dplink')
        .eq('user_id', userId)
        .single()

      if (fetchError) throw fetchError

      if (oldData && oldData.dplink) {
        const oldFileName = oldData.dplink.split('/').pop()
        if (oldFileName) await deleteFromR2(oldFileName)
      }

      // Upload the new image to R2
      const newImageUrl = await uploadToR2(file, fileName)

      const { error: updateError } = await supabaseClient
        .from('apidata')
        .update({ dplink: newImageUrl })
        .eq('user_id', userId)

      if (updateError) {
        throw updateError
      }

      onUpload(newImageUrl)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="button primary block" htmlFor="single">
        {uploading ? 'Uploading ...' : 'Upload New Profile Picture'}
      </label>
      <input
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadProfilePicture}
        disabled={uploading}
      />
    </div>
  )
}
