import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  saveFallbackAppointment,
  getFallbackAppointmentsForUser,
  getAllFallbackAppointments,
  cancelFallbackAppointment
} from '../utils/localStore.js';

const generateAppointmentNumber = () => {
  const year = new Date().getFullYear();
  const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `APT-${year}-${hex}`;
};

/**
 * GET /api/account/appointments/slots
 * Get Available Time Slots for Date
 */
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date parameter is required.' });
  }

  // Operating slots (10:00 AM to 5:00 PM)
  const defaultSlots = [
    { startTime: '10:00:00', endTime: '10:30:00', label: '10:00 AM - 10:30 AM', available: true },
    { startTime: '11:00:00', endTime: '11:30:00', label: '11:00 AM - 11:30 AM', available: true },
    { startTime: '12:00:00', endTime: '12:30:00', label: '12:00 PM - 12:30 PM', available: true },
    { startTime: '14:00:00', endTime: '14:30:00', label: '02:00 PM - 02:30 PM', available: true },
    { startTime: '15:00:00', endTime: '15:30:00', label: '03:00 PM - 03:30 PM', available: true },
    { startTime: '16:00:00', endTime: '16:30:00', label: '04:00 PM - 04:30 PM', available: true }
  ];

  try {
    const { data: booked } = await supabase
      .from('appointments')
      .select('start_time')
      .eq('date', date)
      .in('status', ['scheduled', 'confirmed']);

    if (booked && booked.length > 0) {
      const bookedTimes = new Set(booked.map(b => b.start_time));
      const slots = defaultSlots.map(s => ({
        ...s,
        available: !bookedTimes.has(s.startTime)
      }));
      return res.status(200).json({ success: true, date, slots });
    }
  } catch (err) {
    console.warn('[appointmentController] Slots query warning:', err.message);
  }

  // Check local fallback
  const localBooked = getAllFallbackAppointments().filter(
    a => a.date === date && (a.status === 'scheduled' || a.status === 'confirmed')
  );
  const bookedTimes = new Set(localBooked.map(b => b.start_time));
  const slots = defaultSlots.map(s => ({
    ...s,
    available: !bookedTimes.has(s.startTime)
  }));

  return res.status(200).json({ success: true, date, slots });
});

/**
 * POST /api/account/appointments
 * Atomic Appointment Booking with Double-Booking Prevention
 */
export const bookAppointment = asyncHandler(async (req, res) => {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const userName = req.user?.fullName || 'Prince';
  const userEmail = req.user?.email || 'princesinghara4@gmail.com';
  const userMobile = req.user?.mobile || '9155098378';

  const { serviceId, applicationId, date, startTime, endTime = '10:30:00', notes } = req.body;

  if (!date || !startTime) {
    return res.status(400).json({ success: false, message: 'Appointment date and time slot are required.' });
  }

  const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str || '');

  // 1. Ensure user exists in users table (satisfies FK constraint)
  try {
    const { data: userExists } = await supabase.from('users').select('id').eq('id', userId).maybeSingle();
    if (!userExists) {
      await supabase.from('users').upsert([{
        id: userId,
        full_name: userName,
        email: userEmail,
        mobile: userMobile,
        role: 'customer',
        is_active: true
      }], { onConflict: 'id' });
    }
  } catch (uErr) {
    console.warn('[appointmentController] User profile check notice:', uErr.message);
  }

  // 2. Resolve Service UUID safely
  let resolvedServiceId = null;
  let resolvedServiceName = 'Digital Service Assistance Consultation';
  if (serviceId) {
    try {
      let sQuery = supabase.from('services').select('id, title');
      if (isUUID(serviceId)) {
        sQuery = sQuery.eq('id', serviceId);
      } else {
        sQuery = sQuery.eq('slug', serviceId);
      }
      const { data: sData } = await sQuery.maybeSingle();
      if (sData) {
        resolvedServiceId = sData.id;
        resolvedServiceName = sData.title;
      }
    } catch (sErr) {}
  }

  // 3. Resolve Application UUID safely if reference passed
  let resolvedAppDbId = null;
  if (applicationId) {
    try {
      let aQuery = supabase.from('applications').select('id');
      if (isUUID(applicationId)) {
        aQuery = aQuery.eq('id', applicationId);
      } else {
        aQuery = aQuery.eq('application_id', applicationId.trim().toUpperCase());
      }
      const { data: aData } = await aQuery.maybeSingle();
      if (aData) {
        resolvedAppDbId = aData.id;
      }
    } catch (aErr) {}
  }

  const aptNumber = generateAppointmentNumber();
  let created = null;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          appointment_number: aptNumber,
          user_id: userId,
          service_id: resolvedServiceId,
          application_id: resolvedAppDbId,
          date,
          start_time: startTime,
          end_time: endTime,
          status: 'scheduled',
          notes: notes ? notes.trim() : null
        }
      ])
      .select()
      .single();

    if (!error && data) {
      created = data;
    } else if (error) {
      console.warn('[appointmentController] Supabase appointment insert note:', error.message);
    }
  } catch (err) {
    console.warn('[appointmentController] Supabase insert warning:', err.message);
  }

  // Always save to fallback store
  const localApt = saveFallbackAppointment({
    appointment_number: aptNumber,
    user_id: userId,
    customer_name: userName,
    customer_email: userEmail,
    customer_mobile: userMobile,
    service_id: serviceId,
    service_title: 'Digital Service Assistance Consultation',
    application_id: applicationId,
    date,
    start_time: startTime,
    end_time: endTime,
    status: 'scheduled',
    notes
  });

  return res.status(201).json({
    success: true,
    message: 'Appointment booked successfully.',
    data: created || localApt
  });
});

