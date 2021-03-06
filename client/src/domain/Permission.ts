export interface PermissionPayload {
  code: string;
  description: string;
}

export interface Permission extends PermissionPayload {
  _id: string;
}
