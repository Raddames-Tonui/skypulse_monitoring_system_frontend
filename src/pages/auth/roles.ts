export function hasRole(user: any, allowed: string | string[]) {
  if (!user) return false;
  const role = user.roleName?.toUpperCase();
  if (Array.isArray(allowed)) return allowed.includes(role);
  return role === allowed;
}
