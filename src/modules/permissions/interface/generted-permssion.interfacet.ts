export interface GeneratedPermission {
    permissionCode: string;
    description: string;
  }

  

export interface GeneratePermissionsResult {
    created: string[];
    skipped: string[];
  }