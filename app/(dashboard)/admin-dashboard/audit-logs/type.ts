export interface AuditLog {
  _id: string;
  userId: string;
  action: string;
  email: string;
  ip: string;
  browser: string;
  device: string;
  os: string;
  createdAt: string;
  updatedAt: string;
}
