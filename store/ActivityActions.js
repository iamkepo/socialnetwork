export const setStateAction = index => (
  {
    type: 'STATE',
    payload: index,
  }
);
export const getPostsAction = index => (
  {
    type: 'GETPOSTS',
    payload: index,
  }
);
