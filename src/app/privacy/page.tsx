import { FC } from 'react';
import Head from 'next/head';

const PrivacyPolicy: FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <meta name="description" content="Privacy Policy of the website" />
      </Head>
      <main className="min-h-screen bg-gray-100 py-10 px-5">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-700 mb-4">Last Updated: 29 August 2024</p>
          <p className="text-gray-700 mb-4">
            All student details/information are collected from publicly available sources like the CUET website (
            <a href="https://cuet.ac.bd" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">https://cuet.ac.bd</a>
            ).
          </p>
          <p className="text-gray-700 mb-4">
            You cannot delete your profile. However, you can change (add/remove) a few details that are not available/added here.
          </p>
          <p className="text-gray-700 mb-4">
            I will not sell or distribute this information (in properly formatted data such as CSV/XLSX) to anyone. You have complete control over the data you added via signing up on this website. You can remove or change it in the same way you added this data.
          </p>
          <p className="text-gray-700 mb-4">
            By programmatically sharing student details via the website and/or API, I am not violating any data privacy laws/regulations (if any) as all these data are public.
          </p>
          <p className="text-gray-700 mb-4">
            Your data is in safe hands and secured.
          </p>
          <p className="text-gray-700 mb-4">
            If you have any questions regarding this website or any suggestions, please contact me here: 
            <a href="https://sayed.page/contact" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer"> https://sayed.page/contact</a>.
          </p>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;
