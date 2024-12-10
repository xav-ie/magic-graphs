import type { ProductInfo } from 'src/types'

const route: ProductInfo = {
  route: {
    path: '/search-visualizer',
    component: () => import('./Main.vue'),
  },
  name: 'Search Visualizer',
  description: 'A visualizer for search algorithms',
  productId: 'search-visualizer',
  menu: {
    name: 'Search Visualizer',
    description: 'A visualizer for search algorithms',
    thumbnail: '/products/thumbnails/search-visualizer.png',
    category: 'algorithms',
  },
}

export default route