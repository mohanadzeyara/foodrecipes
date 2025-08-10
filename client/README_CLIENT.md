Client quick notes:
- The client stores `token` and `user` in localStorage after login/register.
- Requests that modify data send `Authorization: Bearer <token>` header.
- To change the API URL, set `REACT_APP_API_URL` before `npm start`.
