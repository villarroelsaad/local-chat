// Lógica pura para testear y reutilizar en el middleware real
export function getRedirectPath({ pathname, token }: { pathname: string, token?: string }) {
  if (pathname.startsWith('/chat') && !token) {
    return '/login';
  }
  if ((pathname === '/login' || pathname === '/register') && token) {
    return '/chat';
  }
  return null;
}
