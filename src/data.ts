import { Scheme, CitizenProfile } from './types';

export const INCOME_RANGES = [
  "₹0 - ₹5,000",
  "₹5,000 - ₹15,000",
  "₹15,000 - ₹30,000",
  "₹30,000 - ₹50,000",
  "₹50,000+"
];

export const STATES_AND_DISTRICTS: { [key: string]: string[] } = {
  "Maharashtra": ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Noida", "Agra"],
  "Delhi": ["Central Delhi", "New Delhi", "South Delhi", "West Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot" , "Gandhinagar"]
};

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'pmay',
    title: 'Pradhan Mantri Awas Yojana (PMAY)',
    category: 'Housing',
    categorySlug: 'housing',
    shortDescription: 'Housing for All - Urban & Rural welfare drive',
    longDescription: 'PMAY is a flagship mission by the Government of India that aims to provide affordable housing for the urban and rural poor by the year 2024. The scheme addresses the housing shortage by providing financial assistance and interest subsidies for the construction or purchase of homes.',
    estimatedBenefitVal: 120000,
    estimatedBenefitText: '₹1,20,000 - ₹2,67,000 / one-time assistance',
    benefitsList: [
      {
        title: 'Financial Assistance',
        description: 'Subsidy up to ₹2.67 Lakhs on home loan interest rates for Middle Income Groups.',
        icon: 'savings'
      },
      {
        title: 'Direct Support',
        description: 'Lump sum of ₹1.20 Lakhs for house construction in plain areas (Rural).',
        icon: 'house'
      }
    ],
    eligibilityCriteria: [
      {
        id: 'pmay_income',
        description: 'Annual Household Income < ₹18 Lakhs',
        status: 'matches',
        requiredValue: 'less than 18 Lakhs'
      },
      {
        id: 'pmay_pucca',
        description: 'Family does not own a pucca house anywhere in India',
        status: 'matches',
        requiredValue: 'No'
      },
      {
        id: 'pmay_female',
        description: 'The female head of the family should be a co-owner',
        status: 'incomplete',
        requiredValue: 'Required'
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Bank Passbook', 'Address Proof'],
    howToApply: ['Register on Portal', 'Upload Documents', 'Verification'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYAQBMUANK0077iITFwqjbumfyHWXPxKn8_Ki1FGaO4pFpLB3whG7Y9I_uofUNRUgsmuLywLcvDaBIfik1uwOf-E6HT8YRuEWi4ktfOS33L3JoZcR3cAOni867bhZV-DRJZlFfwMyCY59TnBwYokwaW4Rz_ic5pD0P4UCMeo9bSNjK_ufNHsbV5_IzrPo6vjh-KJAY7JeA-VK-xe66j4Idb0-FbheVaBefM5Qs9GIc9iYFaJBlUwRmEpNoqb4PP9ZiOE9m2BlKbFbj'
  },
  {
    id: 'pmkisan',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Agriculture',
    categorySlug: 'agriculture',
    shortDescription: 'Income support of ₹6,000 per year in three equal installments to all landholding farmers.',
    longDescription: 'PM-KISAN is a central government initiative to provide income support to all small and marginal landholder farmer families. Under this scheme, financial assistance of ₹6,000 per year is directly transferred into the bank accounts of farmers. This helps them procure agricultural machinery, quality seeds, and other farming necessities.',
    estimatedBenefitVal: 6000,
    estimatedBenefitText: '₹6,000 / year direct transfer',
    benefitsList: [
      {
        title: 'Direct Income Transfer',
        description: '₹2,000 every 4 months (total ₹6,000 annually) direct to bank account.',
        icon: 'payments'
      },
      {
        title: 'Empowerment for Farmers',
        description: 'Helps meet agricultural inputs expense, seeds, fertilizers, and minor farm needs.',
        icon: 'agriculture'
      }
    ],
    eligibilityCriteria: [
      {
        id: 'pmk_occ',
        description: 'Must be actively working in Farmer / Agriculture sector',
        status: 'incomplete',
        requiredValue: 'farmer'
      },
      {
        id: 'pmk_land',
        description: 'Must hold valid agricultural land under State land registry',
        status: 'matches',
        requiredValue: 'Yes'
      },
      {
        id: 'pmk_income',
        description: 'Monthly income level is low or marginal',
        status: 'matches',
        requiredValue: 'Under 15k'
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Land Registry Document', 'Bank Passbook'],
    howToApply: ['Self Registration on PM-Kisan Portal', 'Aadhaar Verification', 'District Approval'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATsMbFYho099RWheyg-GqWcjpCLh3VfLqVXpti5t2WtyL4NcQP4pHibWZ2vNLVVwKMyYovyeo5p6Dz7LjewfpPXvLG1_GPwnkm5sJgiw4vrgpBpyP12AQKzRXdxOQ-VTIy4ysO5wjNhyVu5Qm0TxKe1adY_0qbzT8QMdLhIXLt5fUPUEbBSMZtedZZyR6QyEyj_PTfd5H-fQblQ3lN3LEHOI11NcVvo1R5eqOLf5hAYQYerlXFfTHDbqbSwgf7s460CAjurL2176bg'
  },
  {
    id: 'ayushman',
    title: 'Ayushman Bharat (PM-JAY)',
    category: 'Health',
    categorySlug: 'health',
    shortDescription: 'Health cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
    longDescription: 'Ayushman Bharat (Pradhan Mantri Jan Arogya Yojana) is the largest government-funded health assurance scheme in the world. It provides a health insurance cover of up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization across all empaneled public and private hospitals in India, covering pre/post hospitalization, diagnostics, and medicines.',
    estimatedBenefitVal: 500000,
    estimatedBenefitText: '₹5,00,000 / year health cover',
    benefitsList: [
      {
        title: 'Cashless Treatment',
        description: 'Completely cashless and paperless healthcare services at all empaneled hospitals.',
        icon: 'medical_services'
      },
      {
        title: 'Expansive Cover',
        description: 'Covers up to 3 days of pre-hospitalization and 15 days of post-hospitalization costs.',
        icon: 'emergency'
      }
    ],
    eligibilityCriteria: [
      {
        id: 'ay_income',
        description: 'Monthly income falls within Lower or Middle ranges (Below ₹30k)',
        status: 'matches',
        requiredValue: 'Under 30k'
      },
      {
        id: 'ay_residence',
        description: 'Must hold active Ration Card or belong to rural/urban poor listed in SECC',
        status: 'matches'
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
    howToApply: ['Check Name in SECC Portal', 'Aadhaar e-KYC', 'Ayushman Golden Card Issuance'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCajasSVQTNg1UCrUQ521MaMD6mY65VVcB4nNQZyTtlInzvzbdv006HbqDLeA6gMqmnMA6fMmldVmCCnhqrQ4P5enxI54PK64OTxqKForzcUZ_7YfrjriKUVDIcLVHQewc6RrBBSik_8H30y8sDbMYyFZFBEnpYroMm7pturESKPfaN_DKgs-ZyN40StqJorlOVxPtmzTgaiMJqvwlnjwBNJdHEU8fh9Nrgjq4YIkLh_6gUH3OBQeyqSfQA1LshCC94mp6ITlYeYg-Xk'
  },
  {
    id: 'scholarship',
    title: 'Post-Matric Scholarship Scheme',
    category: 'Education',
    categorySlug: 'education',
    shortDescription: 'Financial assistance for students belonging to SC/ST/OBC categories for higher education.',
    longDescription: 'The Post-Matric Scholarship is a centrally sponsored scholarship scheme designed to provide financial aid to students from SC/ST/OBC and economically weaker backgrounds. It covers tuition fees, maintenance allowance, and book grants to ensure that financial hardship does not prevent talented students from pursuing higher education.',
    estimatedBenefitVal: 45000,
    estimatedBenefitText: '₹20,000 - ₹60,000 / year educational aid',
    benefitsList: [
      {
        title: 'Fee Re-imbursement',
        description: 'Full program registration and tuition fee re-imbursement for accredited universities.',
        icon: 'school'
      },
      {
        title: 'Monthly Stipend',
        description: 'Maintenance allowance up to ₹1,200 per month for hostels and stationary.',
        icon: 'menu_book'
      }
    ],
    eligibilityCriteria: [
      {
        id: 'sch_occ',
        description: 'Must be currently registered as a high-school or college Student',
        status: 'incomplete',
        requiredValue: 'student'
      },
      {
        id: 'sch_income',
        description: 'Estimated Household Monthly Income < ₹30,000',
        status: 'matches',
        requiredValue: 'Under 30k'
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'College Admission Proof', 'Income Certificate', 'Caste Certificate (if applicable)'],
    howToApply: ['Register on National Scholarship Portal (NSP)', 'Upload academic documents', 'College Verification', 'State Treasury Disbursement'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-deeDRA8heuHxQ0tJPXluuHliPxXEO7sWCH0qcb4PGj0azh-gS2zXUszXW3Le9XtYPycAeSWneiF0MXgK7Jsmr_1flkzaDHaD-adInKHVKq9bpYV3MPOMbfuEnQYVs2VzvcLMREvAzuCigh2QBhDk2EiVDF1afJC3p9ubtH5Xo4bh-hFsYNmfXd1ib26zG2aBL4A8azEAB6VXDT6tM2zVRmnpvHby_65AL4hDIhXLg0e6sopo8jcPIb0cCP7HWucjEYFPsdVSAFzr'
  },
  {
    id: 'jaljeevan',
    title: 'Jal Jeevan Mission (JJM)',
    category: 'Welfare',
    categorySlug: 'welfare',
    shortDescription: 'Providing safe and adequate functional household tap connections to rural homes by 2024.',
    longDescription: 'Jal Jeevan Mission is a monumental government program aiming to supply 55 liters of clean, chlorinated drinking water per person per day to every single rural household through Functional Household Tap Connections (FHTC). It focuses on rainwater harvesting, recharging local aquifers, and greywater management.',
    estimatedBenefitVal: 15000,
    estimatedBenefitText: 'Free clean tap water infrastructure Installation',
    benefitsList: [
      {
        title: 'Clean Drinking Water',
        description: 'Direct drinking water supply point inside your home compound.',
        icon: 'water_drop'
      },
      {
        title: 'Health & Sanitation',
        description: 'Vastly reduces the incidence of water-borne diseases and improves general sanitations.',
        icon: 'health_and_safety'
      }
    ],
    eligibilityCriteria: [
      {
        id: 'jj_residence',
        description: 'Must reside in an eligible suburban, rural, or village territory',
        status: 'matches'
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card / Address Proof'],
    howToApply: ['Submit request to the local Gram Panchayat', 'Aadhaar Verification', 'Tap connection installation'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdcsBjzzFB45HwiH3ZCHTQIKLEsJP65ORXtcZ4w_ckbSw8KNC0k56AmbTMVVTdCoGFmlQWAHrAq5FqnWuleCw0k-XNtAYNA_LzIWgO2BLXQsY4cyU9uRECw3iH97d5DR4exButiVLAzeJCmg5Pd7hvbPbf7FTBC35S2dvYD2GDBiqLsQCfQ_6rqVyADT2YBG_qBnH7j-dECIq6IMSRLWSzO12dnl3ypB0qYx8o0crtY45Bjm5FoxjR9-BjJsHawwgzeoAAOYBjEwYG'
  }
];

export function calculateSchemeMatch(scheme: Scheme, profile: CitizenProfile): { 
  percentage: number; 
  matchedCount: number; 
  totalCount: number; 
  updatedCriteria: Scheme['eligibilityCriteria'];
} {
  let matchedCount = 0;
  const totalCount = scheme.eligibilityCriteria.length;
  
  const updatedCriteria = scheme.eligibilityCriteria.map(criterion => {
    let isMatched = false;
    
    if (criterion.id === 'pmay_income') {
      // Index 0: 0-5k, Index 1: 5-15k, Index 2: 15-30k, Index 3: 30-50k, Index 4: 50k+
      // Match if income range index is below 4 (income < ₹50k/month equivalent or ₹18L/year)
      isMatched = profile.incomeRangeIndex < 4;
    } else if (criterion.id === 'pmay_pucca') {
      isMatched = true; // No details asked, default to matched
    } else if (criterion.id === 'pmay_female') {
      // Incomplete by default, but matches if they ask AI or click "Authorize details"
      isMatched = profile.gender === 'female';
    } else if (criterion.id === 'pmk_occ') {
      isMatched = profile.occupation === 'farmer';
    } else if (criterion.id === 'pmk_land') {
      isMatched = profile.occupation === 'farmer'; // Assume farmers have land
    } else if (criterion.id === 'pmk_income') {
      isMatched = profile.incomeRangeIndex <= 1; // High match for low income
    } else if (criterion.id === 'ay_income') {
      isMatched = profile.incomeRangeIndex <= 2;
    } else if (criterion.id === 'ay_residence') {
      isMatched = true; 
    } else if (criterion.id === 'sch_occ') {
      isMatched = profile.occupation === 'student';
    } else if (criterion.id === 'sch_income') {
      isMatched = profile.incomeRangeIndex <= 2;
    } else if (criterion.id === 'jj_residence') {
      isMatched = true;
    } else {
      isMatched = true; 
    }
    
    if (isMatched) matchedCount++;
    
    return {
      ...criterion,
      status: isMatched ? 'matches' : 'incomplete'
    };
  });
  
  const percentage = Math.round((matchedCount / totalCount) * 100);
  
  return {
    percentage,
    matchedCount,
    totalCount,
    updatedCriteria
  };
}
