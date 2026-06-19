import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getColleges, createCollege, updateCollege, deleteCollege,
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getLocations, createLocation, updateLocation, deleteLocation,
  getCategories, createCategory, updateCategory, deleteCategory
} from '@/lib/api/endpoints/masterData';
import type {
  College, Department, Location, Category,
  CreateCollegeRequest, UpdateCollegeRequest,
  CreateDepartmentRequest, UpdateDepartmentRequest,
  CreateLocationRequest, UpdateLocationRequest,
  CreateCategoryRequest, UpdateCategoryRequest
} from '@/types/masterData';
import type { ApiResponse } from '@/types/api';

// Keys
export const masterDataKeys = {
  all: ['masterData'] as const,
  colleges: () => [...masterDataKeys.all, 'colleges'] as const,
  departments: () => [...masterDataKeys.all, 'departments'] as const,
  locations: () => [...masterDataKeys.all, 'locations'] as const,
  categories: () => [...masterDataKeys.all, 'categories'] as const,
};

// --- Colleges ---
export const useGetColleges = () => {
  return useQuery({
    queryKey: masterDataKeys.colleges(),
    queryFn: getColleges,
  });
};

export const useCreateCollege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollege,
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<College[]>>(masterDataKeys.colleges(), (old) => {
        if (!old) return old;
        return { ...old, data: [...(old.data || []), response.data] };
      });
    },
  });
};

export const useUpdateCollege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCollegeRequest }) => updateCollege(id, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<College[]>>(masterDataKeys.colleges(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data ? old.data.map(item => item.id === response.data.id ? response.data : item) : [] };
      });
    },
  });
};

export const useDeleteCollege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollege,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ApiResponse<College[]>>(masterDataKeys.colleges(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data ? old.data.filter(item => item.id !== deletedId) : [] };
      });
    },
  });
};

// --- Departments ---
export const useGetDepartments = () => {
  return useQuery({
    queryKey: masterDataKeys.departments(),
    queryFn: getDepartments,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<Department[]>>(masterDataKeys.departments(), (old) => {
        if (!old) return old;
        return { ...old, data: [...(old.data || []), response.data] };
      });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDepartmentRequest }) => updateDepartment(id, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<Department[]>>(masterDataKeys.departments(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data ? old.data.map(item => item.id === response.data.id ? response.data : item) : [] };
      });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ApiResponse<Department[]>>(masterDataKeys.departments(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data ? old.data.filter(item => item.id !== deletedId) : [] };
      });
    },
  });
};

// --- Locations ---
export const useGetLocations = () => {
  return useQuery({
    queryKey: masterDataKeys.locations(),
    queryFn: getLocations,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<Location[]>>(masterDataKeys.locations(), (old) => {
        if (!old) return old;
        return { ...old, data: [...(old.data || []), response.data] };
      });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLocationRequest }) => updateLocation(id, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<Location[]>>(masterDataKeys.locations(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data ? old.data.map(item => item.id === response.data.id ? response.data : item) : [] };
      });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ApiResponse<Location[]>>(masterDataKeys.locations(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data ? old.data.filter(item => item.id !== deletedId) : [] };
      });
    },
  });
};

// --- Categories ---
export const useGetCategories = () => {
  return useQuery({
    queryKey: masterDataKeys.categories(),
    queryFn: getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<Category[]>>(masterDataKeys.categories(), (old) => {
        if (!old) return old;
        return { ...old, data: [...(old.data || []), response.data] };
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryRequest }) => updateCategory(id, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<Category[]>>(masterDataKeys.categories(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data ? old.data.map(item => item.id === response.data.id ? response.data : item) : [] };
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ApiResponse<Category[]>>(masterDataKeys.categories(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data ? old.data.filter(item => item.id !== deletedId) : [] };
      });
    },
  });
};
