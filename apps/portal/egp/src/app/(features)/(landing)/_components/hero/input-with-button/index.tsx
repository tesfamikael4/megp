import { IconSearch } from '@tabler/icons-react';
import React from 'react';

const InputWithButton = () => {
  return (
    <div className="relative w-full h-10 md:h-12 rounded-md border border-green-600">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500">
        <IconSearch
          size={20}
          stroke={1.8}
          style={{
            color: 'var(--mantine-color-placeholder)',
          }}
        />
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
        className="absolute top-0 end-0 flex items-center justify-center px-2 h-full min-w-fit text-sm font-medium w-1/5 bg-green-600 text-white rounded-r-sm"
      >
        Search
      </button>
    </div>
  );
};

export default InputWithButton;
