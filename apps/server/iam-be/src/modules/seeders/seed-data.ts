export const applications = [
  {
    id: 'b9e0b1b1-0244-463b-b0dd-307b60360bb9',
    name: 'Registration',
    description: 'registration',
    key: 'registration',
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
