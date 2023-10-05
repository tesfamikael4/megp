export const injectFormValue = (form, formData: any) => {
  if (formData) {
    form.reset();
    form.setFieldValue('basicRegistration', {
      ...formData.basicRegistration,
    });

    form.setFieldValue('addressInformation', {
      ...formData.addressInformation,
    });

    form.setFieldValue('businessSizeAndOwnership', {
      ...formData.businessSizeAndOwnership,
    });
    form.setFieldValue('businessSizeAndOwnership.registeredCapital', {
      ...formData.businessSizeAndOwnership.registeredCapital,
    });
    form.setFieldValue('businessSizeAndOwnership.paidUpCapital', {
      ...formData.businessSizeAndOwnership.paidUpCapital,
    });
    formData.contactPersons.contactPersonsTable &&
      formData.contactPersons.contactPersonsTable.map((val, index) =>
        form.insertListItem(`contactPersons.contactPersonsTable`, {
          ...val,
        }),
      );
    formData.bankAccountDetails.bankAccountDetailsTable &&
      formData.bankAccountDetails.bankAccountDetailsTable.map((val, index) =>
        form.insertListItem(`bankAccountDetails.bankAccountDetailsTable`, {
          ...val,
        }),
      );
    formData.beneficialOwnership.beneficialOwnershipTable &&
      formData.beneficialOwnership.beneficialOwnershipTable.map((val, index) =>
        form.insertListItem(`beneficialOwnership.beneficialOwnershipTable`, {
          ...val,
        }),
      );

    formData.shareHolders.shareHoldersTable &&
      formData.shareHolders.shareHoldersTable.map((val, index) =>
        form.insertListItem(`shareHolders.shareHoldersTable`, {
          ...val,
        }),
      );

    if (formData.areasOfBusinessInterest) {
      formData.areasOfBusinessInterest.areasOfBusinessInterestNames &&
        formData.areasOfBusinessInterest.areasOfBusinessInterestNames.map(
          (val, index) =>
            form.insertListItem(
              `areasOfBusinessInterest.areasOfBusinessInterestNames`,
              val,
            ),
        );

      formData.areasOfBusinessInterest.areasOfBusinessInterestInformation &&
        formData.areasOfBusinessInterest.areasOfBusinessInterestInformation.map(
          (val, index) => {
            if (Array.isArray(val.lineOfBusiness)) {
              return form.insertListItem(
                `areasOfBusinessInterest.areasOfBusinessInterestInformation`,
                {
                  ...val,
                },
              );
            } else {
              return form.insertListItem(
                `areasOfBusinessInterest.areasOfBusinessInterestInformation`,
                {
                  ...val,
                  lineOfBusiness: val.lineOfBusiness
                    .replace(/\\/g, '')
                    .replace(/{/g, '')
                    .replace(/}/g, '')
                    .replace(/}/g, '')
                    .slice(1, -1)
                    .split('","'),
                },
              );
            }
          },
        );
    }
  }

  return;
};
