import { GVMCFile } from '../types';

export const MOCK_FILES: GVMCFile[] = [
  {
    id: 'GVMC/TP/2026/08942',
    subject: 'Approval of G+2 Residential Building Plan Construction Sanction',
    applicantName: 'M. Venkata Ramana Rao',
    applicantPhone: '9848012345',
    applicantAddress: 'Plot No. 42, Sector 5, MVP Colony, Ward 24, Zone 3',
    wardNo: 'Ward 24 (MVP Colony)',
    zone: 'Zone 3 - Visakhapatnam North',
    department: 'Town Planning',
    category: 'Building Plan Approval (Residential)',
    priority: 'Normal',
    currentStatus: 'In Review',
    currentCustodian: 'Smt. K. Devi Prasad',
    currentCustodianDesignation: 'Assistant City Planner (ACP - Zone 3)',
    submissionDate: '2026-07-24',
    slaDays: 15,
    slaDueDate: '2026-08-08',
    daysRemaining: 8,
    movementHistory: [
      {
        id: 'm1',
        stepNumber: 1,
        department: 'General Administration',
        officerName: 'Citizen Service Center Desk 4',
        designation: 'Inward Clerk',
        actionTaken: 'File Inward & Initial Scrutiny Completed. Acknowledgement Issued.',
        date: '2026-07-24',
        time: '10:15 AM',
        status: 'completed',
        remarks: 'All required documents submitted including AP-DPMS drawing registration.',
        outwardNo: 'GVMC/INW/2026/10294'
      },
      {
        id: 'm2',
        stepNumber: 2,
        department: 'Town Planning',
        officerName: 'Sri B. Satyanarayana',
        designation: 'Town Planning Building Inspector (TPBI)',
        actionTaken: 'Physical Site Verification & Boundary Inspection',
        date: '2026-07-26',
        time: '02:30 PM',
        status: 'completed',
        remarks: 'Inspected site on 25-07-2026. Plot dimensions match title deed. Setbacks conform to AP Building Rules 2017.',
        outwardNo: 'GVMC/TP/SITE/883'
      },
      {
        id: 'm3',
        stepNumber: 3,
        department: 'Town Planning',
        officerName: 'Smt. K. Devi Prasad',
        designation: 'Assistant City Planner (ACP - Zone 3)',
        actionTaken: 'Technical Scrutiny & Statutory Fee Calculation',
        date: '2026-07-28',
        time: '11:00 AM',
        status: 'current',
        remarks: 'Scrutiny in progress. Verified master plan land use zone (Residential Zone R-1). Scrutinizing structural stability certificate.',
      },
      {
        id: 'm4',
        stepNumber: 4,
        department: 'Town Planning',
        officerName: 'Sri V. Nageswara Rao',
        designation: 'Chief City Planner (CCP - GVMC)',
        actionTaken: 'Final Technical Approval & Permit Signing',
        date: 'Pending',
        time: '-',
        status: 'pending',
        remarks: 'Awaiting submission from ACP.'
      },
      {
        id: 'm5',
        stepNumber: 5,
        department: 'General Administration',
        officerName: 'Zonal Commissioner Office',
        designation: 'Zonal Commissioner (ZC Zone 3)',
        actionTaken: 'Sanction Order Generation & Digital Signature',
        date: 'Pending',
        time: '-',
        status: 'pending',
        remarks: 'Final signoff.'
      }
    ],
    noteSheet: [
      {
        id: 'n1',
        pageNumber: 1,
        officerName: 'Sri B. Satyanarayana (TPBI)',
        designation: 'Town Planning Building Inspector',
        department: 'Town Planning',
        timestamp: '2026-07-26 14:35',
        noteText: 'Put up for ACP scrutiny. Physical site inspection completed. The applicant Sri M. Venkata Ramana Rao has applied for G+2 residential construction on Plot No. 42 (Extent 220 Sq. Yds). Road width in front is 40 ft. Recommended for processing.',
        signatureCode: 'SIG/GVMC/TPBI/88231'
      },
      {
        id: 'n2',
        pageNumber: 2,
        officerName: 'Smt. K. Devi Prasad (ACP)',
        designation: 'Assistant City Planner',
        department: 'Town Planning',
        timestamp: '2026-07-28 11:20',
        noteText: 'Verified layout drawing registered under AP-DPMS portal (ID: DPMS/GVMC/2026/04912). Building height proposed is 10.5m. Setbacks: Front 3.0m, Rear 2.0m, Sides 1.5m. Complies with AP Building Rules. Open Space charges calculated as Rs. 42,500.',
        signatureCode: 'SIG/GVMC/ACP3/90124'
      }
    ],
    enclosures: [
      { id: 'e1', name: 'Registered Sale Deed (Doc No 4812/2021).pdf', size: '2.4 MB', type: 'PDF Document', uploadedBy: 'Applicant', uploadedAt: '2026-07-24' },
      { id: 'e2', name: 'Approved AP-DPMS Key Plan Blueprint.dwg.pdf', size: '4.8 MB', type: 'Architectural Plan', uploadedBy: 'Licensed Architect', uploadedAt: '2026-07-24' },
      { id: 'e3', name: 'Property Tax Latest Paid Clearance Receipt.pdf', size: '820 KB', type: 'Receipt', uploadedBy: 'Applicant', uploadedAt: '2026-07-24' },
      { id: 'e4', name: 'TPBI Physical Site Verification Photographs.pdf', size: '3.1 MB', type: 'Inspection Report', uploadedBy: 'TPBI Satyanarayana', uploadedAt: '2026-07-26' }
    ]
  },
  {
    id: 'GVMC/REV/2026/14209',
    subject: 'Property Tax Title Mutation & Ownership Transfer Application',
    applicantName: 'Smt. Ch. Lakshmi Sarada',
    applicantPhone: '9440198765',
    applicantAddress: 'D.No. 12-4-8, Sea Breeze Apartments, Beach Road, Ward 18, Zone 2',
    wardNo: 'Ward 18 (Maharanipeta)',
    zone: 'Zone 2 - Visakhapatnam South',
    department: 'Revenue & Taxes',
    category: 'Property Tax Mutation',
    priority: 'Normal',
    currentStatus: 'Approved',
    currentCustodian: 'Sri P. Kumar Varma',
    currentCustodianDesignation: 'Revenue Officer (RO - Zone 2)',
    submissionDate: '2026-07-15',
    slaDays: 14,
    slaDueDate: '2026-07-29',
    daysRemaining: 0,
    movementHistory: [
      {
        id: 'm10',
        stepNumber: 1,
        department: 'General Administration',
        officerName: 'MeeSeva / CSC Portal',
        designation: 'Digital Assistant',
        actionTaken: 'Application Registered & Transfer Fee Paid',
        date: '2026-07-15',
        time: '11:30 AM',
        status: 'completed',
        remarks: 'Registered Gift Deed & Death Certificate of previous owner submitted.',
        outwardNo: 'MS/2026/88412'
      },
      {
        id: 'm11',
        stepNumber: 2,
        department: 'Revenue & Taxes',
        officerName: 'Sri D. Appa Rao',
        designation: 'Revenue Inspector (RI Ward 18)',
        actionTaken: 'Field Verification & Tax Dues Check',
        date: '2026-07-18',
        time: '04:00 PM',
        status: 'completed',
        remarks: 'No arrears found. Previous tax assessment up to date (Assessment No: 1086024922). Ownership transfer recommended.',
        outwardNo: 'REV/W18/MUT/401'
      },
      {
        id: 'm12',
        stepNumber: 3,
        department: 'Revenue & Taxes',
        officerName: 'Sri P. Kumar Varma',
        designation: 'Revenue Officer (RO - Zone 2)',
        actionTaken: 'Mutation Sanctioned & New Assessment Register Updated',
        date: '2026-07-22',
        time: '01:15 PM',
        status: 'completed',
        remarks: 'Approved. Title mutated in the name of Smt. Ch. Lakshmi Sarada with effect from Q2 2026-27.',
        outwardNo: 'GVMC/REV/MUT-ORD/2026/991'
      }
    ],
    noteSheet: [
      {
        id: 'n10',
        pageNumber: 1,
        officerName: 'Sri D. Appa Rao (RI)',
        designation: 'Revenue Inspector',
        department: 'Revenue & Taxes',
        timestamp: '2026-07-18 16:10',
        noteText: 'Applicant has produced registered Settlement Deed Doc No. 1920/2026 executed at Sub-Registrar Office Maharanipeta. Property Tax arrears of Rs. 0. Verified physical possession.',
        signatureCode: 'SIG/GVMC/RI18/1042'
      },
      {
        id: 'n11',
        pageNumber: 2,
        officerName: 'Sri P. Kumar Varma (RO)',
        designation: 'Revenue Officer',
        department: 'Revenue & Taxes',
        timestamp: '2026-07-22 13:10',
        noteText: 'Orders passed. New Assessment Book entry created. Mutation Certificate generated and ready for applicant download.',
        signatureCode: 'SIG/GVMC/RO2/8821'
      }
    ],
    enclosures: [
      { id: 'e10', name: 'Registered Gift Settlement Deed.pdf', size: '1.8 MB', type: 'Title Deed', uploadedBy: 'Applicant', uploadedAt: '2026-07-15' },
      { id: 'e11', name: 'Encumbrance Certificate (EC) 30 Years.pdf', size: '950 KB', type: 'Legal Record', uploadedBy: 'Applicant', uploadedAt: '2026-07-15' },
      { id: 'e12', name: 'Mutation Approval Proceedings Certificate.pdf', size: '420 KB', type: 'Official Order', uploadedBy: 'RO Kumar Varma', uploadedAt: '2026-07-22' }
    ]
  },
  {
    id: 'GVMC/WS/2026/04118',
    subject: 'New Commercial Drinking Water Supply Pipe Connection Request',
    applicantName: 'Grand Coastal Hotel & Resorts (Director G. Suresh)',
    applicantPhone: '9866112233',
    applicantAddress: 'Plot 10, Siripuram Junction, Ward 19, Zone 2',
    wardNo: 'Ward 19 (Siripuram)',
    zone: 'Zone 2 - Visakhapatnam South',
    department: 'Water Supply & Sewerage',
    category: 'Commercial Water Connection',
    priority: 'Tatkal',
    currentStatus: 'Inspection Pending',
    currentCustodian: 'Sri M. Somasekhar',
    currentCustodianDesignation: 'Assistant Executive Engineer (AEE Water)',
    submissionDate: '2026-07-28',
    slaDays: 7,
    slaDueDate: '2026-08-04',
    daysRemaining: 4,
    movementHistory: [
      {
        id: 'm20',
        stepNumber: 1,
        department: 'Water Supply & Sewerage',
        officerName: 'Water Works Inward Portal',
        designation: 'Assistant Engineer (Inward)',
        actionTaken: 'Application Accepted under Tatkal Category',
        date: '2026-07-28',
        time: '09:45 AM',
        status: 'completed',
        remarks: 'Fee paid online: Rs. 18,500 Tatkal Water Works Fee.',
        outwardNo: 'WS/TAT/2026/411'
      },
      {
        id: 'm21',
        stepNumber: 2,
        department: 'Water Supply & Sewerage',
        officerName: 'Sri M. Somasekhar',
        designation: 'Assistant Executive Engineer (AEE Water)',
        actionTaken: 'Pipeline Feasibility & Flow Pressure Field Inspection',
        date: '2026-07-30',
        time: '11:00 AM',
        status: 'current',
        remarks: 'Scheduled pipeline tapping feasibility check at Siripuram 250mm DI main line.',
      },
      {
        id: 'm22',
        stepNumber: 3,
        department: 'Water Supply & Sewerage',
        officerName: 'Sri K. Srinivas',
        designation: 'Executive Engineer (EE Water Supply)',
        actionTaken: 'Road Cutting Approval & Meter Connection Sanction',
        date: 'Pending',
        time: '-',
        status: 'pending',
        remarks: 'Awaiting AEE inspection report.'
      }
    ],
    noteSheet: [
      {
        id: 'n20',
        pageNumber: 1,
        officerName: 'Water Works Inward Desk',
        designation: 'Assistant Engineer',
        department: 'Water Supply & Sewerage',
        timestamp: '2026-07-28 09:50',
        noteText: 'Application processed under Tatkal scheme for 2-inch commercial water line tapping. Submitted trade license and property tax receipt.',
        signatureCode: 'SIG/GVMC/WS/301'
      }
    ],
    enclosures: [
      { id: 'e20', name: 'GVMC Trade License Copy.pdf', size: '1.2 MB', type: 'License Document', uploadedBy: 'Applicant', uploadedAt: '2026-07-28' },
      { id: 'e21', name: 'Plumbing Plumbing Layout Blueprint.pdf', size: '3.4 MB', type: 'Engineering Drawing', uploadedBy: 'Licensed Plumber', uploadedAt: '2026-07-28' }
    ]
  },
  {
    id: 'GVMC/ENG/2026/09120',
    subject: 'Public Grievance: Storm Water Drain Overflow & Road Repair at Gajuwaka',
    applicantName: 'Ward 38 Citizens Welfare Association (President B. Raju)',
    applicantPhone: '9701234567',
    applicantAddress: 'Main Road, High School Zone, Ward 38, Gajuwaka',
    wardNo: 'Ward 38 (Gajuwaka Industrial Belt)',
    zone: 'Zone 5 - Gajuwaka',
    department: 'Engineering & Works',
    category: 'Drainage & Road Infrastructure',
    priority: 'Grievance',
    currentStatus: 'In Review',
    currentCustodian: 'Sri T. Jagadeesh',
    currentCustodianDesignation: 'Deputy Executive Engineer (DEE Engineering)',
    submissionDate: '2026-07-29',
    slaDays: 5,
    slaDueDate: '2026-08-03',
    daysRemaining: 3,
    movementHistory: [
      {
        id: 'm30',
        stepNumber: 1,
        department: 'General Administration',
        officerName: 'Spandana Public Grievance Desk',
        designation: 'Grievance Officer',
        actionTaken: 'Grievance Registered & Tagged Urgent',
        date: '2026-07-29',
        time: '10:00 AM',
        status: 'completed',
        remarks: 'Monsoon drainage obstruction complaint forwarded directly to DEE Works.',
        outwardNo: 'SPANDANA/GVMC/88219'
      },
      {
        id: 'm31',
        stepNumber: 2,
        department: 'Engineering & Works',
        officerName: 'Sri T. Jagadeesh',
        designation: 'Deputy Executive Engineer (DEE Engineering)',
        actionTaken: 'Emergency Work Order Estimate Preparation',
        date: '2026-07-30',
        time: '03:00 PM',
        status: 'current',
        remarks: 'Inspected drain bottleneck. Desiltation JCB deployed and emergency slab culvert repair estimated at Rs. 1.2 Lakhs.',
      },
      {
        id: 'm32',
        stepNumber: 3,
        department: 'Public Health & Sanitation',
        officerName: 'Dr. A. Murali Krishna',
        designation: 'Chief Medical Officer of Health (CMOH)',
        actionTaken: 'Sanitation Anti-Larval Spray & Cleaning Verification',
        date: 'Pending',
        time: '-',
        status: 'pending',
        remarks: 'Joint sanitation drive after engineering repair.'
      }
    ],
    noteSheet: [
      {
        id: 'n30',
        pageNumber: 1,
        officerName: 'Sri T. Jagadeesh (DEE)',
        designation: 'Deputy Executive Engineer',
        department: 'Engineering & Works',
        timestamp: '2026-07-30 15:30',
        noteText: 'Inspected Ward 38 storm water drain with Ward Engineer. Heavy silt accumulation due to nearby factory runoff. Deployed 1 JCB and 8 workers. Work in progress, completion expected in 48 hours.',
        signatureCode: 'SIG/GVMC/ENG5/1092'
      }
    ],
    enclosures: [
      { id: 'e30', name: 'Drainage Overflow Site Photos.pdf', size: '4.2 MB', type: 'Grievance Evidence', uploadedBy: 'Association President', uploadedAt: '2026-07-29' },
      { id: 'e31', name: 'Emergency Repair Cost Estimate.pdf', size: '510 KB', type: 'Engineering Estimate', uploadedBy: 'DEE Jagadeesh', uploadedAt: '2026-07-30' }
    ]
  },
  {
    id: 'GVMC/PH/2026/03391',
    subject: 'Application for GVMC Trade License Renewal for Food Establishment',
    applicantName: 'Sri Annapurna Foods & Tiffins (Prop. K. Subrahmanyam)',
    applicantPhone: '9440987123',
    applicantAddress: 'Door No 4-1-20, Railway Station Road, Ward 12, Zone 1',
    wardNo: 'Ward 12 (Dwaraka Nagar)',
    zone: 'Zone 1 - Visakhapatnam Central',
    department: 'Public Health & Sanitation',
    category: 'Trade License Renewal',
    priority: 'Normal',
    currentStatus: 'Clarification Required',
    currentCustodian: 'Dr. C. V. Raman',
    currentCustodianDesignation: 'Sanitary Inspector (SI - Ward 12)',
    submissionDate: '2026-07-20',
    slaDays: 10,
    slaDueDate: '2026-07-30',
    daysRemaining: -1,
    movementHistory: [
      {
        id: 'm40',
        stepNumber: 1,
        department: 'Public Health & Sanitation',
        officerName: 'GVMC Citizen Portal',
        designation: 'System Auto-Inward',
        actionTaken: 'Renewal Application Received',
        date: '2026-07-20',
        time: '11:15 AM',
        status: 'completed',
        remarks: 'Trade License Renewal Fee Rs. 3,500 Paid.',
        outwardNo: 'TL/REN/2026/339'
      },
      {
        id: 'm41',
        stepNumber: 2,
        department: 'Public Health & Sanitation',
        officerName: 'Dr. C. V. Raman',
        designation: 'Sanitary Inspector (SI - Ward 12)',
        actionTaken: 'Food Safety & Hygiene Inspection Notice Issued',
        date: '2026-07-25',
        time: '05:20 PM',
        status: 'current',
        remarks: 'FSSAI License Renewal Copy missing in application. Notice raised to applicant.',
      }
    ],
    noteSheet: [
      {
        id: 'n40',
        pageNumber: 1,
        officerName: 'Dr. C. V. Raman (SI)',
        designation: 'Sanitary Inspector',
        department: 'Public Health & Sanitation',
        timestamp: '2026-07-25 17:25',
        noteText: 'Inspected restaurant premise on 24-07-2026. Kitchen hygiene satisfactory. Grease trap installed. However, valid FSSAI Food License certificate uploaded was expired on 30-06-2026. Raised query to applicant to upload renewed FSSAI certificate.',
        signatureCode: 'SIG/GVMC/SI12/8821'
      }
    ],
    enclosures: [
      { id: 'e40', name: 'Previous Trade License Certificate 2025-26.pdf', size: '610 KB', type: 'Old License', uploadedBy: 'Applicant', uploadedAt: '2026-07-20' },
      { id: 'e41', name: 'Notice_Query_Upload_FSSAI.pdf', size: '280 KB', type: 'Department Notice', uploadedBy: 'SI Raman', uploadedAt: '2026-07-25' }
    ]
  }
];

