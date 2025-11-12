const authFetchOptions = (token?: string | null, method = "GET", body?: any) => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return { method, headers, body: body ? JSON.stringify(body) : undefined };
};

export default authFetchOptions;