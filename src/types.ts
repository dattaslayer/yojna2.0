export interface CitizenProfile {
  name: string;
  dob: string;
  gender: 'male' | 'female' | 'other' | '';
  state: string;
  district: string;
  occupation: 'farmer' | 'student' | 'worker' | 'unemployed' | 'other' | '';
  incomeRangeIndex: number; // Index of list of income ranges
}

export interface EligibilityCriterion {
  id: string;
  description: string;
  status: 'matches' | 'incomplete' | string;
  userField?: string;
  requiredValue?: string;
}

export interface Scheme {
  id: string;
  title: string;
  category: string;
  categorySlug: 'housing' | 'agriculture' | 'health' | 'education' | 'welfare';
  shortDescription: string;
  longDescription: string;
  estimatedBenefitVal: number;
  estimatedBenefitText: string;
  benefitsList: {
    title: string;
    description: string;
    icon: string;
  }[];
  eligibilityCriteria: EligibilityCriterion[];
  requiredDocuments: string[];
  howToApply: string[];
  imageUrl: string;
}

export interface Application {
  id: string;
  schemeId: string;
  schemeTitle: string;
  schemeCategory: string;
  appliedDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  fullName: string;
  submittedFiles: { [key: string]: string }; // Name of document, and mock uploaded url / base64 / state
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
