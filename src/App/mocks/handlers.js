import { rest } from 'msw';

export const getTagsHandler = (mockData) => {
  return rest.get('https://api.stackexchange.com/2.2/tags', (req, res, ctx) => {
    return res(
      ctx.json(mockData)
    );
  });
};

export const getEmptyTagsHandler = () => {
  return rest.get('https://api.stackexchange.com/2.2/tags', (req, res, ctx) => {
    return res(
      ctx.json({ items: [], has_more: false })
    );
  });
};
