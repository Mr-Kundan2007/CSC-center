/**
 * Application Lifecycle State Machine
 * Validates allowed application status transitions server-side.
 */

export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  DOCUMENT_REQUIRED: 'document_required',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

const ALL_STATUSES = Object.values(APPLICATION_STATUSES);

/**
 * Check if a status string is a recognized valid application status
 */
export const isValidStatus = (status) => {
  return ALL_STATUSES.includes(status);
};

/**
 * Verify whether transitioning from currentStatus to targetStatus is permitted
 * Allows flexible admin workflow transitions between any valid statuses.
 */
export const isValidTransition = (currentStatus, targetStatus) => {
  if (!currentStatus || !targetStatus) return false;
  if (!isValidStatus(targetStatus) || !isValidStatus(currentStatus)) return false;
  if (currentStatus === targetStatus) return true;
  // Terminal statuses cannot transition backward to pending
  if (currentStatus === 'completed' || currentStatus === 'rejected') {
    return false;
  }
  return true;
};
