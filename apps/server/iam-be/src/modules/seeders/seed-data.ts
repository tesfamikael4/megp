export const applications = [
  {
    id: 'bd787e8d-6c8a-48e0-83ac-9b0e9998a476',
    name: 'Administration',
    description: 'Administration',
    key: 'administration',
  },
  {
    id: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
    name: 'Registration',
    description: 'registration',
    key: 'registration',
  },
  {
    id: '0d77f313-e4e1-4f95-8380-5365f0b6e90f',
    name: 'Planning',
    description: 'Planning',
    key: 'planning',
  },
  {
    id: 'd305e6e0-d36d-44fe-ab42-271dbd547e7b',
    name: 'Tendering',
    description: 'Tendering',
    key: 'tendering',
  },
  {
    id: '4b22ff46-e6ee-4ea0-adbd-86df7430c06e',
    name: 'Vendor',
    description: 'Vendor',
    key: 'vendor',
  },
];

export const permissions = [
  {
    id: '9e3529e7-0385-491e-a0a7-185e7f9f89e7',
    name: 'Mandate',
    description: 'mandate',
    key: 'mandate',
    applicationId: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
  },
  {
    id: '0a5863ae-34c4-4a07-9e76-145df8cddab2',
    name: 'Permission',
    description: 'permission',
    key: 'permission',
    applicationId: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
  },
  {
    id: '9a6f6273-3a48-4121-98e9-4a8d1afcf366',
    name: 'Application',
    description: 'application',
    key: 'application',
    applicationId: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
  },
  {
    id: 'aa9acb5c-aefb-41c9-8808-cb4817463ae0',
    name: 'Organization',
    description: 'Organization',
    key: 'organization',
    applicationId: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
  },
  {
    id: '86b67f60-856f-4e4b-8966-8e7a19932bf7',
    name: 'Unit',
    description: 'Unit',
    key: 'unit',
    applicationId: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
  },
  {
    id: '383b4375-57a2-4700-bf8f-74f4f2ab3efc',
    name: 'User',
    description: 'User',
    key: 'user',
    applicationId: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
  },
  {
    id: 'b5e2b27e-0110-4f4f-a16a-0f6027c2446e',
    name: 'Role',
    description: 'Role',
    key: 'role',
    applicationId: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
  },
  {
    id: '881d06f9-8528-49f2-959a-a986fc12983f',
    name: 'Group',
    description: 'Group',
    key: 'group',
    applicationId: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
  },
  {
    id: '5a7f9c73-87ed-42bf-a419-6c3de58d8764',
    name: 'Administration',
    description: 'Administration',
    key: 'administration',
    applicationId: 'bd787e8d-6c8a-48e0-83ac-9b0e9998a476',
  },
  {
    id: '1185317e-c60e-470d-818c-a7ca8b6199f0',
    name: 'Planning',
    description: 'Planning',
    key: 'planning',
    applicationId: '0d77f313-e4e1-4f95-8380-5365f0b6e90f',
  },
  {
    id: '0c3fc2ab-a5d1-4818-9aa8-0ea77757be31',
    name: 'Tendering',
    description: 'Tendering',
    key: 'tendering',
    applicationId: 'd305e6e0-d36d-44fe-ab42-271dbd547e7b',
  },
  {
    id: '763a57ce-cba2-47e3-ac5c-16ae6c49978a',
    name: 'Vendor',
    description: 'Vendor',
    key: 'vendor',
    applicationId: '4b22ff46-e6ee-4ea0-adbd-86df7430c06e',
  },
];

export const roleSystems = [
  {
    id: '8014efcd-f9e3-43ad-b449-a2acf0b22b60',
    name: 'Super Administrator',
    description: 'Super Administrator',
    key: 'SUPER_ADMINISTRATOR',
  },
  {
    id: '6a6ad2c5-4687-417b-a1b7-13f60c908c00',
    name: 'Organization Administrator',
    description: 'Organization Administrator',
    key: 'ORGANIZATION_ADMINISTRATOR',
  },
];

