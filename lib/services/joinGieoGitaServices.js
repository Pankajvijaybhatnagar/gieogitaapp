import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



/**
 * Join GIEO Gita Services
 */
const joinGieoGitaServices = {
  /**
   * Create new profile
   * POST /api/users.php
   */
  createProfile(payload) {
    return apiRequest("POST", `${conf.joinGieoGitaFormURL}/users.php`, payload);
  },

  /**
   * Update existing profile
   * PUT /api/users.php
   */
  updateProfile(payload) {
    return apiRequest("PUT", `${conf.joinGieoGitaFormURL}/users.php`, payload);
  },

  /**
   * Get public profile by phone
   * GET /api/users.php?phone=xxxx
   */
  getProfileByPhone(phone) {
    return apiRequest(
      "GET",
      `${conf.joinGieoGitaFormURL}/users.php?phone=${encodeURIComponent(phone)}`,
    );
  },

  /**
   * Get public profile by hash_id
   * GET /api/users.php?hash_id=xxxx
   */
  getProfileByHashId(hashId) {
    return apiRequest(
      "GET",
      `${conf.joinGieoGitaFormURL}/users.php?hash_id=${encodeURIComponent(hashId)}`,
    );
  },

  /**
   * Get public profile by email
   * GET /api/users.php?email=xxxx
   */
  getProfileByEmail(email) {
    return apiRequest(
      "GET",
      `${conf.joinGieoGitaFormURL}/users.php?email=${encodeURIComponent(email)}`,
    );
  },

  getOccupationOptions() {
    return apiRequest("GET", `${conf.joinGieoGitaFormURL}/occupations.php`);
  },
  getEducationOptions() {
    return apiRequest("GET", `${conf.joinGieoGitaFormURL}/educations.php`);
  },

  avatarUpdate(payload) {
    return apiRequest(
      "POST",
      `${conf.joinGieoGitaFormURL}/avatar.php`,
      payload,
    );
  },
};

export default joinGieoGitaServices;
