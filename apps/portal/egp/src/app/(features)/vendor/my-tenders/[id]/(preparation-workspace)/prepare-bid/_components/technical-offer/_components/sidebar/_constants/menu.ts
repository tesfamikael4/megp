import {
  IconAdjustments,
  IconBriefcase,
  IconChecklist,
  IconFolderPlus,
  IconGavel,
  IconHeartHandshake,
  IconShoppingCart,
  IconUserCog,
  IconUserShare,
} from '@tabler/icons-react';
import { MenuLinks } from '../models';

export const bidSubmittedBy: MenuLinks.SidebarLinks[] = [
  {
    label: 'Bid Submitted By',
    icon: IconFolderPlus,
    link: `submitted-by`,
  },
  {
    label: 'Authorized Representative Information',
    icon: IconAdjustments,
    link: `authorized-representative`,
  },
  {
    label: 'Documentary Evidence Attachments',
    icon: IconUserShare,
    link: `documentary-evidence`,
  },
  {
    label: 'Terms and Conditions',
    icon: IconUserShare,
    link: `terms-and-conditions`,
  },
];

export const biddersCertificateLinks: MenuLinks.SidebarLinks[] = [
  {
    label: 'Financial-standing',
    icon: IconGavel,
    link: `financial-standing`,
  },

  {
    label: 'Annual turnover',
    icon: IconShoppingCart,
    link: `annual-turnover`,
  },
  {
    label: 'Financial resource',
    icon: IconUserCog,
    link: `financial-resource`,
  },
  {
    label: 'Proposed Personnel',
    icon: IconBriefcase,
    link: `proposed-personnel`,
  },
  {
    label: 'Experience',
    icon: IconHeartHandshake,
    link: `Experience`,
  },
  {
    label: 'Historical Contract non Performance',
    icon: IconShoppingCart,
    link: `historical-contract`,
  },
  {
    label: 'Historical Pending Litigation',
    icon: IconChecklist,
    link: `historical-pending-litigation`,
  },
  {
    label: 'Current Contract Commitment or Works in progress',
    icon: IconChecklist,
    link: `contract`,
  },
  {
    label: 'Professional Qualification and Capabilities',
    icon: IconChecklist,
    link: `professional-qualification`,
  },
  {
    label: 'Site Visit Knowledge and Appreciation of the Project Area',
    icon: IconChecklist,
    link: `site-visit`,
  },
  {
    label: 'Quality Assurance or Managerial and Control Procedures',
    icon: IconChecklist,
    link: `quality-assurance`,
  },
  {
    label: 'Equipments And Facilities',
    icon: IconChecklist,
    link: `equipments-and-facilities`,
  },
  {
    label: 'Bidders Audit Agency',
    icon: IconChecklist,
    link: `bidders-audit-agency`,
  },
  {
    label: 'Organization of Firm',
    icon: IconChecklist,
    link: `organization-of-firm`,
  },
  {
    label: 'Bank Account Number and Bank Address',
    icon: IconChecklist,
    link: `bank-account`,
  },
];

export const technicalOffer: MenuLinks.SidebarLinks[] = [
  {
    label: 'Technical Offer',
    icon: IconFolderPlus,
    link: `technical-offer`,
  },
];
export const financialOffer: MenuLinks.SidebarLinks[] = [
  {
    label: 'Financial Offer',
    icon: IconFolderPlus,
    link: `financial-offer`,
  },
];
