export const setStateAction = index => (
  {
    type: 'STATE',
    payload: index,
  }
);
export const userAction = (index, value) => (
  {
    type: 'USER',
    index: index,
    value: value
  }
);
export const getPostsAction = index => (
  {
    type: 'GETPOSTS',
    payload: index,
  }
);
