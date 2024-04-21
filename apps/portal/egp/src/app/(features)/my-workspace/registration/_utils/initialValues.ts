export const getInitialValues = (data) => {
  return {
    ...data,
    address:
      data.address == null
        ? {
            postalAddress: '',
            primaryEmail: '',
            alternateEmail: '',
            mobilePhone: '',
            telephone: '',
            fax: '',
            website: '',
          }
        : data.address,
    contactPersons: data.contactPersons == null ? [] : data.contactPersons,
    businessSizeAndOwnership:
      data.businessSizeAndOwnership == null
        ? {
            registeredCapital: {
              amount: '',
              currency: '',
            },
            paidUpCapital: {
              amount: '',
              currency: '',
            },
            numberOfEmployees: '',
            ownershipType: '',
          }
        : data.businessSizeAndOwnership,
    shareHolders: data.shareHolders == null ? [] : data.shareHolders,
    beneficialOwnershipShareholders:
      data.beneficialOwnershipShareholders == null
        ? []
        : data.beneficialOwnershipShareholders,
    bankAccountDetails:
      data.bankAccountDetails == null ? [] : data.bankAccountDetails,
    areasOfBusinessInterest:
      data.areasOfBusinessInterest == null ? [] : data.areasOfBusinessInterest,
    invoice: data.invoice == null ? null : data.invoice,
    supportingDocuments: data.supportingDocuments
      ? data.supportingDocuments
      : {
          businessRegistration_IncorporationCertificate: '',
          mRA_TPINCertificate: '',
          generalReceipt_BankDepositSlip: '',
          mRATaxClearanceCertificate: '',
          previousPPDARegistrationCertificate: '',
        },
    paymentReceipt: data.paymentReceipt,
    preferential: [],
  };
};
