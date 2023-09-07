import { Box } from '@mantine/core';

export const WaveSVG = () => {
  const svgCode = `<svg _ngcontent-mgr-c302="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800320"><path _ngcontent-mgr-c302="" fill="rgb(236 254 255)" fill-opacity="1" d="M0,224L48,229.3C96,235,192,245,288,250.7C384,256,480,256,576,234.7C672,213,768,171,864,165.3C960,160,1056,192,1152,202.7C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>`;

  return (
    <Box>
      <svg
        className="w-full max-w-full"
        height="290.8"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: svgCode }}
      />
    </Box>
  );
};