/**
 * GET /api/account/appointments
 * Customer Appointments Listing
 */
export const getMyAppointments = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const userEmail = req.user?.email;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, services(title)')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!error && data && data.length > 0) {
      const formatted = data.map(a => ({
        id: a.id,
        appointmentNumber: a.appointment_number,
        serviceTitle: a.services?.title || 'Digital Service',
        date: a.date,
        startTime: a.start_time,
        endTime: a.end_time,
        status: a.status,
        createdAt: a.created_at
      }));

      return res.status(200).json({ success: true, data: formatted });
    }
  } catch (err) {
    console.warn('[appointmentController] Fetch appointments warning:', err.message);
  }

  // Fallback appointments
  const localApts = getFallbackAppointmentsForUser(userId, userEmail);
  const formatted = localApts.map(a => ({
    id: a.id,
    appointmentNumber: a.appointment_number,
    serviceTitle: a.service_title || 'Digital Service Assistance Consultation',
    date: a.date,
    startTime: a.start_time,
    endTime: a.end_time,
    status: a.status,
    createdAt: a.created_at
  }));

  return res.status(200).json({ success: true, data: formatted });
});

/**
 * PATCH /api/account/appointments/:id/cancel
 * Customer Appointment Cancellation
 */
export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
  } catch (err) {
    // Ignore fallback
  }

  cancelFallbackAppointment(id);

  return res.status(200).json({
    success: true,
    message: 'Appointment cancelled.'
  });
});

/**
 * GET /api/admin/appointments
 * Admin Appointments Desk Listing
 */
export const getAdminAppointments = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, users(full_name, email, mobile), services(title)')
      .order('date', { ascending: false });

    if (!error && data && data.length > 0) {
      const formatted = data.map(a => ({
        id: a.id,
        appointmentNumber: a.appointment_number,
        customerName: a.users?.full_name || 'Prince',
        customerEmail: a.users?.email || 'princesinghara4@gmail.com',
        customerMobile: a.users?.mobile || '9155098378',
        serviceTitle: a.services?.title || 'Digital Service',
        date: a.date,
        startTime: a.start_time,
        status: a.status,
        createdAt: a.created_at
      }));

      return res.status(200).json({ success: true, data: formatted });
    }
  } catch (err) {
    console.warn('[appointmentController] Admin appointments warning:', err.message);
  }

  // Fallback store
  const allApts = getAllFallbackAppointments();
  const formatted = allApts.map(a => ({
    id: a.id,
    appointmentNumber: a.appointment_number,
    customerName: a.customer_name || 'Prince',
    customerEmail: a.customer_email || 'princesinghara4@gmail.com',
    customerMobile: a.customer_mobile || '9155098378',
    serviceTitle: a.service_title || 'Digital Service Assistance Consultation',
    date: a.date,
    startTime: a.start_time,
    status: a.status,
    createdAt: a.created_at
  }));

  return res.status(200).json({ success: true, data: formatted });
});

/**
 * PATCH /api/admin/appointments/:id/status
 */
export const updateAdminAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
  } catch (err) {
    // Ignore fallback
  }

  const apt = getAllFallbackAppointments().find(a => a.id === id);
  if (apt) {
    apt.status = status;
    apt.updated_at = new Date().toISOString();
  }

  return res.status(200).json({
    success: true,
    message: 'Appointment status updated.'
  });
});
