import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const galleryServices = {
  // Admin: get folders
  getFolders(token) {
    return apiRequest("GET", `${conf.apiBaseURL}/admin/gallery/`, null, token);
  },

  // Admin: get images from folder
  getImages(folder, limit = 20, token) {
    return apiRequest("GET", `${conf.apiBaseURL}/admin/gallery/?folder=${folder}&limit=${limit}`, null, token);
  },

  // Admin: create new folder
  createFolder(folderName, token) {
    return apiRequest("POST", `${conf.apiBaseURL}/admin/gallery/`, { new_folder: folderName }, token);
  },

  // Admin: delete folder
  deleteFolder(folderName, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/gallery/`, { folder: folderName }, token);
  },

  // Admin: delete single file
  deleteFile(folder, file, token) {
    return apiRequest("DELETE", `${conf.apiBaseURL}/admin/gallery/`, { folder, file }, token);
  },

  // Admin: upload files
  uploadFiles(folder, filesArray, token) {
    const form = new FormData();
    form.append("folder", folder);
    filesArray.forEach((file) => form.append("files", file));

    return apiRequest("POST", `${conf.apiBaseURL}/admin/gallery/`, form, token);
  },

  // PUBLIC Gallery images
  getPublicGallery(folder) {
    return apiRequest("GET", `${conf.liveURL}/gallery?folder=${folder}`);
  }
};

export default galleryServices;
