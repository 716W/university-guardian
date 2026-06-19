import { apiClient } from '../apiClient';
import type { ApiResponse } from '@/types/api';
import type { 
  College, Department, Location, Category,
  CreateCollegeRequest, UpdateCollegeRequest,
  CreateDepartmentRequest, UpdateDepartmentRequest,
  CreateLocationRequest, UpdateLocationRequest,
  CreateCategoryRequest, UpdateCategoryRequest
} from '@/types/masterData';

// --- Colleges ---
export const getColleges = async (): Promise<ApiResponse<College[]>> => {
  const { data } = await apiClient.get<ApiResponse<College[]>>('/api/v1/universities');
  return data;
};

export const createCollege = async (payload: CreateCollegeRequest): Promise<ApiResponse<College>> => {
  const { data } = await apiClient.post<ApiResponse<College>>('/api/v1/admin/universities', payload);
  return data;
};

export const updateCollege = async (id: string, payload: UpdateCollegeRequest): Promise<ApiResponse<College>> => {
  const { data } = await apiClient.put<ApiResponse<College>>(`/api/v1/admin/universities/${id}`, payload);
  return data;
};

export const deleteCollege = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data } = await apiClient.delete<ApiResponse<boolean>>(`/api/v1/admin/universities/${id}`);
  return data;
};

// --- Departments ---
export const getDepartments = async (): Promise<ApiResponse<Department[]>> => {
  const { data } = await apiClient.get<ApiResponse<Department[]>>('/api/v1/departments');
  return data;
};

export const createDepartment = async (payload: CreateDepartmentRequest): Promise<ApiResponse<Department>> => {
  const { data } = await apiClient.post<ApiResponse<Department>>('/api/v1/admin/departments', payload);
  return data;
};

export const updateDepartment = async (id: string, payload: UpdateDepartmentRequest): Promise<ApiResponse<Department>> => {
  const { data } = await apiClient.put<ApiResponse<Department>>(`/api/v1/admin/departments/${id}`, payload);
  return data;
};

export const deleteDepartment = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data } = await apiClient.delete<ApiResponse<boolean>>(`/api/v1/admin/departments/${id}`);
  return data;
};

// --- Locations ---
export const getLocations = async (): Promise<ApiResponse<Location[]>> => {
  const { data } = await apiClient.get<ApiResponse<Location[]>>('/api/v1/locations');
  return data;
};

export const createLocation = async (payload: CreateLocationRequest): Promise<ApiResponse<Location>> => {
  const { data } = await apiClient.post<ApiResponse<Location>>('/api/v1/admin/locations', payload);
  return data;
};

export const updateLocation = async (id: string, payload: UpdateLocationRequest): Promise<ApiResponse<Location>> => {
  const { data } = await apiClient.put<ApiResponse<Location>>(`/api/v1/admin/locations/${id}`, payload);
  return data;
};

export const deleteLocation = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data } = await apiClient.delete<ApiResponse<boolean>>(`/api/v1/admin/locations/${id}`);
  return data;
};

// --- Categories ---
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/api/v1/categories');
  return data;
};

export const createCategory = async (payload: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
  const { data } = await apiClient.post<ApiResponse<Category>>('/api/v1/admin/categories', payload);
  return data;
};

export const updateCategory = async (id: string, payload: UpdateCategoryRequest): Promise<ApiResponse<Category>> => {
  const { data } = await apiClient.put<ApiResponse<Category>>(`/api/v1/admin/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data } = await apiClient.delete<ApiResponse<boolean>>(`/api/v1/admin/categories/${id}`);
  return data;
};
