import type { ProductInfo } from "src/types"

// import all route.ts files dynamically
const infoModules = import.meta.glob<{
  default: ProductInfo
}>('/src/**/info.ts', { eager: true })

export const products = Object.values(infoModules).flatMap((mod) => mod.default)
export const productRoutes = products.map((product) => product.route)

export type ProductMap = Record<ProductInfo['productId'], ProductInfo>

export const productIdToProduct = products.reduce<ProductMap>((acc, product) => {
  acc[product.productId] = product
  return acc
}, {})

export type RouteToProduct = Record<string, ProductInfo>

export const routeToProduct = products.reduce<RouteToProduct>((acc, product) => {
  acc[product.route.path] = product
  return acc
}, {})
