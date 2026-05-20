import { jwtDecode } from "jwt-decode";

// The standard .NET claim type for roles
const ROLE_CLAIM_KEY = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export interface DotNetJwtPayload {
  [ROLE_CLAIM_KEY]?: string | string[];
  exp?: number;
  iss?: string;
  sub?: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * Extracts and normalizes roles from a .NET generated JWT token.
 * .NET APIs can return the role claim as a single string (if one role) 
 * or an array of strings (if multiple roles).
 * 
 * @param token The raw JWT string
 * @returns An array of role strings (empty array if none found or decode fails)
 */
export function extractRolesFromToken(token: string): string[] {
  if (!token) return [];

  try {
    const decoded = jwtDecode<DotNetJwtPayload>(token);
    const roles = decoded[ROLE_CLAIM_KEY];

    if (!roles) {
      return [];
    }

    // Normalize to an array regardless of whether .NET returned a string or array
    return Array.isArray(roles) ? roles : [roles];
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return [];
  }
}
