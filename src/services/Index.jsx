import requests from "./httpServices";

// ========================================== POST =============================================
export const UserLogin = async (data) => {
  return await requests.post(`auth/login`, data);
};
export const CreateSession = async (data) => {
  return await requests.post(`sessions`, data);
};
export const CreateContent = async (data) => {
  return await requests.post(`content`, data);
};
export const PatchContent = async (id, data) => {
  return await requests.patch(`content/${id}`, data);
};
export const CreateAssessments = async (data) => {
  return await requests.post(`assessments`, data);
};
export const DeploySession = async (id) => {
  return await requests.patch(`sessions/deploy/${id}`);
};
export const DeleteSession = async (id) => {
  return await requests.delete(`sessions/${id}`);
};
// export const GetAllExperience = async () => {
//   return await requests.get(`sessions`);
// };
export const GetAllExperience = async (data) => {
  return await requests.post(`sessions/filter`, data);
};
export const GetExperienceById = async (id) => {
  return await requests.get(`sessions/${id}`);
};
export const GetRoles = async () => {
  return await requests.get(`roles`);
};
export const patchRoles = async (id,data) => {
  return await requests.patch(`/roles/${id}/permissions`,data);
};

export const GetSubscription = async () => {
  return await requests.get(`subscriptions`);
};

export const DeleteSubscriptions = async (id) => {
  return await requests.delete(`subscriptions/${id}`);
};
export const CreateSubscription = async (data) => {
  return await requests.post(`subscriptions`, data);
};

export const UpdateSubscription = async (id,data) => {
  return await requests.post(`subscriptions/${id}`, data);
};

export const PatchSubscription = async (id,data) => {
  return await requests.patch(`subscriptions/${id}`, data);
};

export const GetSchool = async () => {
  return await requests.get(`schools`);
};
export const PatchSchool = async (id,data) => {
  return await requests.patch(`schools/${id}`, data);
};
export const DeleteSchool = async (id) => {
  return await requests.delete(`schools/${id}`);
};
export const CreateSchool = async (data) => {
  return await requests.post(`schools`,data);
};
export const GetIdSchool = async (id) => {
  return await requests.get(`schools/${id}`);
};