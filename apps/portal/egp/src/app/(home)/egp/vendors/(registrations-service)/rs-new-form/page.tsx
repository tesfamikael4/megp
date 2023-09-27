'use client';

import { useGetApplicationByUserIdQuery } from '@/store/api/vendor_registration/query';
import Form from './form';
import { generateAndSaveKey } from '../../_shared/lib/objectParser/object';
import { LoadingOverlay } from '@mantine/core';

export default function RsNewFormPage() {
  const {
    data: applicationData,
    isLoading: isApplicationDataLoading,
    isSuccess: isApplicationDataSuccess,
    status: applicationDataStatus,
  } = useGetApplicationByUserIdQuery({
    userId: generateAndSaveKey() as string,
  });
  if (isApplicationDataLoading) {
    return <LoadingOverlay visible={true} overlayBlur={1} />;
  }
  if (applicationDataStatus == 'fulfilled') {
    if (applicationData?.status == 'Submitted') {
      return (
        <div className="flex justify-center">
          <div className=" w-full flex flex-row shadow-lg rounded-lg overflow-hidden  px-6 py-4  justify-between ">
            <div className=" flex justify-center align-top flex-col ">
              <div className="flex items-center pt-3">
                <div className="bg-blue-300 w-12 h-12 flex justify-center items-center rounded-full  text-white">
                  {applicationData.name.charAt(0)}
                </div>
                <div className="ml-4 text-xs	">
                  <p>
                    <span className="text-lg font-medium">
                      {applicationData.name}
                    </span>{' '}
                  </p>
                  <p>
                    <span className="ml-2 font-medium">Case Id: </span>
                    {applicationData.id}
                  </p>
                  <p>
                    <span className="ml-2 font-medium">Mobile Number: </span>
                    {applicationData.metaData.addressInformation.mobilePhone}
                  </p>
                  <p>
                    <span className="ml-2 font-medium">Primary Email: </span>
                    {applicationData.metaData.addressInformation.primaryEmail}
                  </p>
                </div>
              </div>
            </div>
            <div className="uppercase text-xs text-gray-600 font-bold flex flex-col items-center px-6 py-4 gap-2">
              Status
              <div className="text-xs uppercase px-2 py-1 rounded-full border border-collapse font-bold bg-primary-color text-white bg-blue-300">
                Under Review
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (applicationData?.status == 'Save as Draft' && applicationData) {
      return <Form pre={applicationData} />;
    }
  } else {
    return <Form pre={null} />;
  }

  //ef2af63f-b63a-4ed9-bfc0-6e8ee3b8b42k
  // return (<>
  // {isSaveFormLoading?<LoadingOverlay
  //     visible={isSaveFormLoading || isGetFormInitiationRequestLoading}
  //     overlayBlur={1}
  //   />}
  // </>

  // );
}
//<Form pre={applicationData} />
