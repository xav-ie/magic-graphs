import type { ProductInfo } from 'src/types'

const route: ProductInfo = {
  route: {
    path: '/shape-playground',
    component: () => import('./AnnotationPlayground.vue'),
  },
  name: 'Drawing stuff',
  description: 'A playground for drawing',
  productId: 'annotation-playground',
  menu: {
    name: 'Annotation Playground',
    description: 'A playground for testing annotations',
    thumbnail: '/products/thumbnails/shape-playground.png',
  },
}

export default route