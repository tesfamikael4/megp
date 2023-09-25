import CollapsibleCard from './card/card';
import { DeleteConfirmationModal } from './delete-confirmation-modal/delete-confirmation';
import { PageLoadingIndicator } from './next-progress/next-progress-bar';

import { PageLoader } from './page-loader/page-loader';
import { PageNotFound } from './page-not-found/page-not-found';

import { SharedButton } from './shared-button/shared-button';

export * from './emtpy-icon/empty-icon';
export * from './file-input/components/file-preview';

export * from './next-progress/next-progress-bar';

function Pagination(...args): React.ReactElement {
  console.log(args);
  return <></>;
}

function notify(...args) {
  console.log(args);
}

export {
  CollapsibleCard,
  DeleteConfirmationModal,
  PageLoader,
  PageLoadingIndicator,
  PageNotFound,
  Pagination,
  SharedButton,
  notify,
};
