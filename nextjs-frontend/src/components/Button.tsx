'use client';

import React from 'react';

const Button = ({ text, onClick }: { text: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
  >
    {text}
  </button>
);

export default Button;
