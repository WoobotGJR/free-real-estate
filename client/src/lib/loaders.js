import { defer } from 'react-router-dom';
import apiRequest from './apiRequest';

const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest(`/api/posts/${params.id}`);
  return res.data;
};

const listPageLoader = async ({ request, params }) => {
  const query = request.url.split('?')[1];
  const postPromise = fetch('/posts?' + query);
  return defer({ postResponse: postPromise });
};

const profilePageLoader = async () => {
  const res = await apiRequest('/users/profilePosts');
  return defer({ postResponse: postPromise });
};

export { singlePageLoader, listPageLoader, profilePageLoader };
