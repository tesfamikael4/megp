import { NavItemWrapper } from '../types/nav-item';
import {
  IconBriefcase,
  IconDashboard,
  IconFolderPause,
  IconFolderPlus,
  IconListCheck,
  IconNotification,
} from '@tabler/icons-react';

export const navLinks: NavItemWrapper[] = [
  {
    title: 'Information',
    children: [
      {
        label: 'Dashboard',
        icon: IconDashboard,
        link: 'dashboard',
        displayName: 'Dashboard',
      },
      {
        label: 'Notifications',
        icon: IconNotification,
        link: 'notifications',
        displayName: 'List of Notifications',
      },
    ],
  },
  {
    title: 'Vendor Registration',
    children: [
      {
        label: 'Registrations Service',
        icon: IconFolderPlus,
        links: [
          {
            label: 'New',
            link: 'rs-new',
            displayName: 'Register as a Vendor',
          },
          {
            label: '',
            link: 'rs-new-form',
            displayName: 'Vendor Registration',
          },
          {
            label: 'Renewal',
            link: 'rs-renewal',
            displayName: 'Renewal Vendor Information',
          },
          {
            label: 'Upgrade',
            link: 'rs-upgrade',
            displayName: 'Upgrade Vendor Information',
          },
          {
            label: 'Update Bank',
            link: 'rs-update-bank',
            displayName: 'Upgrade Vendor Bank Information',
          },
        ],
      },
      {
        label: 'Draft Applications',
        icon: IconFolderPause,
        link: 'vendor',
        displayName: 'List of Drafts',
      },
      {
        label: 'Follow Up Tasks',
        icon: IconListCheck,
        link: 'vendor',
        displayName: 'List of Follow Up Tasks',
      },
      {
        label: 'Application Tracking',
        icon: IconBriefcase,
        link: 'vendor',
        displayName: 'List of Application Trackings',
      },
    ],
  },
];

