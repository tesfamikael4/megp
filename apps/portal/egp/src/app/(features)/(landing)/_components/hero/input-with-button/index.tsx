import React from 'react';

const InputWithButton = () => {
  return (
    <div className="relative w-full h-12 rounded-md border border-green-600">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        id="search-dropdown"
        className={`
                    block  p-4 ps-10 w-full h-full z-20 text-sm text-gray-900 
                  bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2
                  outline-none rounded-md
                `}
        placeholder="Search"
        required
      />
      <button
        type="submit"
        className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium w-1/5 bg-green-600 text-white rounded-r-sm"
      >
        Search
      </button>
    </div>
  );
};

export default InputWithButton;
