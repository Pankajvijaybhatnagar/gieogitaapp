import { conf } from "../conf";
import apiRequest from "../api/apiRequest";

/**
 * Upload a single file
 *
 * @param {File} file
 * @param {string} folder
 * @param {string|null} oldFile
 * @param {string|null} token
 */
async function uploadSingleFile(
  file,
  folder,
  oldFile = null,
  token = null
) {
  try {
    const formData = new FormData();

    formData.append("folder", folder);
    formData.append("file", file);

    if (oldFile) {
      formData.append("old_file", oldFile);
    }

    const response = await apiRequest(
      "POST",
      `${conf.apiBaseURL}/admin/upload`,
      formData,
      token
    );

    return response;
  } catch (err) {
    return {
      success: false,
      status: 0,
      error: err.message,
    };
  }
}

/**
 * Upload multiple files
 *
 * @param {File[]} filesArray
 * @param {string} folder
 * @param {string|null} token
 */
async function uploadMultipleFiles(
  filesArray,
  folder,
  token = null
) {
  const results = [];

  for (const file of filesArray) {
    const response = await uploadSingleFile(
      file,
      folder,
      null,
      token
    );

    results.push(response);
  }

  return results;
}

const uploadServices = {
  uploadSingleFile,
  uploadMultipleFiles,
};

export default uploadServices;