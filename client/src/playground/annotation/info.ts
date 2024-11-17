import type { ProductInfo } from 'src/types'

const route: ProductInfo = {
  route: {
    path: '/annotation-playground',
    component: () => import('./AnnotationPlayground.vue'),
  },
  name: 'Drawing stuff',
  description: 'A playground for drawing',
  productId: 'annotation-playground',
  menu: {
    name: 'Annotation Playground',
    description: 'A playground for testing annotations',
    thumbnail: '/products/thumbnails/annotations.png',
  },
}

export default route