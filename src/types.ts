export type UserRole = 'citizen' | 'employee' | 'commissioner';

export type Language = 'en' | 'te';

export type Department = 
  | 'Town Planning'
  | 'Revenue & Taxes'
  | 'Public Health & Sanitation'
  | 'Engineering & Works'
  | 'Water Supply & Sewerage'
  | 'Urban Forestry'
  | 'General Administration';

export type FileStatus = 
  | 'Submitted'
  | 'In Review'
  | 'Inspection Pending'
  | 'Clarification Required'
  | 'Approved'
  | 'Rejected'
  | 'Disposed & Issued';

export type FilePriority = 'Normal' | 'Tatkal' | 'Grievance' | 'Collectorate Ref' | 'Court Case';

export interface MovementStep {
  id: string;
  stepNumber: number;
  department: Department;
  officerName: string;
  designation: string;
  actionTaken: string;
  date: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
  remarks?: string;
  outwardNo?: string;
}

export interface NoteSheetEntry {
  id: string;
  pageNumber: number;
  officerName: string;
  designation: string;
  department: Department;
  timestamp: string;
  noteText: string;
  signatureCode: string;
}

export interface Enclosure {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface GVMCFile {
  id: string; // e.g. GVMC/TP/2026/08942
  subject: string;
  applicantName: string;
  applicantPhone: string;
  applicantAddress: string;
  wardNo: string;
  zone: string; // Zone 1 to Zone 8
  department: Department;
  category: string; // e.g., 'G+2 Building Permission', 'New Water Tap', 'Property Mutation'
  priority: FilePriority;
  currentStatus: FileStatus;
  currentCustodian: string;
  currentCustodianDesignation: string;
  submissionDate: string;
  slaDays: number;
  slaDueDate: string;
  daysRemaining: number;
  movementHistory: MovementStep[];
  noteSheet: NoteSheetEntry[];
  enclosures: Enclosure[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  employeeId?: string;
  department?: Department;
  designation?: string;
  zone?: string;
}
