export type ProductColour = { name: string; hex: string; image: string }
export type Product = {
  slug: string
  name: string
  tagline: string
  category: 'Jackets' | 'Shirts' | 'Trousers' | 'T-shirts' | 'Jeans' | 'Ethnic' | 'Winter accessories'
  price: number | null
  sizes: string[]
  colours: ProductColour[]
  reel?: string
  isNew: boolean
  postedAt: string
  image: string
  labelLines: string[]
  fit: string
}

// Catalog built from the shop's own WhatsApp posts, photos and reels.
// Media layout:
//   public/products/<folder>/<colour>.jpg  portrait photo (4:5) per colour
//   public/products/<folder>/reel.mp4      vertical video (9:16); set `reel` to enable it
// Prices left as null show "Ask for price". Sizes marked "confirm" below are guesses to check with the shop.
const c = (folder: string, name: string, hex: string, file: string): ProductColour => ({ name, hex, image: `/products/${folder}/${file}.jpg` })

export const products: Product[] = [
  {
    slug: 'premium-plain-shirt',
    name: 'Premium Plain Shirt',
    tagline: 'Premium quality, plain colour',
    category: 'Shirts',
    price: null,
    sizes: ['M', 'L', 'XL'],
    colours: [
      c('plain-shirt', 'Maroon', '#5a1f24', 'maroon'),
      c('plain-shirt', 'Turquoise', '#1fb5c9', 'turquoise'),
      c('plain-shirt', 'White', '#f1f0ec', 'white'),
      c('plain-shirt', 'Purple', '#6d1f7a', 'purple'),
      c('plain-shirt', 'Pink', '#c58cc4', 'pink'),
      c('plain-shirt', 'Black', '#1b1d26', 'black'),
      c('plain-shirt', 'Red', '#d9161e', 'red'),
    ],
    reel: '/products/plain-shirt/reel.mp4',
    isNew: true,
    postedAt: '2026-11-25',
    image: '/products/plain-shirt/maroon.jpg',
    labelLines: ['NEW PATTERN', 'PREMIUM QUALITY SHIRTS', '7 COLOUR', 'SIZE M–XL'],
    fit: 'Sizes M to XL',
  },
  {
    slug: 'winter-cap-mask-combo',
    name: 'Winter Cap + Mask Combo',
    tagline: 'Topi + mask · winter special',
    category: 'Winter accessories',
    price: 75,
    sizes: ['Free size'],
    // Only Magenta is confirmed from the reel; check the other four colour names with the shop.
    colours: [
      c('cap-mask', 'Magenta', '#8e2a5c', 'magenta'),
      c('cap-mask', 'Olive', '#6b6a45', 'magenta'),
      c('cap-mask', 'Black', '#1b1b1b', 'magenta'),
      c('cap-mask', 'Grey', '#8d8d8a', 'magenta'),
      c('cap-mask', 'Navy', '#26374b', 'magenta'),
    ],
    reel: '/products/cap-mask/reel.mp4',
    isNew: true,
    postedAt: '2026-11-23',
    image: '/products/cap-mask/magenta.jpg',
    labelLines: ['WINTER SPECIAL', 'TOPI + MASK COMBO', '5 COLOUR', '₹75 ONLY'],
    fit: 'One size fits most',
  },
  {
    slug: '2-in-1-winter-jacket',
    name: '2-in-1 Winter Jacket',
    tagline: 'New pattern, winter special',
    category: 'Jackets',
    price: null,
    sizes: ['L', 'XL'],
    // Photos taken from the WhatsApp post; Charcoal and Grey need their own photos.
    colours: [
      c('winter-jacket', 'Navy Blue', '#2c4f7c', 'navy-blue'),
      c('winter-jacket', 'Wine', '#5e2a3a', 'wine'),
      c('winter-jacket', 'Charcoal', '#33363a', 'navy-blue'),
      c('winter-jacket', 'Grey', '#8b8e91', 'navy-blue'),
    ],
    isNew: true,
    postedAt: '2026-11-24',
    image: '/products/winter-jacket/navy-blue.jpg',
    labelLines: ['NEW PATTERN', 'WINTER SPECIAL', '6 COLOUR', 'SIZE L–XL'],
    fit: 'Sizes L and XL',
  },
  {
    slug: 'puffer-half-jacket',
    name: 'Puffer Half Jacket',
    tagline: 'Sleeveless quilted jacket for winter',
    category: 'Jackets',
    price: null,
    sizes: ['M', 'L', 'XL', 'XXL'], // confirm
    colours: [
      c('puffer-jacket', 'White', '#eef0f3', 'white'),
      c('puffer-jacket', 'Charcoal', '#3b3e42', 'charcoal'),
    ],
    isNew: false,
    postedAt: '2026-11-19',
    image: '/products/puffer-jacket/white.jpg',
    labelLines: ['WINTER SPECIAL', 'PUFFER HALF JACKET', '2 COLOUR'],
    fit: 'Regular fit',
  },
  {
    slug: 'formal-stretch-trousers',
    name: 'Formal Stretch Trousers',
    tagline: 'Smart formal fit, soft stretch fabric',
    category: 'Trousers',
    price: null,
    sizes: ['28', '30', '32', '34', '36'], // confirm
    colours: [
      c('formal-trousers', 'Ice Blue', '#b9c7cf', 'ice-blue'),
      c('formal-trousers', 'Steel Blue', '#6f8797', 'steel-blue'),
      c('formal-trousers', 'Navy', '#1d2837', 'navy'),
      c('formal-trousers', 'Pista Grey', '#a7ab9c', 'pista'),
      c('formal-trousers', 'Butter Cream', '#e6dca8', 'stack'),
      c('formal-trousers', 'Mustard', '#a87a25', 'stack'),
      c('formal-trousers', 'Charcoal', '#33373b', 'stack'),
    ],
    isNew: false,
    postedAt: '2026-11-06',
    image: '/products/formal-trousers/stack.jpg',
    labelLines: ['FORMAL PANT', 'STRETCH FABRIC', '7 COLOUR'],
    fit: 'Waist 28 to 36',
  },
  {
    slug: 'young-fit-button-down-shirt',
    name: 'Button-Down Cotton Shirt',
    tagline: 'Button-down collar, plain colours',
    category: 'Shirts',
    price: null,
    sizes: ['M', 'L', 'XL'], // confirm
    colours: [
      c('young-fit-shirt', 'White', '#f3f1ec', 'stack'),
      c('young-fit-shirt', 'Light Grey', '#c9c8c4', 'stack'),
      c('young-fit-shirt', 'Maroon', '#7a1a2c', 'stack'),
      c('young-fit-shirt', 'Bottle Green', '#173f3a', 'stack'),
      c('young-fit-shirt', 'Pink', '#c58a9a', 'stack'),
      c('young-fit-shirt', 'Purple', '#7a4f87', 'stack'),
    ],
    isNew: false,
    postedAt: '2026-11-18',
    image: '/products/young-fit-shirt/stack.jpg',
    labelLines: ['PLAIN SHIRTS', 'BUTTON-DOWN COLLAR', '6 COLOUR'],
    fit: 'Sizes M to XL',
  },
]
