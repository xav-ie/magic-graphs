import type { ProductInfo } from 'src/types';

const info: ProductInfo = {
  route: {
    path: '/graph-playground',
    component: () => import('./GraphPlayground.vue'),
  },
  name: 'Graph Playground',
  description: 'A playground for graph algorithms',
  productId: 'graph-playground',
  menu: {
    name: 'Graph Playground',
    description: 'A playground for magic graphs',
    thumbnail: '/products/thumbnails/graph-playground.png',
    category: 'developer tools',
  },
};

export default info;
