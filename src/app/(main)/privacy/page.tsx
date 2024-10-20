import { FC } from 'react';
import Head from 'next/head';


const PrivacyPolicy: FC = () => {
  return (
    <>
    
      <main className="min-h-screen bg-white text-black py-10 px-5">
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
          <p className="text-center text-gray-700 mb-6">Last Updated: 29 August 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>
            <p className="mb-4">
              Welcome to CUET Student Details. This privacy policy outlines how we collect, use, and protect your information. By using our website, you agree to the terms described below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">2. Data Collection</h2>
            <p className="mb-4">
              We collect student data from publicly available sources, specifically the CUET website (
              <a href="https://cuet.ac.bd" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">cuet.ac.bd</a>
              ). The information includes, but is not limited to, Student ID, Name, Batch, and Department.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">3. User-Provided Data</h2>
            <p className="mb-4">
              Registered users can add or modify certain details such as Unique ID, Hall, LinkedIn profile, and Current Status. This data can be updated or removed by the user at any time through their account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">4. Data Limitations</h2>
            <p className="mb-4">
              Basic student data collected from public sources (Student ID, Name, Batch, Department) cannot be altered or deleted by users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">5. Data Storage and Security</h2>
            <p className="mb-4">
              We use Supabase for secure database storage. Data is safeguarded through technical and organizational measures to prevent unauthorized access and ensure confidentiality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">6. API Access and Authentication</h2>
            <p className="mb-4">
              Currently, data is accessible programmatically via our API and website. In the future, API access will be secured with authentication, allowing only students with a CUET academic email to obtain an API key.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">7. Login and Authentication</h2>
            <p className="mb-4">
              User-provided data can be edited by logging in with an academic email via a magic link. We will also add Google Sign-In for convenience and security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">8. Data Use and Sharing</h2>
            <p className="mb-4">
              We do not sell, rent, or distribute your data to third parties. User-provided data will not be shared in any manner that violates privacy regulations. All data is handled confidentially and securely.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">9. Compliance with Laws</h2>
            <p className="mb-4">
              Our practices align with applicable data privacy laws and regulations. We ensure that our handling of public data complies with relevant legal standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">10. Contact Information</h2>
            <p>
              For questions, concerns, or suggestions regarding this privacy policy or our website, please contact us at
              <a href="https://sayed.page/contact" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer"> sayed.page/contact</a>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;
