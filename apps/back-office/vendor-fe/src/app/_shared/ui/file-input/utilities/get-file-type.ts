import { FileType } from '../model/file-type';
import { audioExtensions } from './audio-extensions';
import { imageExtensions } from './image-extensions';
import { videoExtensions } from './video-extensions';
export const getFileType = (fileName: string): FileType => {
  const fileExtenstion = fileName?.split('.').pop();
  if (imageExtensions.includes(fileExtenstion)) {
    return 'image';
  } else if (videoExtensions.includes(fileExtenstion)) {
    return 'video';
  } else if (audioExtensions.includes(fileExtenstion)) {
    return 'audio';
  } else if (fileExtenstion === 'pdf') {
    return 'pdf';
  } else {
    return 'other';
  }
};
