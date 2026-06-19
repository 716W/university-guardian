export interface College {
  id: string;
  name: string;
  nameAr?: string;
}

export interface Department {
  id: string;
  name: string;
  nameAr?: string;
  universityId?: number;
  universityName?: string;
}

export interface Location {
  id: string;
  name: string;
  nameAr?: string;
  locationType?: number;
  departmentId: string | number;
  departmentName?: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
}

export interface CreateCollegeRequest {
  name: string;
}
export interface UpdateCollegeRequest {
  name: string;
}

export interface CreateDepartmentRequest {
  name: string;
  universityId: number;
}
export interface UpdateDepartmentRequest {
  name: string;
  universityId: number;
}

export interface CreateLocationRequest {
  name: string;
  locationType: number;
  departmentId: number;
}
export interface UpdateLocationRequest {
  name: string;
  locationType: number;
  departmentId: number;
}

export interface CreateCategoryRequest {
  name: string;
}
export interface UpdateCategoryRequest {
  name: string;
}
