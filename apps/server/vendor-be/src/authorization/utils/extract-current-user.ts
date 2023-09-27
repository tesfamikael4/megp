// import { ExecutionContext } from '@nestjs/common';
// import { ApplicationDto } from '../dtos/application.dto';
// import { UnitDto } from '../dtos/unit.dto';
// import { OrganizationDto } from '../dtos/organization.dto';

// export const extractCurrentUser = (user: any, context: ExecutionContext) => {
//   const request = context.switchToHttp().getRequest();
//   const headers = request.headers;

//   const { profile, organizations } = user;
//   const { x_personnel_id, x_placement_id, x_application_key } = headers;

//   let currentOrganization: OrganizationDto = null;
//   let unit: UnitDto = null;
//   let application: ApplicationDto = null;

//   const organization =
//     organizations.find(
//       (organization: OrganizationDto) =>
//         organization.personnelId == x_personnel_id
//     ) || null;

//   if (organization) {
//     if (x_placement_id) {
//       unit =
//         organization.units.find(
//           (unit: UnitDto) => unit.placementId == x_placement_id
//         ) || null;
//     }
//     if (x_application_key) {
//       application =
//         organization.applications.find(
//           (application: ApplicationDto) => application.key == x_application_key
//         ) || null;
//     }

//     currentOrganization = {
//       id: organization?.id,
//       name: organization?.name,
//       shortName: organization?.shortName,
//       code: organization?.code,
//       personnelId: organization?.personnelId,
//       unit,
//       application,
//       permissions: organization?.permissions,
//     };
//   }

//   const { id, firstName, lastName, email } = profile;

//   const currentUser: any = {
//     id: currentOrganization?.personnelId ? currentOrganization?.personnelId : id,
//     email,
//     firstName,
//     lastName,
//     fullName: {
//       am: `${firstName.am} ${lastName.am}`,
//       en: `${firstName.en} ${lastName.en}`,
//     },
//     organization: currentOrganization,
//   };

//   return currentUser;
// };
