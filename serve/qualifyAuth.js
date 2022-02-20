function qualifyAuth(request) {
  const token = request.headers.cookie.match(/nws_info_token=([^;]*)(;|$)/)?.[1];
  if (!token || !sessions.some(session => session.token === token && session.expire > Date.now())) {
    return { errors: ['Unauthorized request'] };
  }
}

module.exports = { qualifyAuth };