export const PRESET_OFFICERS = [
  {
    id: 'GVMC-TP-101',
    name: 'Smt. K. Devi Prasad',
    employeeId: 'GVMC/EMP/1042',
    department: 'Town Planning' as const,
    designation: 'Assistant City Planner (ACP)',
    phone: '9848099887',
    zone: 'Zone 3 - Visakhapatnam North'
  },
  {
    id: 'GVMC-TP-102',
    name: 'Sri V. Nageswara Rao',
    employeeId: 'GVMC/EMP/1043',
    department: 'Town Planning' as const,
    designation: 'Chief City Planner (CCP)',
    phone: '9848099888',
    zone: 'Head Office - GVMC'
  },
  {
    id: 'GVMC-REV-201',
    name: 'Sri P. Kumar Varma',
    employeeId: 'GVMC/EMP/2091',
    department: 'Revenue & Taxes' as const,
    designation: 'Revenue Officer (RO)',
    phone: '9440122334',
    zone: 'Zone 2 - Visakhapatnam South'
  },
  {
    id: 'GVMC-REV-202',
    name: 'Sri D. Appa Rao',
    employeeId: 'GVMC/EMP/2092',
    department: 'Revenue & Taxes' as const,
    designation: 'Revenue Inspector (RI)',
    phone: '9440122335',
    zone: 'Ward 18 (Maharanipeta)'
  },
  {
    id: 'GVMC-ENG-301',
    name: 'Sri T. Jagadeesh',
    employeeId: 'GVMC/EMP/3058',
    department: 'Engineering & Works' as const,
    designation: 'Deputy Executive Engineer (DEE)',
    phone: '9701299112',
    zone: 'Zone 5 - Gajuwaka'
  },
  {
    id: 'GVMC-ENG-302',
    name: 'Sri K. Ramesh',
    employeeId: 'GVMC/EMP/3059',
    department: 'Engineering & Works' as const,
    designation: 'Superintending Engineer (SE)',
    phone: '9701299113',
    zone: 'Head Office - GVMC'
  },
  {
    id: 'GVMC-PH-401',
    name: 'Dr. A. Murali Krishna',
    employeeId: 'GVMC/EMP/4011',
    department: 'Public Health & Sanitation' as const,
    designation: 'Chief Medical Officer of Health (CMOH)',
    phone: '9989011223',
    zone: 'Head Office - GVMC'
  },
  {
    id: 'GVMC-PH-402',
    name: 'Dr. C. V. Raman',
    employeeId: 'GVMC/EMP/4012',
    department: 'Public Health & Sanitation' as const,
    designation: 'Sanitary Inspector (SI)',
    phone: '9989011224',
    zone: 'Ward 12 (Dwaraka Nagar)'
  },
  {
    id: 'GVMC-WS-501',
    name: 'Sri M. Somasekhar',
    employeeId: 'GVMC/EMP/5018',
    department: 'Water Supply & Sewerage' as const,
    designation: 'Assistant Executive Engineer (AEE Water)',
    phone: '9866112233',
    zone: 'Zone 2 - Visakhapatnam South'
  },
  {
    id: 'GVMC-UF-601',
    name: 'Sri G. Venkatesh',
    employeeId: 'GVMC/EMP/6011',
    department: 'Urban Forestry' as const,
    designation: 'Director of Urban Forestry',
    phone: '9849011223',
    zone: 'Head Office - GVMC'
  },
  {
    id: 'GVMC-ADM-701',
    name: 'Sri R. Ramakrishna',
    employeeId: 'GVMC/EMP/7011',
    department: 'General Administration' as const,
    designation: 'Zonal Commissioner (ZC Zone 3)',
    phone: '9848055443',
    zone: 'Zone 3 - Visakhapatnam North'
  }
];

export const DEMO_USERS = {
  citizen: {
    id: 'USR-CIT-01',
    name: 'Sri M. Venkata Ramana Rao',
    phone: '9848012345',
    role: 'citizen' as const,
    zone: 'Zone 3 - Visakhapatnam North'
  },
  commissioner: {
    id: 'GVMC-COMM-001',
    name: 'Sri P. Sampath Kumar, IAS',
    phone: '0891-2754321',
    role: 'commissioner' as const,
    employeeId: 'GVMC/COMM/2026',
    department: 'General Administration' as const,
    designation: 'Municipal Commissioner & Head of Office',
    zone: 'GVMC Head Office, Visakhapatnam'
  },
  townPlanningOfficer: PRESET_OFFICERS[0],
  revenueOfficer: PRESET_OFFICERS[2],
  engineeringOfficer: PRESET_OFFICERS[4]
};
