'use client';
import React, { useState } from 'react';
import { Box, FileInput } from '@mantine/core';
import Papa from 'papaparse';

const DataImport = () => {
  const [, setJsonData] = useState([]);
  const [, setFileName] = useState('');
  const [, setIsLoading] = useState(false);

  const convertCSVToJSON = (csvContent) => {
    Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setJsonData(results.data);
        }
        setIsLoading(false);
      },
    });
  };

  const handleConvertButtonClick = (value) => {
    if (value) {
      const file = value;
      setFileName(file.name);
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvContent = e.target?.result;
        convertCSVToJSON(csvContent);
      };

      reader.readAsText(file);
    }
  };
  return (
    <Box className=" mt-3">
      <FileInput
        label="Import file"
        placeholder="Import file"
        accept=".csv"
        onChange={(value) => handleConvertButtonClick(value)}
        required
        withAsterisk
      />
    </Box>
  );
};

export default DataImport;