export const roleSystemPermissions = [
  {
    roleSystemId: '8014efcd-f9e3-43ad-b449-a2acf0b22b60',
    permissionId: '9e3529e7-0385-491e-a0a7-185e7f9f89e7',
  },

  {
    roleSystemId: '8014efcd-f9e3-43ad-b449-a2acf0b22b60',
    permissionId: '0a5863ae-34c4-4a07-9e76-145df8cddab2',
  },
  {
    roleSystemId: '8014efcd-f9e3-43ad-b449-a2acf0b22b60',
    permissionId: '9a6f6273-3a48-4121-98e9-4a8d1afcf366',
  },
  {
    roleSystemId: '8014efcd-f9e3-43ad-b449-a2acf0b22b60',
    permissionId: 'aa9acb5c-aefb-41c9-8808-cb4817463ae0',
  },
  {
    roleSystemId: '6a6ad2c5-4687-417b-a1b7-13f60c908c00',
    permissionId: '86b67f60-856f-4e4b-8966-8e7a19932bf7',
  },
  {
    roleSystemId: '6a6ad2c5-4687-417b-a1b7-13f60c908c00',
    permissionId: 'b5e2b27e-0110-4f4f-a16a-0f6027c2446e',
  },
  {
    roleSystemId: '6a6ad2c5-4687-417b-a1b7-13f60c908c00',
    permissionId: '383b4375-57a2-4700-bf8f-74f4f2ab3efc',
  },
  {
    roleSystemId: '6a6ad2c5-4687-417b-a1b7-13f60c908c00',
    permissionId: '881d06f9-8528-49f2-959a-a986fc12983f',
  },
];

export const account = {
  id: '97766b0e-9d8d-46fc-a3de-65c394e73d86',
  username: 'super_admin',
  firstName: 'Super',
  lastName: 'Admin',
  email: 'super_admin@megp.com',
  status: 'ACTIVE',
};

export const organization = {
  id: 'c7865a67-d289-4671-b264-bc899ef870cb',
  name: 'Default Organization',
  code: '123456',
  shortName: 'default',
  isActive: true,
};

export const unit = {
  id: 'bcf2e233-3572-45b3-b104-14023c76173a',
  name: 'Default Organization',
  code: '123456',
  isActive: true,
  organizationId: 'c7865a67-d289-4671-b264-bc899ef870cb',
};

export const user = {
  ...account,
  id: '9ebe3930-54fe-4974-bc7c-2c3bcffe196c',
  accountId: account.id,
  organizationId: 'c7865a67-d289-4671-b264-bc899ef870cb',
  userRoleSystems: [
    {
      roleSystemId: '8014efcd-f9e3-43ad-b449-a2acf0b22b60',
    },
  ],
  userUnits: [
    {
      unitId: 'bcf2e233-3572-45b3-b104-14023c76173a',
    },
  ],
};

export const mandate = {
  id: 'cfae02f0-4242-4080-8ad2-72643af464b1',
  name: 'Super Admin',
  description: 'Super Admin',
  key: 'SUPER_ADMIN',
  isActive: true,
  isSingleAssignment: true,
  versionNo: '0.1',
  organizationMandates: [
    {
      organizationId: 'c7865a67-d289-4671-b264-bc899ef870cb',
    },
  ],
  mandatePermissions: [
    {
      permissionId: '9e3529e7-0385-491e-a0a7-185e7f9f89e7',
    },
    {
      permissionId: '0a5863ae-34c4-4a07-9e76-145df8cddab2',
    },
    {
      permissionId: '9a6f6273-3a48-4121-98e9-4a8d1afcf366',
    },
    {
      permissionId: 'aa9acb5c-aefb-41c9-8808-cb4817463ae0',
    },
  ],
};

export const defaultOrganizationRoles = [
  {
    name: 'Procuring Unit Head',
    description: 'Procuring Unit Head',
    isSystemRole: true,
    rolePermissions: [
      {
        permissionId: '5a7f9c73-87ed-42bf-a419-6c3de58d8764',
      },
      {
        permissionId: '1185317e-c60e-470d-818c-a7ca8b6199f0',
      },
    ],
  },
  {
    name: 'Head of Procuring Entity',
    description: 'Head of Procuring Entity',
    isSystemRole: true,
    rolePermissions: [
      {
        permissionId: '0c3fc2ab-a5d1-4818-9aa8-0ea77757be31',
      },
      {
        permissionId: '763a57ce-cba2-47e3-ac5c-16ae6c49978a',
      },
    ],
  },
];
