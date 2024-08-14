"use client";
import { useState, useEffect, ChangeEvent } from 'react';
import { supabaseClient } from '@/lib/supabase'; // Adjusted import statement

const InsertDataForm = () => {
  const supabase = supabaseClient; // Use the imported Supabase client

  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | ArrayBuffer | null>(null);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [submittedPassword, setSubmittedPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<'password' | 'upload' | 'form'>('password');

  useEffect(() => {
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(photo);
    } else {
      setPhotoPreview(null);
    }
  }, [photo]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { data: passwordsData, error: passwordsError } = await supabase
      .from('passwords')
      .select('password');

    if (passwordsError) {
      setError('Failed to fetch passwords');
      console.error('Error fetching passwords:', passwordsError);
      return;
    }

    const isPasswordValid = passwordsData?.some(
      (entry: { password: string }) => entry.password === submittedPassword
    );

    if (!isPasswordValid) {
      setError('Invalid password');
      return;
    }

    setStep('upload');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photo) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('id', 'teacher-photo');
    formData.append('file', photo);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        return result.url; // Assuming your API returns the URL
      } else {
        setError(result.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Internal error occurred while uploading photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const photoUrl = await handleUploadPhoto();
    if (!photoUrl) return;

    const { error: insertError } = await supabase
      .from('teachers')
      .insert([{ name, department, role, email, phone, profilelink: profileLink, facebook, linkedin, photo: photoUrl }]);

    if (insertError) {
      setError('Failed to insert teacher data');
      console.error('Error inserting teacher data:', insertError);
      return;
    }

    setSuccess('Teacher data successfully added.');
    setName('');
    setDepartment('');
    setRole('');
    setEmail('');
    setPhone('');
    setProfileLink('');
    setFacebook('');
    setLinkedin('');
    setPhoto(null);
    setSubmittedPassword('');
    setStep('password');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Add New Teacher</h1>
      {step === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="block text-lg font-medium text-gray-800">Password</label>
            <input
              type="password"
              value={submittedPassword}
              onChange={(e) => setSubmittedPassword(e.target.value)}
              className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              required
            />
          </div>

          {error && <p className="text-red-600 text-center text-lg">{error}</p>}
          {success && <p className="text-green-600 text-center text-lg">{success}</p>}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit Password
          </button>
        </form>
      ) : step === 'upload' ? (
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {photoPreview && (
            <div className="mt-4">
              <img src={photoPreview as string} alt="Preview" className="w-32 h-32 object-cover" />
            </div>
          )}
          {uploading && <p className="text-center text-lg">Uploading photo...</p>}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex flex-col">
              <label className="block text-lg font-medium text-gray-800">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-lg font-medium text-gray-800">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-lg font-medium text-gray-800">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-lg font-medium text-gray-800">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-lg font-medium text-gray-800">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-lg font-medium text-gray-800">Profile Link</label>
              <input
                type="text"
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-lg font-medium text-gray-800">Facebook</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-lg font-medium text-gray-800">LinkedIn</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                required
              />
            </div>

            {error && <p className="text-red-600 text-center text-lg">{error}</p>}
            {success && <p className="text-green-600 text-center text-lg">{success}</p>}
            {uploading && <p className="text-center text-lg">Uploading information...</p>}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default InsertDataForm;
