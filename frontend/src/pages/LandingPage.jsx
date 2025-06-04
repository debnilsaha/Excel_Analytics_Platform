import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 font-sans">
      <header className="flex justify-between items-center px-8 py-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">excelinsight</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</Link>
        </div>
      </header>

      <main className="px-8 py-16 max-w-5xl mx-auto">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Transform Excel into Insight — Instantly.</h2>
          <p className="text-lg text-gray-600">Turn your spreadsheets into stunning, interactive insights in just a few clicks! Our cutting-edge Excel Analytics Platform empowers you to unlock the full potential of your Excel data—no coding required.</p>
        </section>

        <section className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-2">✅ Upload & Analyze Instantly</h3>
            <p className="text-gray-700">Whether it's .xls or .xlsx, simply drag and drop your Excel files to get started. Our smart parser organizes your data seamlessly into a format ready for visualization.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">📈 Dynamic Chart Generation</h3>
            <p className="text-gray-700">Choose your X and Y axes, select from a variety of 2D and 3D charts—bar, line, pie, scatter, and even 3D columns—and generate downloadable visuals in PNG or PDF format. Perfect for reports, dashboards, and presentations.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">🧠 AI-Enhanced Insights</h3>
            <p className="text-gray-700">Gain smarter summaries and trend analysis using integrated AI tools. Let the platform do the thinking while you focus on the strategy.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">📂 Personal Dashboard</h3>
            <p className="text-gray-700">Keep track of all your uploads and analyses in one place. Your data history is saved securely and always just a click away.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">🔐 Secure & Seamless Experience</h3>
            <p className="text-gray-700">Enjoy a modern, responsive UI with robust user and admin authentication. Your data is safe, and your experience is smooth—on any device.</p>
          </div>
        </section>

        <div className="text-center mt-16">
          <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700">Get Started</Link>
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} EXCELINSIGHT. Created by DEBNIL SAHA.
      </footer>
    </div>
  );
};

export default LandingPage;
