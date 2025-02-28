import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  // if (token) {
  //   config.headers;
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

api.interceptors.response.use((response) => {
  if (response.headers["x-pagination"]) {
    const pagination = JSON.parse(response.headers["x-pagination"]);

    const normalizeData = {
      currentPage: pagination.CurrentPage || 1,
      hasNext: pagination.HasNext,
      hasPrevious: pagination.HasPrevious,
      pageSize: pagination.PageSize,
      totalPages: pagination.TotalPages,
      data: response.data,
      totalCount: pagination.TotalCount,
    };
    response.data = normalizeData;
  }

  return response;
});

export default api;
