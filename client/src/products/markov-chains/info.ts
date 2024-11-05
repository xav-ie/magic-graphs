import type { ProductInfo } from "src/types";

export const info: ProductInfo = {
  route: {
    path: "/markov-chains",
    redirect: "https://cs240.netlify.app/",
  },
  name: "Markov Chains",
  description: "Markov chains are a type of stochastic process that models a sequence of possible events in which the probability of each event depends only on the state attained in the previous event.",
  productId: "markov-chains",
  menu: {
    name: "Markov Chains",
    description: "Markov chains are a type of stochastic process that models a sequence of possible events in which the probability of each event depends only on the state attained in the previous event.",
    thumbnail: "/products/thumbnails/markov-chains.png",
  }
}

export default info;