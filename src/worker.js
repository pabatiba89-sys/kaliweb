const API_ORIGIN = 'https://yixiuapi.xyaip.fun';

const isApiRequest = (pathname) =>
  pathname === '/api' ||
  pathname.startsWith('/api/') ||
  pathname === '/login' ||
  pathname.startsWith('/login/');

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!isApiRequest(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    const upstreamUrl = new URL(`${url.pathname}${url.search}`, API_ORIGIN);
    const upstreamRequest = new Request(upstreamUrl, request);

    return fetch(upstreamRequest);
  },
};
