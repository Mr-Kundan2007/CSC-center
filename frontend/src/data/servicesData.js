// Centralized data repository for CSC Digital Service Center
export const serviceCategories = [
  "All Services",
  "Land & Revenue Services (जमीन संबंधी सेवाएं)",
  "Government Documents",
  "Identity & PAN",
  "Education",
  "Jobs & Exams",
  "Financial & Utility Assistance",
  "Travel & Passport Assistance",
  "Digital & Documentation Services",
  "Other Online Services"
];

export const servicesData = [
  // --- IDENTITY & PAN ---
  {
    id: "pan-card-application",
    slug: "pan-card-application",
    title: "PAN Card Application",
    shortDescription: "Assistance for new Permanent Account Number (Form 49A) online applications.",
    description: "New PAN Card application assistance for individuals, firms, and minors. Includes document verification, digital photo/signature formatting, and physical card delivery guidance.",
    category: "Identity & PAN",
    iconName: "CreditCard",
    featured: true,
    available: true,
    estimatedTime: "7 - 15 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Card (Proof of Identity & Address)",
      "Proof of Date of Birth (Birth Cert / Class 10 Marksheet)",
      "Two recent passport size color photographs"
    ],
    process: [
      { step: 1, title: "Select Service", description: "Choose PAN Card Application and review mandatory documents." },
      { step: 2, title: "Submit Information", description: "Provide applicant personal details and Aadhaar number." },
      { step: 3, title: "Attach Documents", description: "Provide clean scanned copies of identity and address proofs." },
      { step: 4, title: "Center Review", description: "Operator verifies document compliance with Income Tax rules." },
      { step: 5, title: "Portal Dispatch", description: "Application submitted to NSDL/UTIITSL e-governance portal." },
      { step: 6, title: "Receive e-PAN", description: "Digital PAN delivered to email; physical card dispatched by post." }
    ],
    notes: "Ensure the applicant's name and Date of Birth match exactly with Aadhaar details.",
    faq: [
      { question: "How long does a new PAN card take?", answer: "e-PAN is usually generated within 3 to 5 working days, while the physical card reaches your address in 7 to 15 business days." },
      { question: "Can I apply if my Aadhaar mobile is not linked?", answer: "Yes, our center can assist with offline physical document submission mode." }
    ]
  },
  {
    id: "pan-card-correction",
    slug: "pan-card-correction",
    title: "PAN Card Correction",
    shortDescription: "Correction of name, DOB, father's name, or photo in existing PAN card.",
    description: "Assistance with updating or correcting existing PAN card details on official NSDL/UTIITSL records. Ensures corrected details match your updated identity documents.",
    category: "Identity & PAN",
    iconName: "CreditCard",
    featured: false,
    available: true,
    estimatedTime: "10 - 20 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Existing PAN Card Copy / PAN Allotment Letter",
      "Aadhaar Card with updated details",
      "Gazette Notification or Affidavit (for major name change)"
    ],
    process: [
      { step: 1, title: "Identify Correction", description: "Specify fields requiring update (Name, DOB, Photo, Signature)." },
      { step: 2, title: "Provide Supporting Proof", description: "Supply valid identity proof confirming the corrected details." },
      { step: 3, title: "Form Verification", description: "Review correction request form for accuracy." },
      { step: 4, title: "Portal Submission", description: "Correction petition filed on official PAN portal." }
    ],
    notes: "Supporting document must accurately reflect the corrected name or date of birth.",
    faq: [
      { question: "Will my PAN number change after correction?", answer: "No, your 10-digit PAN number remains the same; only the printed details on the card are updated." }
    ]
  },
  {
    id: "pan-card-download",
    slug: "pan-card-download-assistance",
    title: "PAN Card Download Assistance",
    shortDescription: "Instant e-PAN PDF download and re-printing service.",
    description: "Get assistance downloading e-PAN PDF copies from NSDL/UTIITSL portals or re-printing PVC plastic cards.",
    category: "Identity & PAN",
    iconName: "CreditCard",
    featured: false,
    available: true,
    estimatedTime: "Same Day / Instant",
    serviceFee: "Service fee: Contact center",
    documents: [
      "PAN Number or Application Acknowledgement Number",
      "Aadhaar Number",
      "Linked Mobile Phone for OTP validation"
    ],
    process: [
      { step: 1, title: "Provide PAN / Ack No", description: "Operator looks up e-PAN records." },
      { step: 2, title: "Authenticate OTP", description: "Validate via mobile OTP received from portal." },
      { step: 3, title: "Download PDF", description: "Print high-resolution color copy or PVC card." }
    ],
    notes: "Requires mobile number linked to Aadhaar/PAN portal for OTP validation.",
    faq: [
      { question: "Is e-PAN legally valid?", answer: "Yes, e-PAN is digitally signed and holds equal legal validity as a physical PAN card." }
    ]
  },
  {
    id: "aadhaar-document-assistance",
    slug: "aadhaar-document-assistance",
    title: "Aadhaar Document Assistance",
    shortDescription: "Guidance for demographic details update, e-Aadhaar download, and UIDAI slot booking.",
    description: "Comprehensive guidance for Aadhaar document updates (Proof of Identity/Address), e-Aadhaar PDF downloads, PVC Aadhaar order assistance, and UIDAI appointment booking.",
    category: "Identity & PAN",
    iconName: "Fingerprint",
    featured: true,
    available: true,
    estimatedTime: "3 - 7 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Number / Enrolment Slip",
      "Valid Proof of Address (Electricity bill, Ration card, Passport)",
      "Mobile phone linked with Aadhaar"
    ],
    process: [
      { step: 1, title: "Review Document List", description: "Check UIDAI approved document list for valid POI/POA." },
      { step: 2, title: "Form Preparation", description: "Prepare update request details accurately." },
      { step: 3, title: "Portal Guidance", description: "Assist with myAadhaar portal filing or appointment booking." }
    ],
    notes: "Actual biometric updates (fingerprint/iris) must be completed at an official UIDAI enrolment center.",
    faq: [
      { question: "Can address be updated online?", answer: "Yes, online address update is supported if you have a valid proof of address in your name." }
    ]
  },

  // --- GOVERNMENT DOCUMENTS ---
  {
    id: "income-certificate",
    slug: "income-certificate",
    title: "Income Certificate Assistance",
    shortDescription: "Filing support for state government family annual income certificates.",
    description: "End-to-end guidance for obtaining state e-District Income Certificates required for educational scholarships, Fee Waiver schemes, and government welfare benefits.",
    category: "Government Documents",
    iconName: "FileCheck",
    featured: true,
    available: true,
    estimatedTime: "10 - 21 Business Days",
    serviceFee: "Fee varies by service",
    documents: [
      "Aadhaar Card of Applicant / Parent",
      "Ration Card / Voter ID",
      "Salary Slip / Form 16 / Income Affidavit",
      "Land Revenue Receipt / Patta (if applicable)"
    ],
    process: [
      { step: 1, title: "Prepare Income Proof", description: "Gather salary slips, IT returns, or self-declaration affidavits." },
      { step: 2, title: "Form Submission", description: "Fill e-District portal application form with accuracy." },
      { step: 3, title: "Verification by Authorities", description: "Local Revenue Inspector / Tehsildar verifies details." },
      { step: 4, title: "Certificate Download", description: "Download digitally signed certificate upon approval." }
    ],
    notes: "Income certificates are generally valid for one financial year.",
    faq: [
      { question: "Whose income should be declared for students?", answer: "For student applicants, the total combined annual income of parents must be declared." }
    ]
  },
  {
    id: "residence-certificate",
    slug: "residence-certificate",
    title: "Residence & Domicile Certificate",
    shortDescription: "Assistance for official residence and state domicile proof certificates.",
    description: "Documentation support for applying for State Domicile and Native Residence Certificates essential for state quota college admissions, government jobs, and housing schemes.",
    category: "Government Documents",
    iconName: "FileCheck",
    featured: false,
    available: true,
    estimatedTime: "10 - 15 Business Days",
    serviceFee: "Fee varies by service",
    documents: [
      "Applicant Aadhaar Card",
      "Continuous Residence Proof (Electricity bills / School Leaving Cert)",
      "Parent's Residence Proof or Land Document"
    ],
    process: [
      { step: 1, title: "Check Eligibility", description: "Verify minimum required years of residence in state." },
      { step: 2, title: "Upload Proofs", description: "Provide address documents and school records." },
      { step: 3, title: "E-District Application", description: "Submit application to state revenue authority." }
    ],
    notes: "Requirements vary according to state government e-District guidelines.",
    faq: [
      { question: "What is the difference between Domicile and Residence?", answer: "Domicile indicates permanent home state status, while Residence confirms current living address." }
    ]
  },
  {
    id: "caste-certificate",
    slug: "caste-certificate",
    title: "Caste Certificate Assistance",
    shortDescription: "Filing support for SC / ST / OBC / EWS reservation certificates.",
    description: "Guidance for submitting online applications for Caste and Category Certificates (SC, ST, OBC, EWS) needed for reservation benefits in education and public recruitment.",
    category: "Government Documents",
    iconName: "FileCheck",
    featured: false,
    available: true,
    estimatedTime: "15 - 30 Business Days",
    serviceFee: "Fee varies by service",
    documents: [
      "Applicant Aadhaar Card",
      "Blood Relative's Caste Certificate (Father / Paternal Uncle)",
      "School Leaving Certificate showing caste entry",
      "Affidavit on Stamp Paper"
    ],
    process: [
      { step: 1, title: "Gather Family Proof", description: "Locate existing paternal family caste records." },
      { step: 2, title: "File e-District Form", description: "Fill state category certificate application." },
      { step: 3, title: "Inquiry & Approval", description: "Revenue department verifies ancestral records." }
    ],
    notes: "OBC Non-Creamy Layer (NCL) certificates require current year income proof.",
    faq: [
      { question: "How long is an OBC NCL certificate valid?", answer: "OBC Non-Creamy Layer certificates are valid for one financial year." }
    ]
  },
  {
    id: "birth-death-certificate",
    slug: "birth-death-certificate",
    title: "Birth & Death Certificate Services",
    shortDescription: "Application and duplicate download support for Civil Registration System (CRS).",
    description: "Assistance with online registration guidance, status check, and digital copy downloads for Birth and Death certificates through municipal or CRS portals.",
    category: "Government Documents",
    iconName: "FileCheck",
    featured: false,
    available: true,
    estimatedTime: "7 - 15 Business Days",
    serviceFee: "Fee varies by service",
    documents: [
      "Hospital Discharge Slip / Institutional Slip",
      "Parents' / Informant Aadhaar Cards",
      "Registration Number (for existing record search)"
    ],
    process: [
      { step: 1, title: "Search CRS Database", description: "Check availability of record on municipal portal." },
      { step: 2, title: "File Application", description: "Submit application for new entry or digital copy." },
      { step: 3, title: "Download Certificate", description: "Retrieve QR-verified digital certificate." }
    ],
    notes: "Late registration beyond 21 days requires permission from designated authorities.",
    faq: [
      { question: "Can a birth certificate name be corrected?", answer: "Yes, correction can be initiated with hospital record verification." }
    ]
  },

  // --- EDUCATION ---
  {
    id: "scholarship-application",
    slug: "scholarship-application",
    title: "Scholarship Application Assistance",
    shortDescription: "Online form filling for National Scholarship Portal (NSP) and State schemes.",
    description: "Complete assistance for pre-matric, post-matric, higher education, and merit-cum-means scholarship submissions on NSP, State E-Kalyan, and Mahadbt portals.",
    category: "Education",
    iconName: "GraduationCap",
    featured: true,
    available: true,
    estimatedTime: "Varies by Scheme Deadline",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Student Aadhaar Card (Linked with Mobile)",
      "Valid Income Certificate",
      "Caste / Category Certificate (if applicable)",
      "Previous Academic Marksheet & Institute Fee Receipt",
      "Bank Passbook with Aadhaar Seeding"
    ],
    process: [
      { step: 1, title: "Check Portal Deadlines", description: "Verify scheme opening dates and eligibility cutoff." },
      { step: 2, title: "Register Student Profile", description: "Create OTR (One Time Registration) profile." },
      { step: 3, title: "Upload Marksheets & Fees", description: "Format and attach clear academic scans." },
      { step: 4, title: "Institute Verification", description: "Submit acknowledgement copy to school/college nodal officer." }
    ],
    notes: "Student bank account must be seeded with Aadhaar for Direct Benefit Transfer (DBT).",
    faq: [
      { question: "Can a student apply for multiple scholarships?", answer: "Usually, students can receive only one government scholarship per academic year." }
    ]
  },
  {
    id: "college-admission-forms",
    slug: "college-admission-forms",
    title: "College & University Admission Forms",
    shortDescription: "Online registration for BA, BSc, BCom, BTech, and PG admissions.",
    description: "Guidance and online form filing for central universities (CUET), state college portals, degree admissions, subject choice filling, and counselling registration.",
    category: "Education",
    iconName: "BookOpen",
    featured: false,
    available: true,
    estimatedTime: "Immediate Online Submission",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Class 10th and 12th Marksheets",
      "Transfer / Migration Certificate",
      "Scanned Photo & Signature",
      "Category Certificate (for quota reservation)"
    ],
    process: [
      { step: 1, title: "Select Target College", description: "Review eligibility criteria and cutoff subjects." },
      { step: 2, title: "Fill Registration Form", description: "Enter personal, academic, and subject preferences." },
      { step: 3, title: "Fee Payment & Submit", description: "Complete application fee payment and print receipt." }
    ],
    notes: "Double check subject combination preferences prior to final lock.",
    faq: [
      { question: "Can form errors be corrected after submission?", answer: "Correction windows depend on individual university portal policies." }
    ]
  },

  // --- JOBS & EXAMS ---
  {
    id: "govt-job-application",
    slug: "govt-job-application",
    title: "Government Job Application Assistance",
    shortDescription: "Online recruitment application filing for SSC, UPSC, Railways, Banking, & Defense.",
    description: "Error-free online application assistance for Staff Selection Commission (SSC), UPSC, IBPS Banking, RRB Railway, Police, and State Public Service Commission vacancies.",
    category: "Jobs & Exams",
    iconName: "Briefcase",
    featured: true,
    available: true,
    estimatedTime: "Immediate Online Submission",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Educational Certificates & Marksheets (10th/12th/Degree)",
      "Photo (specific dimensions/background)",
      "Signature Scan (black/blue ink as required)",
      "Category / Ex-Serviceman Certificate (if applicable)"
    ],
    process: [
      { step: 1, title: "Verify Notification", description: "Check eligibility age limit and educational requirement." },
      { step: 2, title: "Format Photo & Signature", description: "Resize images to exact KB and pixel specifications." },
      { step: 3, title: "Submit Form", description: "Complete form inputs and download exam confirmation PDF." }
    ],
    notes: "Photographs must be recent with clear face visibility and light background.",
    faq: [
      { question: "What if the portal server is slow on deadline day?", answer: "We advise filing applications at least 3-5 days before closing dates." }
    ]
  },
  {
    id: "admit-card-result-assistance",
    slug: "admit-card-result-assistance",
    title: "Admit Card & Result Download",
    shortDescription: "Fast retrieval and printing of exam hall tickets and official marksheets.",
    description: "Download and high-quality printout service for recruitment exam admit cards, hall tickets, roll number lookup, and scorecards.",
    category: "Jobs & Exams",
    iconName: "Briefcase",
    featured: false,
    available: true,
    estimatedTime: "Instant On-Spot",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Registration Number / Application ID",
      "Date of Birth / Password"
    ],
    process: [
      { step: 1, title: "Provide Credentials", description: "Enter Roll Number or Registration ID." },
      { step: 2, title: "Download File", description: "Retrieve PDF admit card or scorecard." },
      { step: 3, title: "Print Copy", description: "Get clear color or B&W printout." }
    ],
    notes: "Check exam center address and instructions printed on the admit card.",
    faq: [
      { question: "What if I forgot my registration number?", answer: "We can assist with portal 'Forgot Registration ID' recovery options." }
    ]
  },

  // --- FINANCIAL & UTILITY ASSISTANCE ---
  {
    id: "electricity-bill-assistance",
    slug: "electricity-bill-assistance",
    title: "Electricity Bill Payment Assistance",
    shortDescription: "Instant bill lookup and payment submission for state electricity boards.",
    description: "Assistance with fetching monthly electricity bills, reviewing consumer account details, and completing online payment submissions with instant digital receipts.",
    category: "Financial & Utility Assistance",
    iconName: "Receipt",
    featured: false,
    available: true,
    estimatedTime: "Instant Real-time Receipt",
    serviceFee: "Fee varies by service",
    documents: [
      "Consumer Account Number (CA / K No / Account ID)",
      "Previous Bill Copy (Optional)"
    ],
    process: [
      { step: 1, title: "Enter Consumer No", description: "Fetch current due amount from board portal." },
      { step: 2, title: "Verify Bill Details", description: "Confirm consumer name and billing period." },
      { step: 3, title: "Process Payment", description: "Receive instant printed payment confirmation." }
    ],
    notes: "Always pay before due date to avoid disconnection penalty charges.",
    faq: [
      { question: "How long does payment take to update with the board?", answer: "Payments reflect on official board records within 24 to 48 hours." }
    ]
  },
  {
    id: "banking-service-assistance",
    slug: "banking-service-assistance",
    title: "Banking Service Assistance",
    shortDescription: "Guidance for online account opening forms, PMJDY, and DBT status check.",
    description: "Guidance for filling online bank account opening forms, checking Direct Benefit Transfer (DBT) linking status, and pension scheme applications.",
    category: "Financial & Utility Assistance",
    iconName: "Receipt",
    featured: false,
    available: true,
    estimatedTime: "Same Day",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Passport Photograph",
      "Mobile Number linked to Aadhaar"
    ],
    process: [
      { step: 1, title: "Form Filing Guidance", description: "Assist with digital bank account application forms." },
      { step: 2, title: "DBT Status Check", description: "Verify if Aadhaar is linked with bank for subsidies." }
    ],
    notes: "DISCLAIMER: This center is a digital service assistance provider and is NOT a bank or financial institution. Financial transactions are conducted through official banking portals.",
    faq: [
      { question: "Is this center an official bank branch?", answer: "No, we provide digital form guidance and public portal assistance only." }
    ]
  },

  // --- TRAVEL & PASSPORT ASSISTANCE ---
  {
    id: "passport-application-assistance",
    slug: "passport-application-assistance",
    title: "Passport Application Assistance",
    shortDescription: "Form filling, fee payment, and slot booking for Fresh & Re-issue Passports.",
    description: "Complete guidance for Passport Seva portal account creation, online application (Form 1), document advisor review, fee payment, and Passport Seva Kendra (PSK) appointment booking.",
    category: "Travel & Passport Assistance",
    iconName: "Globe",
    featured: true,
    available: true,
    estimatedTime: "Appointment as per PSK availability",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Card / Voter ID (Identity & Address Proof)",
      "Class 10th Certificate (ECNR Proof)",
      "Bank Passbook with photo / Utility bill"
    ],
    process: [
      { step: 1, title: "Create Passport Seva Account", description: "Register applicant on official portal." },
      { step: 2, title: "Fill Form 1", description: "Provide applicant details, parents' names, and address." },
      { step: 3, title: "Pay Official Govt Fee", description: "Submit ₹1500 (or applicable) fee on portal." },
      { step: 4, title: "Book PSK Slot", description: "Select convenient date and time at nearest PSK." },
      { step: 5, title: "Visit PSK", description: "Applicant visits PSK with original documents for biometrics." }
    ],
    notes: "Applicant must physically attend the Passport Seva Kendra appointment with original documents.",
    faq: [
      { question: "What is ECNR status?", answer: "Emigration Check Not Required (ECNR) is granted to applicants who have passed Class 10th or higher." }
    ]
  },
  {
    id: "travel-ticket-assistance",
    slug: "travel-ticket-assistance",
    title: "Travel Ticket Assistance",
    shortDescription: "Online IRCTC Train, Bus, and Flight ticket booking assistance.",
    description: "Assistance with searching train availability, booking IRCTC e-tickets, state transport bus reservations, and checking PNR status.",
    category: "Travel & Passport Assistance",
    iconName: "Globe",
    featured: false,
    available: true,
    estimatedTime: "Instant Booking",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Passenger Names, Ages, and Gender",
      "Valid Identity Card details"
    ],
    process: [
      { step: 1, title: "Search Routes", description: "Find available train/bus connections." },
      { step: 2, title: "Book Ticket", description: "Fill passenger details and complete booking." },
      { step: 3, title: "Print Ticket", description: "Receive printed e-ticket with PNR number." }
    ],
    notes: "Carry original photo ID during travel as mandated by railway/bus authorities.",
    faq: [
      { question: "Can I check PNR status here?", answer: "Yes, we provide instant PNR status lookup." }
    ]
  },

  // --- DIGITAL & DOCUMENTATION SERVICES ---
  {
    id: "printing-scanning-services",
    slug: "printing-scanning-services",
    title: "Printing & Scanning Services",
    shortDescription: "High-resolution color/B&W printing, document scanning, and PDF creation.",
    description: "On-spot high quality printing (Color/B&W), multi-page document scanning, image cleaning, and multi-file PDF compilation for online submissions.",
    category: "Digital & Documentation Services",
    iconName: "Printer",
    featured: false,
    available: true,
    estimatedTime: "Instant On-Spot",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Physical Documents or Soft Copy (Email / USB)"
    ],
    process: [
      { step: 1, title: "Provide File", description: "Submit document via email or USB drive." },
      { step: 2, title: "Print / Scan", description: "Operator executes high resolution print or scan." }
    ],
    notes: "Confidential handling for all customer documents.",
    faq: [
      { question: "What formats do you scan to?", answer: "We scan documents into PDF, JPEG, and PNG formats." }
    ]
  },
  {
    id: "photo-signature-resize",
    slug: "photo-signature-resize",
    title: "Photo & Signature Resize Services",
    shortDescription: "Image formatting according to exact exam & portal KB specifications.",
    description: "Crop, compress, and resize photographs and signatures to match mandatory portal requirements (e.g., 20KB-50KB, specific pixel ratios).",
    category: "Digital & Documentation Services",
    iconName: "Image",
    featured: false,
    available: true,
    estimatedTime: "5 - 10 Minutes",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Scanned Photo or Physical Photograph",
      "Signature on white paper with black/blue pen"
    ],
    process: [
      { step: 1, title: "Check Portal Specs", description: "Review required KB size and dimensions." },
      { step: 2, title: "Process Image", description: "Resize, crop, and optimize image clarity." },
      { step: 3, title: "Deliver File", description: "Save processed file for your application." }
    ],
    notes: "Avoid blurred signatures or shadowy background photos.",
    faq: [
      { question: "Why do government portals reject photos?", answer: "Rejections usually occur due to wrong file size (KB), blurred face, or incorrect background color." }
    ]
  },
  {
    id: "document-upload-assistance",
    slug: "document-upload-assistance",
    title: "Document Upload Assistance",
    shortDescription: "Help with uploading multi-page PDFs and compressed files to portals.",
    description: "Technical assistance for applicants facing difficulties uploading heavy documents, merging multiple certificates into a single PDF, or resolving portal upload errors.",
    category: "Digital & Documentation Services",
    iconName: "Laptop",
    featured: false,
    available: true,
    estimatedTime: "Same Day",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Files requiring upload",
      "Portal login credentials / application ID"
    ],
    process: [
      { step: 1, title: "Inspect Files", description: "Check file sizes and formats." },
      { step: 2, title: "Optimize & Merge", description: "Combine pages into compressed single PDF if needed." },
      { step: 3, title: "Upload to Portal", description: "Assist with successful portal attachment." }
    ],
    notes: "Ensure file names do not contain special characters.",
    faq: [
      { question: "What is the maximum file size allowed on most portals?", answer: "Most portals accept files between 100KB and 2MB per document." }
    ]
  },

  // --- OTHER ONLINE SERVICES ---
  {
    id: "voter-id-assistance",
    slug: "voter-id-assistance",
    title: "Voter ID Services",
    shortDescription: "New Voter Registration (Form 6), correction, and e-EPIC download.",
    description: "Assistance with Election Commission of India (ECI) portal applications for new voter registration, address correction (Form 8), and e-EPIC digital card downloads.",
    category: "Other Online Services",
    iconName: "Grid",
    featured: false,
    available: true,
    estimatedTime: "15 - 30 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Card",
      "Age Proof (18+ years)",
      "Current Residence Address Proof",
      "Passport Photograph"
    ],
    process: [
      { step: 1, title: "Form Selection", description: "Choose Form 6 (New) or Form 8 (Correction)." },
      { step: 2, title: "File Application", description: "Submit details on NVSP portal." },
      { step: 3, title: "BLO Verification", description: "Booth Level Officer verifies residence." }
    ],
    notes: "Applicant must be 18 years or older as of the qualifying date.",
    faq: [
      { question: "How can I download digital Voter Card (e-EPIC)?", answer: "e-EPIC can be downloaded using your EPIC Number or Form Reference Number." }
    ]
  },
  {
    id: "jeevan-pramaan-assistance",
    slug: "jeevan-pramaan-assistance",
    title: "Digital Life Certificate (Jeevan Pramaan)",
    shortDescription: "Biometric Digital Life Certificate generation for pensioners.",
    description: "Assistance for government and defense pensioners in generating biometric Digital Life Certificates (Jeevan Pramaan) online without visiting bank branches.",
    category: "Other Online Services",
    iconName: "Grid",
    featured: true,
    available: true,
    estimatedTime: "Instant On-Spot",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Number",
      "Pension Payment Order (PPO) Number",
      "Bank Account details receiving pension",
      "Mobile Number for OTP"
    ],
    process: [
      { step: 1, title: "Enter PPO Details", description: "Input pensioner Aadhaar and PPO number." },
      { step: 2, title: "Biometric Scan", description: "Authenticate pensioner fingerprint or face scan." },
      { step: 3, title: "Generate Certificate", description: "Instant Pramaan ID generated and sent to pension disbursing agency." }
    ],
    notes: "Requires physical presence of the pensioner for biometric authentication.",
    faq: [
      { question: "When should pensioners submit Jeevan Pramaan?", answer: "Pensioners typically need to submit their life certificate annually, usually in November." }
    ]
  },

  // --- LAND & REVENUE SERVICES (जमीन संबंधी सभी सेवाएं) ---
  {
    id: "land-mutation-application",
    slug: "land-mutation-application",
    title: "Land Mutation / Dakhil Kharij (दाखिल-खारिज ऑनलाइन आवेदन)",
    shortDescription: "Online application for land mutation (Dakhil-Kharij) after registry or inheritance.",
    description: "Assistance with filing online Land Mutation (दाखिल-खारिज) applications on state revenue portals (Bihar Bhumi / Bhulekh) following property registry, purchase, gift deed, or inheritance transfer.",
    category: "Land & Revenue Services (जमीन संबंधी सेवाएं)",
    iconName: "Landmark",
    featured: true,
    available: true,
    estimatedTime: "30 - 90 Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Sale Deed / Registry Kewala Copy (रजिस्ट्री केवाला प्रतिलिपि)",
      "Seller's Previous Jamabandi / Khata-Khesra Details",
      "Applicant Aadhaar Card & Mobile Number",
      "Waris Praman Patra / Death Certificate (if applying through inheritance)"
    ],
    process: [
      { step: 1, title: "Document Verification", description: "Verify registry deed details, volume/page number, and seller jamabandi." },
      { step: 2, title: "Online Portal Filing", description: "Submit mutation application on state revenue portal (Bihar Bhumi / State Land Portal)." },
      { step: 3, title: "Upload Scanned Deeds", description: "Upload PDF copies of registered sale deed and affidavits." },
      { step: 4, title: "Receive Case Number", description: "Generate Mutation Case Reference Number for tracking." },
      { step: 5, title: "Revenue Inspection", description: "Karamchari & CI submit field inspection and verification report to Circle Officer (CO)." },
      { step: 6, title: "Shuddhi Patra", description: "Receive final Mutation Order (Shuddhi Patra) and new Jamabandi creation." }
    ],
    notes: "Ensure the scanned PDF copy of the registry deed is clear and legible for CO verification.",
    faq: [
      { question: "How to track Dakhil Kharij application?", answer: "You can track the live status using the Case Number, Year, and District/Anchal on the state land portal or through our center tracking page." },
      { question: "What is Shuddhi Patra?", answer: "Shuddhi Patra is the official correction slip issued by the Circle Officer once land mutation is approved." }
    ]
  },
  {
    id: "land-tax-receipt-online",
    slug: "land-tax-receipt-online",
    title: "Land Tax Receipt / Jamin Rasid (भू-लगान रसीद ऑनलाइन)",
    shortDescription: "Pay annual government land tax (Bhu-Lagan) online and download certified receipt.",
    description: "Assistance with searching online Jamabandi registers, calculating pending land revenue dues, paying government land tax online, and downloading instantaneous certified tax payment receipts.",
    category: "Land & Revenue Services (जमीन संबंधी सेवाएं)",
    iconName: "Receipt",
    featured: true,
    available: true,
    estimatedTime: "Instant / Same Day",
    serviceFee: "Service fee: Contact center",
    documents: [
      "District, Anchal, and Halka / Mauja Name",
      "Khata Number, Khesra (Plot) Number, or Jamabandi Number",
      "Previous Year Land Tax Receipt (if available)",
      "Aadhaar & Mobile Number for payment confirmation"
    ],
    process: [
      { step: 1, title: "Find Jamabandi", description: "Search digital Jamabandi using Khata, Khesra, or Raiyat name." },
      { step: 2, title: "Calculate Dues", description: "View total pending revenue dues and cess on the portal." },
      { step: 3, title: "Online Payment", description: "Process payment via Net Banking, UPI, or Debit Card." },
      { step: 4, title: "Download Rasid", description: "Instantly download and print digitally signed government land tax receipt." }
    ],
    notes: "Keep your previous land receipt handy to verify Bhag Vartman and Pristh Vartman numbers.",
    faq: [
      { question: "Why is online land tax receipt required?", answer: "An up-to-date land tax receipt is mandatory proof of land possession for LPC applications, bank loans, crop damage relief, and registry transactions." }
    ]
  },
  {
    id: "jamabandi-khatiyan-copy",
    slug: "jamabandi-khatiyan-copy",
    title: "Khatiyan & Jamabandi Copy (खतियान / जमाबंदी पंजी प्रतिलिपि)",
    shortDescription: "View, verify, and download certified online copy of Khatiyan and Jamabandi register.",
    description: "Assistance in searching digital Record of Rights (RoR), historic survey Khatiyan (Cadastral Survey CS, Revisional Survey RS), and online Jamabandi panji details directly from state revenue databases.",
    category: "Land & Revenue Services (जमीन संबंधी सेवाएं)",
    iconName: "FileText",
    featured: false,
    available: true,
    estimatedTime: "Instant Download",
    serviceFee: "Service fee: Contact center",
    documents: [
      "District, Anchal, Halka & Mauja / Village Name",
      "Khata Number, Plot (Khesra) Number, or Ancestor Raiyat Name",
      "Applicant Mobile Number"
    ],
    process: [
      { step: 1, title: "Specify Location", description: "Identify District, Block/Anchal, and Revenue Village." },
      { step: 2, title: "Database Query", description: "Query digital land records database for matching Khata/Khesra." },
      { step: 3, title: "Verify RoR Details", description: "Inspect owner names, shared shares, land type, and plot area (Rakba)." },
      { step: 4, title: "Print Certified Copy", description: "Print high-quality Record of Rights (Khatiyan / Jamabandi) copy." }
    ],
    notes: "Useful for checking inherited land shares and verifying ownership before property purchase.",
    faq: [
      { question: "What is the difference between Khatiyan and Jamabandi?", answer: "Khatiyan records historical ancestral survey rights, while Jamabandi records the current active taxpayer and ownership details." }
    ]
  },
  {
    id: "land-possession-certificate-lpc",
    slug: "land-possession-certificate-lpc",
    title: "Land Possession Certificate - LPC (भूमि स्वामित्व प्रमाण पत्र)",
    shortDescription: "Online application for Land Possession Certificate (LPC) for agricultural loans & subsidies.",
    description: "Assistance in applying for government Land Possession Certificates (LPC) issued by the Circle Officer (CO Anchal). Essential for bank agricultural loans (KCC), tractor loans, and government subsidy schemes.",
    category: "Land & Revenue Services (जमीन संबंधी सेवाएं)",
    iconName: "FileCheck",
    featured: true,
    available: true,
    estimatedTime: "15 - 30 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Current Year Up-to-date Paid Land Tax Receipt (अद्यतन भू-लगान रसीद)",
      "Self-Declaration Affidavit Form (स्व-घोषणा पत्र)",
      "Applicant Aadhaar Card and Passport Photo",
      "Jamabandi Details / Registered Sale Deed Copy"
    ],
    process: [
      { step: 1, title: "Verify Up-to-date Tax", description: "Ensure the land tax for the current financial year is fully paid." },
      { step: 2, title: "Draft Self-Declaration", description: "Prepare and scan self-declaration affidavit with plot details." },
      { step: 3, title: "Submit LPC Petition", description: "File application on state revenue department portal." },
      { step: 4, title: "Revenue Verification", description: "Halka Karamchari & CI verify possession and recommend approval." },
      { step: 5, title: "Download Digitally Signed LPC", description: "Download official digitally signed LPC certificate." }
    ],
    notes: "LPC is valid for 1 year from the date of issuance for bank loan and scheme purposes.",
    faq: [
      { question: "Who needs an LPC certificate?", answer: "Farmers and landowners applying for Kisan Credit Card (KCC), agriculture subsidies, diesel subsidy, or bank loans against land." }
    ]
  },
  {
    id: "bhu-naksha-land-map",
    slug: "bhu-naksha-land-map",
    title: "Bhu-Naksha / Plot Map (भू-नक्शा / जमीन का नक्शा डाउनलोड)",
    shortDescription: "Download and print geo-referenced cadastral plot maps with plot boundaries.",
    description: "Get high-resolution village cadastral maps and plot boundary maps (भू-नक्शा) downloaded and printed directly from state digital land record GIS portals.",
    category: "Land & Revenue Services (जमीन संबंधी सेवाएं)",
    iconName: "MapPin",
    featured: false,
    available: true,
    estimatedTime: "Instant / Same Day",
    serviceFee: "Service fee: Contact center",
    documents: [
      "District, Anchal, and Village / Mauja Name",
      "Khesra (Plot) Number",
      "Revenue Sheet Number (चद्दर संख्या if known)"
    ],
    process: [
      { step: 1, title: "Select Village & Sheet", description: "Locate village GIS map sheet on Bhu-Naksha portal." },
      { step: 2, title: "Highlight Plot", description: "Locate and highlight specific Khesra plot on interactive map." },
      { step: 3, title: "Generate Plot Report", description: "Generate plot dimension report with neighboring boundaries (Chouhaddi)." },
      { step: 4, title: "High-Res Print", description: "Print map copy with dimensions and boundary markers." }
    ],
    notes: "Helps verify plot shape, dimensions, road access, and boundary disputes before purchase.",
    faq: [
      { question: "Can I get map with dimensions (furlong/feet)?", answer: "Yes, official Bhu-Naksha prints show scale and adjacent plot boundary markings." }
    ]
  },
  {
    id: "parimarjan-land-rectification",
    slug: "parimarjan-land-rectification",
    title: "Land Record Rectification - Parimarjan (परिमार्जन / जमाबंदी सुधार)",
    shortDescription: "Online correction of spelling, Khata, Khesra, area (Rakba), or lagaan in digital Jamabandi.",
    description: "Assistance with filing online Parimarjan petitions to rectify incorrect entries in digitised Jamabandi registers, including misspelled owner names, missing Khata/Khesra numbers, and incorrect plot area (rakba) entries.",
    category: "Land & Revenue Services (जमीन संबंधी सेवाएं)",
    iconName: "Layers",
    featured: false,
    available: true,
    estimatedTime: "30 - 60 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Certified Copy of Sale Deed / Kewala or Khatiyan",
      "Previous Offline Jamabandi / Rent Receipts (पुराना लगान रसीद)",
      "Applicant Aadhaar Card & Correction Application Form",
      "Self-Declaration Undertaking"
    ],
    process: [
      { step: 1, title: "Identify Discrepancy", description: "Check error type (Name correction, Khata/Khesra missing, Area correction)." },
      { step: 2, title: "Prepare Evidence Docs", description: "Scan registered deed or old offline Jamabandi proof." },
      { step: 3, title: "File Parimarjan Petition", description: "Submit application on state Parimarjan portal." },
      { step: 4, title: "Anchal Verification", description: "Halka Karamchari cross-verifies with physical register II." },
      { step: 5, title: "Update in System", description: "CO approves correction and digital Jamabandi is updated online." }
    ],
    notes: "Attach the clearest possible scan of your original registered deed or old Khatiyan copy.",
    faq: [
      { question: "What errors can be corrected through Parimarjan?", answer: "Raiyat name spelling, father's name, missing Khata/Plot number, incorrect area (Acre/Decimal/Katha/Dhur), and lagan assessment errors." }
    ]
  },
  {
    id: "land-registry-deed-copy",
    slug: "land-registry-deed-copy",
    title: "Registered Deed / Kewala Copy (रजिस्ट्री केवाला नकल खोज)",
    shortDescription: "Online search and certified copy application for registered property sale deeds.",
    description: "Search property registration records from 1990 to present across registration offices (Sub-Registrar). Obtain certified e-copies and inspect property encumbrance history (Non-Encumbrance Certificate).",
    category: "Land & Revenue Services (जमीन संबंधी सेवाएं)",
    iconName: "BookOpen",
    featured: false,
    available: true,
    estimatedTime: "3 - 7 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Registry Office (Registration Circle) Name",
      "Deed Number / Year of Registration OR Buyer / Seller Name",
      "Mauja Name & Khata/Plot Number",
      "Applicant Identity Proof"
    ],
    process: [
      { step: 1, title: "Record Search", description: "Search property registration database by deed number, year, or party names." },
      { step: 2, title: "Verify Index II", description: "Inspect deed summary index, stamp duty details, and property schedule." },
      { step: 3, title: "Apply for Certified Copy", description: "Submit formal petition for certified digital copy from registration office." },
      { step: 4, title: "Receive Copy", description: "Receive certified registered deed (Kewala) copy." }
    ],
    notes: "Knowing the registration year and deed number significantly speeds up the search process.",
    faq: [
      { question: "Can I find old registered deeds before 2000?", answer: "Yes, digitised records from 1990 onwards are searchable online; for older records, manual inspection petitions can be filed." }
    ]
  },
  {
    id: "land-measurement-demarcation",
    slug: "land-measurement-demarcation",
    title: "Land Demarcation & Measurement (सरकारी अमीन द्वारा जमीन मापी)",
    shortDescription: "Online application for government Amin land measurement and boundary settlement.",
    description: "Assistance with filing formal government Amin measurement petitions at the Circle Office (CO Anchal) for peaceful demarcation, boundary disputes, or land partitioning.",
    category: "Land & Revenue Services (जमीन संबंधी सेवाएं)",
    iconName: "Compass",
    featured: false,
    available: true,
    estimatedTime: "15 - 45 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Current Year Paid Land Revenue Receipt (अद्यतन लगान रसीद)",
      "Registry Deed / Khatiyan Proof of Title",
      "Boundary Holders (Chouhaddi) Names and Neighbor Details",
      "Applicant Aadhaar & Mobile Number"
    ],
    process: [
      { step: 1, title: "File Maapi Application", description: "Submit government Amin measurement application on e-maapi portal / Anchal office." },
      { step: 2, title: "Pay Official Government Fee", description: "Deposit designated government Amin measurement fee online." },
      { step: 3, title: "Notice to Neighbors", description: "Circle Office issues official notice to adjacent plot boundary holders." },
      { step: 4, title: "On-Site Measurement", description: "Government Amin visits the plot with official map instruments and demarcates boundaries." },
      { step: 5, title: "Official Maapi Report", description: "Receive signed official field demarcation measurement report." }
    ],
    notes: "Ensure adjacent plot boundary owners (चौहद्दीदार) are informed to be present during on-site measurement.",
    faq: [
      { question: "Is government Amin measurement report legally valid in court?", answer: "Yes, government Amin measurement conducted through the Circle Office holds full evidentiary value in civil revenue courts." }
    ]
  }
];

