import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import classes from './Payment.module.scss';
import {
  useGetInvoiceQuery,
  useGoToNextStateMutation,
} from '@/store/api/vendor_request_handler/new_registration_query';

export default function InvoicePage({ instanceId }: { instanceId: any }) {
  const [mutate] = useGoToNextStateMutation();
  const handleButtonClick = (action) => {
    // Define the data to send in the request body
    const requestData = {
      instanceId,
      action,
      data: {},
      handlerId: instanceId,
    };

    mutate(requestData)
      .then(() => {
        window.location.href = 'new-registration';
      })
      .catch(() => {
        //handle error here
      });
  };
  const response = useGetInvoiceQuery({});

  if (!response.data) {
    return <div>Loading...</div>;
  }

  const firstItem = response.data.items[0];

  if (!firstItem) {
    // Handle the case where there are no items in the response
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className={classes.formWrapper}>
        <TextInput
          readOnly
          label="applicationNo"
          value={firstItem.applicationNo}
        />
        <TextInput
          readOnly
          label="payToAccName"
          value={firstItem.payToAccName}
        />
        <TextInput readOnly label="payToAccNo" value={firstItem.payToAccNo} />
        <TextInput readOnly label="payToBank" value={firstItem.payToBank} />
        <TextInput readOnly label="payerName" value={firstItem.payerName} />
        <TextInput readOnly label="createdOn" value={firstItem.createdOn} />
        <TextInput readOnly label="serviceName" value={firstItem.serviceName} />
        <TextInput
          readOnly
          label="paymentStatus"
          value={firstItem.paymentStatus}
        />
        <TextInput readOnly label="remark" value={firstItem.remark} />

        <div>
          <Button
            style={{ marginTop: '15px' }}
            onClick={() => handleButtonClick('PAY')}
          >
            Pay
          </Button>
        </div>
      </div>
    </div>
  );
}
