import { getCookie } from 'cookies-next';

// Define a type for the serverGetUrl parameter
type ServerGetUrl = string;
type ServerPostUrl = string;
type GetFileResult = string | null;
type UploadFileResult = {
  success: boolean;
  data?: {
    attachment: string;
    invoiceId: string;
    serviceId: string;
    transactionId: string;
  };
  errorMessage?: string;
};

export const getFile = async (
  serverGetUrl: ServerGetUrl,
): Promise<GetFileResult> => {
  try {
    const jwtToken = getCookie('token');

    const response = await fetch(serverGetUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      // Handle non-successful responses (e.g., 4xx or 5xx status codes)
      throw new Error(`Failed to fetch file. Status: ${response.status}`);
    }

    const htmlContent = await response.text();

    const textLink =
      new DOMParser().parseFromString(htmlContent, 'text/html').body
        .textContent || '';

    return textLink;
  } catch (error) {
    // Handle and log the error
    console.error('Error fetching file:', error);

    // Return a custom object with textLink as null and the error message
    return null;
  }
};

type ProgressCallback = (progressEvent: Partial<ProgressEvent>) => void;

export const uploadFile = async (
  serverPostUrl: ServerPostUrl,
  formData: FormData,
  progressCallback?: ProgressCallback,
): Promise<UploadFileResult> => {
  try {
    const jwtToken = getCookie('token');
    console.log(formData);
    const response = await fetch(serverPostUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        // 'Content-Type': 'multipart/form-data'
      },
      body: formData,
    });

    if (!response.ok) {
      // Handle non-successful responses (e.g., 4xx or 5xx status codes)
      return {
        success: false,
        errorMessage: 'An error occurred while uploading the file.',
      };
    }

    const contentLength = Number(response.headers.get('Content-Length'));

    let receivedBytes = 0; // Initialize receivedBytes to 0
    const chunks: Uint8Array[] = [];

    console.log({ contentLength, receivedBytes, chunks });

    if (progressCallback) {
      // Simulate progress with a setInterval instead of setTimeout
      const progressInterval = setInterval(() => {
        // Simulate receiving data and updating receivedBytes
        const simulatedData = 1024; // You can adjust this value based on your scenario
        receivedBytes += simulatedData;

        // Update the progress callback
        const progressEvent: Partial<ProgressEvent> = {
          loaded: receivedBytes,
          total: contentLength,
        };
        progressCallback(progressEvent);

        // Check if all data has been received
        if (receivedBytes >= contentLength) {
          // Stop the progress update when all data is received
          clearInterval(progressInterval);
        }
      }, 10);
    }

    // while (true) {
    //     const { done, value } = await reader.read();

    //     if (done) {
    //         break;
    //     }

    //     if (value) {
    //         chunks.push(value);
    //         receivedBytes += value.length;

    //         if (progressCallback) {
    //             const progressEvent: Partial<ProgressEvent> = {
    //                 loaded: receivedBytes,
    //                 total: contentLength,
    //             };
    //             progressCallback(progressEvent);
    //         }
    //     }
    // }

    const data = await response.json();

    // Assuming the API response contains a 'url' field
    console.log('Upload success');
    console.log(data);

    return { success: true, data };
  } catch (error) {
    // Handle and log the error
    console.error('Error uploading file:', error);

    // Return a custom object with success as false and the error message
    return {
      success: false,
      errorMessage:
        error.message || 'An error occurred while uploading the file.',
    };
  }
};

export const createPostUrl = (
  invoiceId: string,
  serviceId: string,
  transactionId: string,
): string => {
  return `/upload/upload-payment-receipt/${transactionId}/${serviceId}/${invoiceId}`;
};
export const createGetUrl = (userId: string, attachment: string): string => {
  return `/upload/get-attachment-pre-signed-object/${attachment}`;
};
// Example usage
