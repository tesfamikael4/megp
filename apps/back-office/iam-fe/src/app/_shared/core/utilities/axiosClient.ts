import axios from 'axios';
import { getCurrentSession } from './get-current-session';

const axiosClient = axios.create();

if (typeof localStorage !== 'undefined') {
  const session = getCurrentSession();

  const regex = new RegExp(`\\/\\w+\\/`);
  const applicationMatch = window.location.href.match(regex);

  if (session?.accessToken) {
    axiosClient.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${session.accessToken}`;
  }

  if (
    session?.profile &&
    session?.selectedOrganization &&
    session?.selectedUnit &&
    applicationMatch
  ) {
    axiosClient.defaults.headers.common['x_personnel_id'] =
      session?.organizations?.find(
        (organization: any) =>
          session.selectedOrganization?.id === organization?.id,
      )?.personnelId;
    axiosClient.defaults.headers.common['x_placement_id'] =
      session.selectedUnit?.placementId;

    /* Get applicationKey from url */
    const applicationKey = applicationMatch[0]?.substring(
      applicationMatch[0]?.indexOf('/') + 1,
      applicationMatch[0]?.length - 1,
    );
    axiosClient.defaults.headers.common['x_application_key'] = applicationKey;
  }
}

export { axiosClient };
