import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'localStore.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let storeState = {
  applications: [
    {
      id: '88335700-0000-0000-0000-000000000001',
      application_id: 'CSC-2026-883357',
      user_id: '00000000-0000-0000-0000-000000000001',
      full_name: 'princeydv',
      mobile: '9155098378',
      email: 'princesinghara4@gmail.com',
      date_of_birth: '2000-05-04',
      address: 'Power Ganj New Over Bridge, Sawita Surya Mandir',
      city: 'Ara',
      state: 'Bihar',
      pincode: '802301',
      service_title: 'PAN Card Correction',
      status: 'completed',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  documents: [
    {
      id: '88335700-0000-0000-0000-000000000002',
      application_id: 'CSC-2026-883357',
      document_type: 'identity_proof',
      file_name: 'Friends Forever Pictures.jpeg',
      storage_path: 'applications/CSC-2026-883357/friends_forever.jpeg',
      mime_type: 'image/jpeg',
      file_size: 130355,
      created_at: new Date().toISOString()
    }
  ],
  appointments: [],
  contacts: []
};

// Load saved data from disk if exists
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed) {
      storeState = {
        applications: parsed.applications || storeState.applications,
        documents: parsed.documents || storeState.documents,
        appointments: parsed.appointments || [],
        contacts: parsed.contacts || []
      };
    }
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(storeState, null, 2));
  }
} catch (e) {
  console.warn('[localStore] Disk read notice:', e.message);
}

const persistStore = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(storeState, null, 2));
  } catch (e) {
    console.warn('[localStore] Disk write notice:', e.message);
  }
};

export const fallbackApplications = storeState.applications;
export const fallbackDocuments = storeState.documents;
export const fallbackAppointments = storeState.appointments;
export const fallbackContacts = storeState.contacts;

export const saveFallbackApplication = (appData) => {
  const formattedAppId = (appData.application_id || '').toUpperCase();
  const existingIndex = storeState.applications.findIndex(
    a => a.application_id && a.application_id.toUpperCase() === formattedAppId
  );

  const record = {
    id: appData.id || crypto.randomUUID(),
    application_id: appData.application_id,
    user_id: appData.user_id || null,
    full_name: appData.full_name || appData.fullName || 'princeydv',
    mobile: appData.mobile || appData.phone || '9155098378',
    email: appData.email || 'princesinghara4@gmail.com',
    address: appData.address || 'Power Ganj New Over Bridge, Sawita Surya Mandir',
    city: appData.city || 'Ara',
    state: appData.state || 'Bihar',
    pincode: appData.pincode || appData.pinCode || '802301',
    date_of_birth: appData.date_of_birth || appData.dateOfBirth || appData.dob || null,
    remarks: appData.remarks || null,
    service_id: appData.service_id || appData.serviceId || null,
    service_title: appData.service_title || appData.serviceTitle || 'Digital Service',
    status: appData.status || 'pending',
    payment_status: appData.payment_status || appData.paymentStatus || 'pending',
    created_at: appData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    storeState.applications[existingIndex] = { ...storeState.applications[existingIndex], ...record, updated_at: new Date().toISOString() };
    persistStore();
    return storeState.applications[existingIndex];
  } else {
    storeState.applications.unshift(record);
    persistStore();
    return record;
  }
};

export const getFallbackApplicationById = (appId) => {
  if (!appId) return null;
  const formatted = appId.trim().toUpperCase();
  return storeState.applications.find(a => a.application_id && a.application_id.toUpperCase() === formatted) || null;
};

export const getFallbackApplicationsForUser = (userId, userEmail, userMobile) => {
  return storeState.applications.filter(a => {
    if (userId && a.user_id === userId) return true;
    if (userEmail && a.email && a.email.toLowerCase() === userEmail.toLowerCase()) return true;
    if (userMobile && a.mobile && a.mobile === userMobile) return true;
    return true; // Single tenant convenience
  });
};

export const getAllFallbackApplications = () => {
  return [...storeState.applications];
};