export const nationalityOptions = [
  {
    value: 'AF',
    label: 'Afghanistan',
  },
  {
    value: 'AX',
    label: 'Åland Islands',
  },
  {
    value: 'AL',
    label: 'Albania',
  },
  {
    value: 'DZ',
    label: 'Algeria',
  },
  {
    value: 'AS',
    label: 'American Samoa',
  },
  {
    value: 'AD',
    label: 'Andorra',
  },
  {
    value: 'AO',
    label: 'Angola',
  },
  {
    value: 'AI',
    label: 'Anguilla',
  },
  {
    value: 'AQ',
    label: 'Antarctica',
  },
  {
    value: 'AG',
    label: 'Antigua and Barbuda',
  },
  {
    value: 'AR',
    label: 'Argentina',
  },
  {
    value: 'AM',
    label: 'Armenia',
  },
  {
    value: 'AW',
    label: 'Aruba',
  },
  {
    value: 'AU',
    label: 'Australia',
  },
  {
    value: 'AT',
    label: 'Austria',
  },
  {
    value: 'AZ',
    label: 'Azerbaijan',
  },
  {
    value: 'BS',
    label: 'Bahamas',
  },
  {
    value: 'BH',
    label: 'Bahrain',
  },
  {
    value: 'BD',
    label: 'Bangladesh',
  },
  {
    value: 'BB',
    label: 'Barbados',
  },
  {
    value: 'BY',
    label: 'Belarus',
  },
  {
    value: 'BE',
    label: 'Belgium',
  },
  {
    value: 'BZ',
    label: 'Belize',
  },
  {
    value: 'BJ',
    label: 'Benin',
  },
  {
    value: 'BM',
    label: 'Bermuda',
  },
  {
    value: 'BT',
    label: 'Bhutan',
  },
  {
    value: 'BO',
    label: 'Bolivia',
  },
  {
    value: 'BA',
    label: 'Bosnia and Herzegovina',
  },
  {
    value: 'BW',
    label: 'Botswana',
  },
  {
    value: 'BV',
    label: 'Bouvet Island',
  },
  {
    value: 'BR',
    label: 'Brazil',
  },
  {
    value: 'IO',
    label: 'British Indian Ocean Territory',
  },
  {
    value: 'VG',
    label: 'British Virgin Islands',
  },
  {
    value: 'BN',
    label: 'Brunei',
  },
  {
    value: 'BG',
    label: 'Bulgaria',
  },
  {
    value: 'BF',
    label: 'Burkina Faso',
  },
  {
    value: 'BI',
    label: 'Burundi',
  },
  {
    value: 'KH',
    label: 'Cambodia',
  },
  {
    value: 'CM',
    label: 'Cameroon',
  },
  {
    value: 'CA',
    label: 'Canada',
  },
  {
    value: 'CV',
    label: 'Cape Verde',
  },
  {
    value: 'BQ',
    label: 'Caribbean Netherlands',
  },
  {
    value: 'KY',
    label: 'Cayman Islands',
  },
  {
    value: 'CF',
    label: 'Central African Republic',
  },
  {
    value: 'TD',
    label: 'Chad',
  },
  {
    value: 'CL',
    label: 'Chile',
  },
  {
    value: 'CN',
    label: 'China',
  },
  {
    value: 'CX',
    label: 'Christmas Island',
  },
  {
    value: 'CC',
    label: 'Cocos (Keeling) Islands',
  },
  {
    value: 'CO',
    label: 'Colombia',
  },
  {
    value: 'KM',
    label: 'Comoros',
  },
  {
    value: 'CK',
    label: 'Cook Islands',
  },
  {
    value: 'CR',
    label: 'Costa Rica',
  },
  {
    value: 'HR',
    label: 'Croatia',
  },
  {
    value: 'CU',
    label: 'Cuba',
  },
  {
    value: 'CW',
    label: 'Curaçao',
  },
  {
    value: 'CY',
    label: 'Cyprus',
  },
  {
    value: 'CZ',
    label: 'Czechia',
  },
  {
    value: 'DK',
    label: 'Denmark',
  },
  {
    value: 'DJ',
    label: 'Djibouti',
  },
  {
    value: 'DM',
    label: 'Dominica',
  },
  {
    value: 'DO',
    label: 'Dominican Republic',
  },
  {
    value: 'CD',
    label: 'DR Congo',
  },
  {
    value: 'EC',
    label: 'Ecuador',
  },
  {
    value: 'EG',
    label: 'Egypt',
  },
  {
    value: 'SV',
    label: 'El Salvador',
  },
  {
    value: 'GQ',
    label: 'Equatorial Guinea',
  },
  {
    value: 'ER',
    label: 'Eritrea',
  },
  {
    value: 'EE',
    label: 'Estonia',
  },
  {
    value: 'SZ',
    label: 'Eswatini',
  },
  {
    value: 'ET',
    label: 'Ethiopia',
  },
  {
    value: 'FK',
    label: 'Falkland Islands',
  },
  {
    value: 'FO',
    label: 'Faroe Islands',
  },
  {
    value: 'FJ',
    label: 'Fiji',
  },
  {
    value: 'FI',
    label: 'Finland',
  },
  {
    value: 'FR',
    label: 'France',
  },
  {
    value: 'GF',
    label: 'French Guiana',
  },
  {
    value: 'PF',
    label: 'French Polynesia',
  },
  {
    value: 'TF',
    label: 'French Southern and Antarctic Lands',
  },
  {
    value: 'GA',
    label: 'Gabon',
  },
  {
    value: 'GM',
    label: 'Gambia',
  },
  {
    value: 'GE',
    label: 'Georgia',
  },
  {
    value: 'DE',
    label: 'Germany',
  },
  {
    value: 'GH',
    label: 'Ghana',
  },
  {
    value: 'GI',
    label: 'Gibraltar',
  },
  {
    value: 'GR',
    label: 'Greece',
  },
  {
    value: 'GL',
    label: 'Greenland',
  },
  {
    value: 'GD',
    label: 'Grenada',
  },
  {
    value: 'GP',
    label: 'Guadeloupe',
  },
  {
    value: 'GU',
    label: 'Guam',
  },
  {
    value: 'GT',
    label: 'Guatemala',
  },
  {
    value: 'GG',
    label: 'Guernsey',
  },
  {
    value: 'GN',
    label: 'Guinea',
  },
  {
    value: 'GW',
    label: 'Guinea-Bissau',
  },
  {
    value: 'GY',
    label: 'Guyana',
  },
  {
    value: 'HT',
    label: 'Haiti',
  },
  {
    value: 'HM',
    label: 'Heard Island and McDonald Islands',
  },
  {
    value: 'HN',
    label: 'Honduras',
  },
  {
    value: 'HK',
    label: 'Hong Kong',
  },
  {
    value: 'HU',
    label: 'Hungary',
  },
  {
    value: 'IS',
    label: 'Iceland',
  },
  {
    value: 'IN',
    label: 'India',
  },
  {
    value: 'ID',
    label: 'Indonesia',
  },
  {
    value: 'IR',
    label: 'Iran',
  },
  {
    value: 'IQ',
    label: 'Iraq',
  },
  {
    value: 'IE',
    label: 'Ireland',
  },
  {
    value: 'IM',
    label: 'Isle of Man',
  },
  {
    value: 'IL',
    label: 'Israel',
  },
  {
    value: 'IT',
    label: 'Italy',
  },
  {
    value: 'CI',
    label: 'Ivory Coast',
  },
  {
    value: 'JM',
    label: 'Jamaica',
  },
  {
    value: 'JP',
    label: 'Japan',
  },
  {
    value: 'JE',
    label: 'Jersey',
  },
  {
    value: 'JO',
    label: 'Jordan',
  },
  {
    value: 'KZ',
    label: 'Kazakhstan',
  },
  {
    value: 'KE',
    label: 'Kenya',
  },
  {
    value: 'KI',
    label: 'Kiribati',
  },
  {
    value: 'XK',
    label: 'Kosovo',
  },
  {
    value: 'KW',
    label: 'Kuwait',
  },
  {
    value: 'KG',
    label: 'Kyrgyzstan',
  },
  {
    value: 'LA',
    label: 'Laos',
  },
  {
    value: 'LV',
    label: 'Latvia',
  },
  {
    value: 'LB',
    label: 'Lebanon',
  },
  {
    value: 'LS',
    label: 'Lesotho',
  },
  {
    value: 'LR',
    label: 'Liberia',
  },
  {
    value: 'LY',
    label: 'Libya',
  },
  {
    value: 'LI',
    label: 'Liechtenstein',
  },
  {
    value: 'LT',
    label: 'Lithuania',
  },
  {
    value: 'LU',
    label: 'Luxembourg',
  },
  {
    value: 'MO',
    label: 'Macau',
  },
  {
    value: 'MG',
    label: 'Madagascar',
  },
  {
    value: 'MW',
    label: 'Malawi',
  },
  {
    value: 'MY',
    label: 'Malaysia',
  },
  {
    value: 'MV',
    label: 'Maldives',
  },
  {
    value: 'ML',
    label: 'Mali',
  },
  {
    value: 'MT',
    label: 'Malta',
  },
  {
    value: 'MH',
    label: 'Marshall Islands',
  },
  {
    value: 'MQ',
    label: 'Martinique',
  },
  {
    value: 'MR',
    label: 'Mauritania',
  },
  {
    value: 'MU',
    label: 'Mauritius',
  },
  {
    value: 'YT',
    label: 'Mayotte',
  },
  {
    value: 'MX',
    label: 'Mexico',
  },
  {
    value: 'FM',
    label: 'Micronesia',
  },
  {
    value: 'MD',
    label: 'Moldova',
  },
  {
    value: 'MC',
    label: 'Monaco',
  },
  {
    value: 'MN',
    label: 'Mongolia',
  },
  {
    value: 'ME',
    label: 'Montenegro',
  },
  {
    value: 'MS',
    label: 'Montserrat',
  },
  {
    value: 'MA',
    label: 'Morocco',
  },
  {
    value: 'MZ',
    label: 'Mozambique',
  },
  {
    value: 'MM',
    label: 'Myanmar',
  },
  {
    value: 'NA',
    label: 'Namibia',
  },
  {
    value: 'NR',
    label: 'Nauru',
  },
  {
    value: 'NP',
    label: 'Nepal',
  },
  {
    value: 'NL',
    label: 'Netherlands',
  },
  {
    value: 'NC',
    label: 'New Caledonia',
  },
  {
    value: 'NZ',
    label: 'New Zealand',
  },
  {
    value: 'NI',
    label: 'Nicaragua',
  },
  {
    value: 'NE',
    label: 'Niger',
  },
  {
    value: 'NG',
    label: 'Nigeria',
  },
  {
    value: 'NU',
    label: 'Niue',
  },
  {
    value: 'NF',
    label: 'Norfolk Island',
  },
  {
    value: 'KP',
    label: 'North Korea',
  },
  {
    value: 'MK',
    label: 'North Macedonia',
  },
  {
    value: 'MP',
    label: 'Northern Mariana Islands',
  },
  {
    value: 'NO',
    label: 'Norway',
  },
  {
    value: 'OM',
    label: 'Oman',
  },
  {
    value: 'PK',
    label: 'Pakistan',
  },
  {
    value: 'PW',
    label: 'Palau',
  },
  {
    value: 'PS',
    label: 'Palestine',
  },
  {
    value: 'PA',
    label: 'Panama',
  },
  {
    value: 'PG',
    label: 'Papua New Guinea',
  },
  {
    value: 'PY',
    label: 'Paraguay',
  },
  {
    value: 'PE',
    label: 'Peru',
  },
  {
    value: 'PH',
    label: 'Philippines',
  },
  {
    value: 'PN',
    label: 'Pitcairn Islands',
  },
  {
    value: 'PL',
    label: 'Poland',
  },
  {
    value: 'PT',
    label: 'Portugal',
  },
  {
    value: 'PR',
    label: 'Puerto Rico',
  },
  {
    value: 'QA',
    label: 'Qatar',
  },
  {
    value: 'CG',
    label: 'Republic of the Congo',
  },
  {
    value: 'RE',
    label: 'Réunion',
  },
  {
    value: 'RO',
    label: 'Romania',
  },
  {
    value: 'RU',
    label: 'Russia',
  },
  {
    value: 'RW',
    label: 'Rwanda',
  },
  {
    value: 'BL',
    label: 'Saint Barthélemy',
  },
  {
    value: 'SH',
    label: 'Saint Helena, Ascension and Tristan da Cunha',
  },
  {
    value: 'KN',
    label: 'Saint Kitts and Nevis',
  },
  {
    value: 'LC',
    label: 'Saint Lucia',
  },
  {
    value: 'MF',
    label: 'Saint Martin',
  },
  {
    value: 'PM',
    label: 'Saint Pierre and Miquelon',
  },
  {
    value: 'VC',
    label: 'Saint Vincent and the Grenadines',
  },
  {
    value: 'WS',
    label: 'Samoa',
  },
  {
    value: 'SM',
    label: 'San Marino',
  },
  {
    value: 'ST',
    label: 'São Tomé and Príncipe',
  },
  {
    value: 'SA',
    label: 'Saudi Arabia',
  },
  {
    value: 'SN',
    label: 'Senegal',
  },
  {
    value: 'RS',
    label: 'Serbia',
  },
  {
    value: 'SC',
    label: 'Seychelles',
  },
  {
    value: 'SL',
    label: 'Sierra Leone',
  },
  {
    value: 'SG',
    label: 'Singapore',
  },
  {
    value: 'SX',
    label: 'Sint Maarten',
  },
  {
    value: 'SK',
    label: 'Slovakia',
  },
  {
    value: 'SI',
    label: 'Slovenia',
  },
  {
    value: 'SB',
    label: 'Solomon Islands',
  },
  {
    value: 'SO',
    label: 'Somalia',
  },
  {
    value: 'ZA',
    label: 'South Africa',
  },
  {
    value: 'GS',
    label: 'South Georgia',
  },
  {
    value: 'KR',
    label: 'South Korea',
  },
  {
    value: 'SS',
    label: 'South Sudan',
  },
  {
    value: 'ES',
    label: 'Spain',
  },
  {
    value: 'LK',
    label: 'Sri Lanka',
  },
  {
    value: 'SD',
    label: 'Sudan',
  },
  {
    value: 'SR',
    label: 'Suriname',
  },
  {
    value: 'SJ',
    label: 'Svalbard and Jan Mayen',
  },
  {
    value: 'SE',
    label: 'Sweden',
  },
  {
    value: 'CH',
    label: 'Switzerland',
  },
  {
    value: 'SY',
    label: 'Syria',
  },
  {
    value: 'TW',
    label: 'Taiwan',
  },
  {
    value: 'TJ',
    label: 'Tajikistan',
  },
  {
    value: 'TZ',
    label: 'Tanzania',
  },
  {
    value: 'TH',
    label: 'Thailand',
  },
  {
    value: 'TL',
    label: 'Timor-Leste',
  },
  {
    value: 'TG',
    label: 'Togo',
  },
  {
    value: 'TK',
    label: 'Tokelau',
  },
  {
    value: 'TO',
    label: 'Tonga',
  },
  {
    value: 'TT',
    label: 'Trinidad and Tobago',
  },
  {
    value: 'TN',
    label: 'Tunisia',
  },
  {
    value: 'TR',
    label: 'Turkey',
  },
  {
    value: 'TM',
    label: 'Turkmenistan',
  },
  {
    value: 'TC',
    label: 'Turks and Caicos Islands',
  },
  {
    value: 'TV',
    label: 'Tuvalu',
  },
  {
    value: 'UG',
    label: 'Uganda',
  },
  {
    value: 'UA',
    label: 'Ukraine',
  },
  {
    value: 'AE',
    label: 'United Arab Emirates',
  },
  {
    value: 'GB',
    label: 'United Kingdom',
  },
  {
    value: 'US',
    label: 'United States',
  },
  {
    value: 'UM',
    label: 'United States Minor Outlying Islands',
  },
  {
    value: 'VI',
    label: 'United States Virgin Islands',
  },
  {
    value: 'UY',
    label: 'Uruguay',
  },
  {
    value: 'UZ',
    label: 'Uzbekistan',
  },
  {
    value: 'VU',
    label: 'Vanuatu',
  },
  {
    value: 'VA',
    label: 'Vatican City',
  },
  {
    value: 'VE',
    label: 'Venezuela',
  },
  {
    value: 'VN',
    label: 'Vietnam',
  },
  {
    value: 'WF',
    label: 'Wallis and Futuna',
  },
  {
    value: 'EH',
    label: 'Western Sahara',
  },
  {
    value: 'YE',
    label: 'Yemen',
  },
  {
    value: 'ZM',
    label: 'Zambia',
  },
  {
    value: 'ZW',
    label: 'Zimbabwe',
  },
];
