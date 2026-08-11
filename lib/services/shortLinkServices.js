import apiRequest from "../api/apiRequest";
import { conf } from "../conf";



const shortLinkServices = {

    // 🔐 ADMIN: CREATE SHORT LINK
    createShortLink(payload, token) {
        return apiRequest("POST", `${conf.apiBaseURL}/admin/short-links`, payload, token);
    },

    // 🔐 ADMIN: UPDATE SHORT LINK
    updateShortLink(payload, token) {
        return apiRequest("PUT", `${conf.apiBaseURL}/admin/short-links`, payload, token);
    },

    // 🔐 ADMIN: DELETE SHORT LINK
    deleteShortLink(payload, token) {
        return apiRequest("DELETE", `${conf.apiBaseURL}/admin/short-links`, payload, token);
    },

    // 🔐 ADMIN: GET SHORT LINKS
    getAdminShortLinks(filters = {}, token) {
        const params = new URLSearchParams(filters).toString();
        return apiRequest("GET", `${conf.apiBaseURL}/admin/short-links?${params}`, null, token);
    },

    // 🌐 PUBLIC: GET SHORT LINKS
    getPublicShortLinks(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return apiRequest("GET", `${conf.apiBaseURL}/short-links?${params}`);
    },

    // 🔗 PUBLIC: RESOLVE SHORT LINK (API BASED)
    resolveShortLink(slug) {
        return apiRequest("GET", `${conf.apiBaseURL}/short-links?slug=${slug}`);
    },

    // 🚀 DIRECT REDIRECT (BEST PRACTICE)
    redirectToShortLink(slug) {
        window.location.href = `${conf.apiBaseURL}/short-links?slug=${slug}`;
    }

};

export default shortLinkServices;