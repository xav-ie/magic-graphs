import type { ProductInfo } from 'src/types'

const info: ProductInfo = {
  route: {
    path: '/',
    component: () => import('./Main.vue'),
  },
  name: 'Main Page',
  description: 'The main page of the website',
  productId: 'main',
}

export default info