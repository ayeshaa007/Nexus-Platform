// Type definitions converted from TypeScript to JSDoc comments.
// No runtime code needed — JS does not require type declarations.

/**
 * @typedef {'entrepreneur' | 'investor'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} avatarUrl
 * @property {string} bio
 * @property {boolean} [isOnline]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CollaborationRequest
 * @property {string} id
 * @property {string} investorId
 * @property {string} entrepreneurId
 * @property {string} message
 * @property {'pending' | 'accepted' | 'rejected'} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} senderId
 * @property {string} receiverId
 * @property {string} content
 * @property {string} timestamp
 * @property {boolean} isRead
 */