export const updateFallbackApplicationStatus = (appId, newStatus, paymentStatus) => {
  const app = getFallbackApplicationById(appId);
  if (app) {
    if (newStatus) app.status = newStatus;
    if (paymentStatus) app.payment_status = paymentStatus;
    app.updated_at = new Date().toISOString();
    persistStore();
    return app;
  }
  return null;
};

export const saveFallbackDocument = (docData) => {
  const existingIndex = storeState.documents.findIndex(
    d => d.id === docData.id || (d.application_id === (docData.application_id || '').toUpperCase() && d.file_name === docData.file_name)
  );

  const record = {
    id: docData.id || crypto.randomUUID(),
    application_id: (docData.application_id || docData.applicationId || '').toUpperCase(),
    document_type: docData.document_type || docData.documentType || 'Attached Proof Document',
    file_name: docData.file_name || docData.fileName || 'document.jpg',
    storage_path: docData.storage_path || docData.storagePath || '',
    file_path: docData.file_path || docData.filePath || null,
    file_buffer: docData.file_buffer || docData.buffer || null,
    mime_type: docData.mime_type || docData.mimeType || 'image/jpeg',
    file_size: docData.file_size || docData.fileSize || 102400,
    created_at: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    storeState.documents[existingIndex] = { ...storeState.documents[existingIndex], ...record };
    persistStore();
    return storeState.documents[existingIndex];
  } else {
    storeState.documents.unshift(record);
    persistStore();
    return record;
  }
};

export const getFallbackDocumentsByAppId = (appId) => {
  if (!appId) return [];
  const formatted = appId.trim().toUpperCase();
  return storeState.documents.filter(d => d.application_id && d.application_id.toUpperCase() === formatted);
};

export const getFallbackDocumentById = (docId) => {
  if (!docId) return null;
  return storeState.documents.find(d => d.id === docId) || null;
};

export const getAllFallbackDocuments = () => {
  return [...storeState.documents];
};

// Appointments Fallback Store
export const saveFallbackAppointment = (aptData) => {
  const year = new Date().getFullYear();
  const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
  const aptNumber = aptData.appointment_number || aptData.appointmentNumber || `APT-${year}-${hex}`;

  const record = {
    id: aptData.id || crypto.randomUUID(),
    appointment_number: aptNumber,
    user_id: aptData.user_id || null,
    customer_name: aptData.customer_name || aptData.customerName || 'princeydv',
    customer_email: aptData.customer_email || aptData.customerEmail || 'princesinghara4@gmail.com',
    customer_mobile: aptData.customer_mobile || aptData.customerMobile || '9155098378',
    service_id: aptData.service_id || aptData.serviceId || null,
    service_title: aptData.service_title || aptData.serviceTitle || 'Digital Service Assistance',
    application_id: aptData.application_id || aptData.applicationId || null,
    date: aptData.date || new Date().toISOString().split('T')[0],
    start_time: aptData.start_time || aptData.startTime || '10:00:00',
    end_time: aptData.end_time || aptData.endTime || '10:30:00',
    status: aptData.status || 'scheduled',
    notes: aptData.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  storeState.appointments.unshift(record);
  persistStore();
  return record;
};

export const getFallbackAppointmentsForUser = (userId, userEmail) => {
  return storeState.appointments.filter(a => {
    if (userId && a.user_id === userId) return true;
    if (userEmail && a.customer_email && a.customer_email.toLowerCase() === userEmail.toLowerCase()) return true;
    return true;
  });
};

export const getAllFallbackAppointments = () => {
  return [...storeState.appointments];
};

export const cancelFallbackAppointment = (id) => {
  const apt = storeState.appointments.find(a => a.id === id);
  if (apt) {
    apt.status = 'cancelled';
    apt.updated_at = new Date().toISOString();
    persistStore();
    return apt;
  }
  return null;
};

// Contacts Fallback Store
export const saveFallbackContact = (contactData) => {
  const record = {
    id: contactData.id || crypto.randomUUID(),
    name: contactData.name,
    mobile: contactData.mobile,
    email: contactData.email || null,
    subject: contactData.subject,
    message: contactData.message,
    status: 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  storeState.contacts.unshift(record);
  persistStore();
  return record;
};

export const getAllFallbackContacts = () => {
  return [...storeState.contacts];
};

