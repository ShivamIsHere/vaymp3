import React from 'react';
import { FaStore } from 'react-icons/fa'; // Importing an icon from react-icons
import Header from './Header';
import Footer from './Footer';

const ComingSoon = () => {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-r from-blue-100 to-blue-300 p-6 sm:p-12">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
          <div className="mx-auto mb-6 w-32 h-32 flex items-center justify-center text-blue-600">
            <FaStore size={64} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">Coming Soon</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ComingSoon;
