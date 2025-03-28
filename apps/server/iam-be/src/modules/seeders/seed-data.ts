export const applications = [
  {
    id: 1,
    name: 'Administration',
    description: 'Administration',
    key: 'administration',
  },
  {
    id: 2,
    name: 'Identity and Access Management',
    description: 'Identity and Access Management',
    key: 'iam',
  },
  { id: 3, name: 'Planning', description: 'Planning', key: 'planning' },
  { id: 4, name: 'Tendering', description: 'Tendering', key: 'tendering' },
  { id: 5, name: 'Vendor', description: 'Vendor', key: 'vendor' },
];
export const permissions = [
  {
    id: 1,
    name: 'Mandate',
    description: 'mandate',
    key: 'iam:mandate',
    applicationId: 2,
  },
  {
    id: 2,
    name: 'Permission',
    description: 'permission',
    key: 'iam:permission',
    applicationId: 2,
  },
  {
    id: 3,
    name: 'Application',
    description: 'application',
    key: 'iam:application',
    applicationId: 2,
  },
  {
    id: 4,
    name: 'Organization',
    description: 'Organization',
    key: 'iam:organization',
    applicationId: 2,
  },
  {
    id: 5,
    name: 'Unit',
    description: 'Unit',
    key: 'iam:unit',
    applicationId: 2,
  },
  {
    id: 6,
    name: 'User',
    description: 'User',
    key: 'iam:user',
    applicationId: 2,
  },
  {
    id: 7,
    name: 'Role',
    description: 'Role',
    key: 'iam:role',
    applicationId: 2,
  },
  {
    id: 8,
    name: 'Group',
    description: 'Group',
    key: 'iam:group',
    applicationId: 2,
  },
  {
    id: 9,
    name: 'Administration',
    description: 'Administration',
    key: 'administration:administration',
    applicationId: 1,
  },
  {
    id: 10,
    name: 'Planning',
    description: 'Planning',
    key: 'planning:planning',
    applicationId: 3,
  },
  {
    id: 11,
    name: 'Tendering',
    description: 'Tendering',
    key: 'tendering:tendering',
    applicationId: 4,
  },
  {
    id: 12,
    name: 'Vendor',
    description: 'Vendor',
    key: 'vendor:vendor',
    applicationId: 5,
  },
  {
    id: 13,
    name: 'Manage Annual Pre Budget Plan',
    description: 'Manage Annual Pre Budget Plan',
    key: 'planning:managePrePlan',
    applicationId: 3,
  },
  {
    id: 14,
    name: 'Manage Activities',
    description: 'Manage Activities',
    key: 'planning:managePrePlanActivity',
    applicationId: 3,
  },
  {
    id: 15,
    name: 'Manage Items',
    description: 'Manage Items',
    key: 'planning:managePrePlanItem',
    applicationId: 3,
  },
  {
    id: 16,
    name: 'Submit Pre Budget Plan',
    description: 'Submit Pre Budget Plan',
    key: 'planning:submitPrePlan',
    applicationId: 3,
  },
  {
    id: 17,
    name: 'Manage Annual Post Budget Plan',
    description: 'Manage Annual Post Budget Plan',
    key: 'planning:managePostPlan',
    applicationId: 3,
  },
  {
    id: 18,
    name: 'Manage post budget plan Activity',
    description: 'Manage post budget plan Activity',
    key: 'planning:managePostPlanActivity',
    applicationId: 3,
  },
  {
    id: 19,
    name: 'Manage post budget plan Item',
    description: 'Manage post budget plan Item',
    key: 'planning:managePostPlanItem',
    applicationId: 3,
  },
  {
    id: 20,
    name: 'Submit Post Budget Plan',
    description: 'Submit Post Budget Plan',
    key: 'planning:submitPostPlan',
    applicationId: 3,
  },
  {
    id: 21,
    name: 'Review Post Budget Plan',
    description: 'Review Post Budget Plan',
    key: 'planning:reviewPostPlan',
    applicationId: 3,
  },
  {
    id: 22,
    name: 'Approve Post Budget Plan',
    description: 'Approve Post Budget Plan',
    key: 'planning:approvePostPlan',
    applicationId: 3,
  },
  {
    id: 23,
    name: 'Review Pre Budget Plan',
    description: 'Review Pre Budget Plan',
    key: 'planning:reviewPrePlan',
    applicationId: 3,
  },
  {
    id: 24,
    name: 'Approve Pre Budget Plan',
    description: 'Approve Pre Budget Plan',
    key: 'planning:approvePrePlan',
    applicationId: 3,
  },
  {
    id: 25,
    name: 'Edit Pre Budget Plan',
    description: 'Edit Pre Budget Plan',
    key: 'planning:editPrePlan',
    applicationId: 3,
  },
  {
    id: 26,
    name: 'updateApproved post budget plan',
    description: 'updateApproved post budget plan',
    key: 'planning:updatePostPlan',
    applicationId: 3,
  },
  {
    id: 27,
    name: 'Manage Activities',
    description: 'Manage Activities',
    key: 'planning:manageApprovedActivity',
    applicationId: 3,
  },
  {
    id: 28,
    name: 'Manage Items',
    description: 'Manage Items',
    key: 'planning:manageApprovedItem',
    applicationId: 3,
  },
  {
    id: 29,
    name: 'Approve budget',
    description: 'Approve budget',
    key: 'planning:approveBudget',
    applicationId: 3,
  },
  {
    id: 30,
    name: 'View Revised Post Budget Plan',
    description: 'View Revised Post Budget Plan',
    key: 'planning:viewRevisePostPlan',
    applicationId: 3,
  },
  {
    id: 31,
    name: 'View Post budget plan',
    description: 'View Post budget plan',
    key: 'planning:viewPostPlan',
    applicationId: 3,
  },
  {
    id: 32,
    name: 'Activate budget validation',
    description: 'Activate budget validation',
    key: 'planning:budgetVerification',
    applicationId: 3,
  },
  {
    id: 33,
    name: 'Download Post budget plan (Excel, Pdf)',
    description: 'Download Post budget plan (Excel, Pdf)',
    key: 'planning:downloadPostPlan',
    applicationId: 3,
  },
  {
    id: 34,
    name: 'View old version Post budget Plan',
    description: 'View old version Post budget Plan',
    key: 'planning:viewUpdatedPostPlan',
    applicationId: 3,
  },
  {
    id: 35,
    name: 'Download old version Post budget Plan',
    description: 'Download old version Post budget Plan',
    key: 'planning:downloadOldVersionPostPlan',
    applicationId: 3,
  },
  {
    id: 36,
    name: 'Manage Budget',
    description: 'Manage Budget',
    key: 'planning:manageBudget',
    applicationId: 3,
  },
  {
    id: 37,
    name: 'Platform Owner',
    description: 'Platform Owner',
    key: 'administration:platformOwner',
    applicationId: 1,
  },
  {
    id: 38,
    name: 'Report Viewer',
    description: 'Report Viewer',
    key: 'iam:reportViewer',
    applicationId: 2,
  },
  {
    id: 39,
    name: 'Review New Vendor Registration Request ',
    description: 'Review New Vendor Registration Request ',
    key: 'vendor:reviewNewVendorRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 40,
    name: 'Review Vendor Upgrade Registration Request ',
    description: 'Review Vendor Upgrade Registration Request ',
    key: 'vendor:reviewVendorUpgradeRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 41,
    name: 'Review Vendor Renewal Registration Request ',
    description: 'Review Vendor Renewal Registration Request ',
    key: 'vendor:reviewVendorRenewalRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 42,
    name: 'Review Vendor Profile Update  Request ',
    description: 'Review Vendor Profile Update  Request ',
    key: 'vendor:reviewVendorProfileUpdateRequest',
    applicationId: 5,
  },
  {
    id: 43,
    name: 'Review eligibility request for preferential treatment  ',
    description: 'Review eligibility request for preferential treatment  ',
    key: 'vendor:reviewEligibilityRequestForPreferentialTreatment',
    applicationId: 5,
  },
  {
    id: 44,
    name: 'Approval of New Vendor Registration Request ',
    description: 'Approval of New Vendor Registration Request ',
    key: 'vendor:approvalOfNewVendorRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 45,
    name: 'Approval of Vendor Upgrade Registration Request ',
    description: 'Approval of Vendor Upgrade Registration Request ',
    key: 'vendor:approvalOfVendorUpgradeRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 46,
    name: 'Approval of Vendor Renewal Registration Request ',
    description: 'Approval of Vendor Renewal Registration Request ',
    key: 'vendor:approvalOfVendorRenewalRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 47,
    name: 'Approval of Vendor Profile Update  Request ',
    description: 'Approval of Vendor Profile Update  Request ',
    key: 'vendor:approvalOfVendorProfileUpdateRequest',
    applicationId: 5,
  },
  {
    id: 48,
    name: 'Approval of eligibility request for preferential treatment  ',
    description: 'Approval of eligibility request for preferential treatment  ',
    key: 'vendor:approvalOfEligibilityRequestForPreferentialTreatment',
    applicationId: 5,
  },
  {
    id: 49,
    name: 'Final Approval of New Vendor Registration Request ',
    description: 'Final Approval of New Vendor Registration Request ',
    key: 'vendor:finalApprovalOfNewVendorRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 50,
    name: 'Generate Vendor Registration Certificate',
    description: 'Generate Vendor Registration Certificate',
    key: 'vendor:generateVendorRegistrationCertificate',
    applicationId: 5,
  },
  {
    id: 51,
    name: 'Final Approval of upgrade  Registration Request',
    description: 'Final Approval of upgrade  Registration Request',
    key: 'vendor:finalApprovalOfUpgradeRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 52,
    name: 'Final Approval of Renewal Registration Request',
    description: 'Final Approval of Renewal Registration Request',
    key: 'vendor:finalApprovalOfRenewalRegistrationRequest',
    applicationId: 5,
  },
  {
    id: 53,
    name: 'Final Approval of profile update  request ',
    description: 'Final Approval of profile update  request ',
    key: 'vendor:finalApprovalOfProfileUpdateRequest',
    applicationId: 5,
  },
  {
    id: 54,
    name: 'Final approval for eligibility request for preferential treatment  ',
    description:
      'Final approval for eligibility request for preferential treatment  ',
    key: 'vendor:finalApprovalForEligibilityRequestForPreferentialTreatment',
    applicationId: 5,
  },
  {
    id: 55,
    name: 'Mandate Viewer',
    description: 'Mandate Viewer',
    key: 'iam:mandateViewer',
    applicationId: 2,
  },
  {
    id: 56,
    name: 'Manage Organization',
    description: 'Manage Organization',
    key: 'iam:manageOrganization',
    applicationId: 2,
  },
  {
    id: 57,
    name: 'Manage Super Admin',
    description: 'Manage Super Admin',
    key: 'iam:manageSuperAdmin',
    applicationId: 2,
  },
  {
    id: 58,
    name: 'Create Procurement Requisition',
    description: 'Create Procurement Requisition',
    key: 'planning:createProcurementRequisition',
    applicationId: 3,
  },
  {
    id: 59,
    name: 'Manage Items On PR',
    description: 'Manage Items On PR',
    key: 'planning:manageItemsOnPR',
    applicationId: 3,
  },
  {
    id: 60,
    name: 'Submit Procurement Requisition',
    description: 'Submit Procurement Requisition',
    key: 'planning:submitProcurementRequisition',
    applicationId: 3,
  },
  {
    id: 61,
    name: 'Review Procurement Requisition',
    description: 'Review Procurement Requisition',
    key: 'planning:reviewProcurementRequisition',
    applicationId: 3,
  },
  {
    id: 62,
    name: 'Approve Procurement Requisition',
    description: 'Approve Procurement Requisition',
    key: 'iam:approveProcurementRequisition',
    applicationId: 2,
  },
  {
    id: 63,
    name: 'View Bid Security Guarantee',
    description: 'View Bid Security Guarantee',
    key: 'guarantee:viewBidSecurity',
    applicationId: 1,
  },
  {
    id: 64,
    name: 'View Bid Security Guarantee',
    description: 'View Bid Security Guarantee',
    key: 'guarantee:viewGuarantee',
    applicationId: 1,
  },
  {
    id: 65,
    name: 'Release Guarantee',
    description: 'Release Guarantee',
    key: 'guarantee:releaseGuarantee',
    applicationId: 1,
  },
  {
    id: 66,
    name: 'Forfeit guarantee',
    description: 'Forfeit guarantee',
    key: 'guarantee:forfeitGuarantee',
    applicationId: 1,
  },
  {
    id: 67,
    name: 'View Guarantee Request ',
    description: 'View Guarantee Request ',
    key: 'guarantee:viewRequest',
    applicationId: 1,
  },
  {
    id: 68,
    name: 'Approve Guarantee Request ',
    description: 'Approve Guarantee Request ',
    key: 'guarantee:approveRequest',
    applicationId: 1,
  },
  {
    id: 69,
    name: 'Reject Guarantee Request ',
    description: 'Reject Guarantee Request ',
    key: 'guarantee:rejectRequest',
    applicationId: 1,
  },
  {
    id: 70,
    name: 'View Release Request',
    description: 'View Release Request',
    key: 'guarantee:viewRelease',
    applicationId: 1,
  },
  {
    id: 71,
    name: 'View forfeitment request',
    description: 'View forfeitment request',
    key: 'guarantee:viewForfeitment',
    applicationId: 1,
  },
  {
    id: 72,
    name: 'Approve forfeitment Request',
    description: 'Approve forfeitment Request',
    key: 'guarantee:approveForfeitment',
    applicationId: 1,
  },
];
export const roleSystems = [
  {
    id: 1,
    name: 'Super Administrator',
    description: 'Super Administrator',
    key: 'SUPER_ADMINISTRATOR',
  },
  {
    id: 2,
    name: 'Organization Administrator',
    description: 'Organization Administrator',
    key: 'ORGANIZATION_ADMINISTRATOR',
  },
  {
    id: 3,
    name: 'Pre Budget Plan creator',
    description: 'Pre Budget Plan creator',
    key: 'PRE_BUDGET_PLAN_CREATOR',
  },
  {
    id: 4,
    name: 'Post Budget Plan Creator',
    description: 'Post Budget Plan Creator',
    key: 'POST_BUDGET_PLAN_CREATOR',
  },
  {
    id: 5,
    name: 'Internal Procurement and Disposal Committee',
    description: 'Internal Procurement and Disposal Committee',
    key: 'INTERNAL_PROCUREMENT_AND_DISPOSAL_COMMITTEE',
  },
  { id: 6, name: 'HPDU', description: 'HPDU', key: 'HPDU' },
  {
    id: 7,
    name: 'PPDA Plan Approver',
    description: 'PPDA Plan Approver',
    key: 'PPDA_PLAN_APPROVER',
  },
  {
    id: 8,
    name: 'Public Users',
    description: 'Public Users',
    key: 'PUBLIC_USERS',
  },
  {
    id: 9,
    name: 'Budget Officer',
    description: 'Budget Officer',
    key: 'BUDGET_OFFICER',
  },
  { id: 10, name: 'Manager', description: 'Manager', key: 'MANAGER' },
  {
    id: 11,
    name: 'Regulatory Officer',
    description: 'Regulatory Officer',
    key: 'REGULATORY_OFFICER',
  },
  {
    id: 12,
    name: 'Regulatory and Review Manage',
    description: 'Regulatory and Review Manage',
    key: 'REGULATORY_AND_REVIEW_MANAGE',
  },
  {
    id: 13,
    name: 'Director of Regulatory Review and Monitoring ',
    description: 'Director of Regulatory Review and Monitoring ',
    key: 'DIRECTOR_OF_REGULATORY_REVIEW_AND_MONITORING_',
  },
  {
    id: 14,
    name: 'Review and Monitoring',
    description: 'Review and Monitoring',
    key: 'REVIEW_AND_MONITORING',
  },
  {
    id: 15,
    name: 'Director General',
    description: 'Director General',
    key: 'DIRECTOR_GENERAL',
  },
  {
    id: 16,
    name: 'Requisitioner',
    description: 'Requisitioner',
    key: 'REQUISITIONER',
  },
  {
    id: 17,
    name: 'Bid Evaluator',
    description: 'Bid Evaluator',
    key: 'BID_EVALUATOR',
  },
  { id: 18, name: 'Bid Opener', description: 'Bid Opener', key: 'BID_OPENER' },
  {
    id: 19,
    name: 'Contract Admin',
    description: 'Contract Admin',
    key: 'CONTRACT_ADMIN',
  },
  {
    id: 20,
    name: 'Guarantee Officer',
    description: 'Guarantee Officer',
    key: 'GUARANTEE_OFFICER',
  },
  {
    id: 21,
    name: 'Guarantee Approver',
    description: 'Guarantee Approver',
    key: 'GUARANTEE_APPROVER',
  },
];
export const roleSystemPermissions = [
  { roleSystemId: 1, permissionId: 1 },
  { roleSystemId: 1, permissionId: 2 },
  { roleSystemId: 1, permissionId: 3 },
  { roleSystemId: 1, permissionId: 4 },
  { roleSystemId: 1, permissionId: 57 },
  { roleSystemId: 2, permissionId: 5 },
  { roleSystemId: 2, permissionId: 7 },
  { roleSystemId: 2, permissionId: 6 },
  { roleSystemId: 2, permissionId: 8 },
  { roleSystemId: 2, permissionId: 55 },
  { roleSystemId: 2, permissionId: 56 },
  { roleSystemId: 3, permissionId: 13 },
  { roleSystemId: 3, permissionId: 14 },
  { roleSystemId: 3, permissionId: 15 },
  { roleSystemId: 3, permissionId: 16 },
  { roleSystemId: 4, permissionId: 17 },
  { roleSystemId: 4, permissionId: 18 },
  { roleSystemId: 4, permissionId: 19 },
  { roleSystemId: 4, permissionId: 20 },
  { roleSystemId: 5, permissionId: 21 },
  { roleSystemId: 5, permissionId: 22 },
  { roleSystemId: 6, permissionId: 23 },
  { roleSystemId: 6, permissionId: 21 },
  { roleSystemId: 6, permissionId: 24 },
  { roleSystemId: 6, permissionId: 25 },
  { roleSystemId: 6, permissionId: 22 },
  { roleSystemId: 6, permissionId: 26 },
  { roleSystemId: 6, permissionId: 27 },
  { roleSystemId: 6, permissionId: 28 },
  { roleSystemId: 6, permissionId: 29 },
  { roleSystemId: 7, permissionId: 30 },
  { roleSystemId: 7, permissionId: 24 },
  { roleSystemId: 7, permissionId: 22 },
  { roleSystemId: 7, permissionId: 31 },
  { roleSystemId: 7, permissionId: 32 },
  { roleSystemId: 8, permissionId: 31 },
  { roleSystemId: 8, permissionId: 33 },
  { roleSystemId: 8, permissionId: 34 },
  { roleSystemId: 8, permissionId: 35 },
  { roleSystemId: 9, permissionId: 36 },
  { roleSystemId: 10, permissionId: 38 },
  { roleSystemId: 11, permissionId: 39 },
  { roleSystemId: 11, permissionId: 40 },
  { roleSystemId: 11, permissionId: 41 },
  { roleSystemId: 11, permissionId: 42 },
  { roleSystemId: 11, permissionId: 43 },
  { roleSystemId: 12, permissionId: 44 },
  { roleSystemId: 12, permissionId: 45 },
  { roleSystemId: 12, permissionId: 46 },
  { roleSystemId: 12, permissionId: 47 },
  { roleSystemId: 12, permissionId: 48 },
  { roleSystemId: 13, permissionId: 44 },
  { roleSystemId: 13, permissionId: 45 },
  { roleSystemId: 13, permissionId: 46 },
  { roleSystemId: 13, permissionId: 47 },
  { roleSystemId: 13, permissionId: 48 },
  { roleSystemId: 14, permissionId: 44 },
  { roleSystemId: 14, permissionId: 45 },
  { roleSystemId: 14, permissionId: 46 },
  { roleSystemId: 14, permissionId: 47 },
  { roleSystemId: 14, permissionId: 48 },
  { roleSystemId: 15, permissionId: 49 },
  { roleSystemId: 15, permissionId: 50 },
  { roleSystemId: 15, permissionId: 51 },
  { roleSystemId: 15, permissionId: 52 },
  { roleSystemId: 15, permissionId: 53 },
  { roleSystemId: 15, permissionId: 54 },
  { roleSystemId: 16, permissionId: 57 },
  { roleSystemId: 16, permissionId: 59 },
  { roleSystemId: 16, permissionId: 60 },
  { roleSystemId: 18, permissionId: 61 },
  { roleSystemId: 18, permissionId: 62 },
  { roleSystemId: 19, permissionId: 61 },
  { roleSystemId: 19, permissionId: 62 },
  { roleSystemId: 17, permissionId: 63 },
  { roleSystemId: 18, permissionId: 63 },
  { roleSystemId: 19, permissionId: 64 },
  { roleSystemId: 19, permissionId: 65 },
  { roleSystemId: 19, permissionId: 66 },
  { roleSystemId: 20, permissionId: 67 },
  { roleSystemId: 20, permissionId: 68 },
  { roleSystemId: 20, permissionId: 69 },
  { roleSystemId: 20, permissionId: 70 },
  { roleSystemId: 20, permissionId: 71 },
  { roleSystemId: 20, permissionId: 72 },
  { roleSystemId: 21, permissionId: 67 },
  { roleSystemId: 21, permissionId: 68 },
  { roleSystemId: 21, permissionId: 69 },
  { roleSystemId: 21, permissionId: 70 },
  { roleSystemId: 21, permissionId: 71 },
  { roleSystemId: 21, permissionId: 72 },
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
  name: 'Public Procurement And Disposal Of Assets Authority',
  code: '123456',
  shortName: 'PPDA',
  status: 'ACTIVE',
  type: 'BACK-OFFICE',
};
export const unit = {
  id: 'bcf2e233-3572-45b3-b104-14023c76173a',
  name: 'Public Procurement And Disposal Of Assets Authority',
  code: '123456',
  shortName: 'default',
  status: 'ACTIVE',
  organizationId: 'c7865a67-d289-4671-b264-bc899ef870cb',
};
export const user = {
  id: '9ebe3930-54fe-4974-bc7c-2c3bcffe196c',
  username: 'super_admin',
  firstName: 'Super',
  lastName: 'Admin',
  email: 'super_admin@megp.com',
  status: 'ACTIVE',
  accountId: '97766b0e-9d8d-46fc-a3de-65c394e73d86',
  organizationId: 'c7865a67-d289-4671-b264-bc899ef870cb',
  userRoleSystems: [{ roleSystemId: 1 }],
  userUnits: [{ unitId: 'bcf2e233-3572-45b3-b104-14023c76173a' }],
};
export const mandates = [
  {
    id: 1,
    name: 'Platform Owner',
    description: 'Platform Owner',
    key: 'PLATFORM_OWNER',
    isActive: true,
    isSingleAssignment: true,
    versionNo: '0.1',
    organizationMandates: [
      { organizationId: 'c7865a67-d289-4671-b264-bc899ef870cb' },
    ],
    mandatePermissions: [
      { permissionId: 1 },
      { permissionId: 2 },
      { permissionId: 3 },
      { permissionId: 4 },
      { permissionId: 37 },
      { permissionId: 38 },
      { permissionId: 57 },
    ],
  },
  {
    id: 2,
    name: 'Procuring Entity',
    description: 'Procuring Entity',
    key: 'PROCURING_ENTITY',
    isActive: true,
    isSingleAssignment: false,
    versionNo: '0.1',
  },
  {
    id: 3,
    name: 'Central Procurement Agency',
    description: 'Central Procurement Agency',
    key: 'CENTRAL_PROCUREMENT_AGENCY',
    isActive: true,
    isSingleAssignment: false,
    versionNo: '0.1',
  },
  {
    id: 4,
    name: 'Financial Institute',
    description: 'Financial Institute',
    key: 'FINANCIAL_INSTITUTION',
    isActive: true,
    isSingleAssignment: false,
    versionNo: '0.1',
  },
];
export const defaultOrganizationRoles = [
  {
    name: 'Procuring Unit Head',
    description: 'Procuring Unit Head',
    isSystemRole: true,
    rolePermissions: [{ permissionId: 9 }, { permissionId: 10 }],
  },
  {
    name: 'Head of Procuring Entity',
    description: 'Head of Procuring Entity',
    isSystemRole: true,
    rolePermissions: [{ permissionId: 11 }, { permissionId: 12 }],
  },
];
