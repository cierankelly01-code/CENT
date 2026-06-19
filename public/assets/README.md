# Drop real assets here

Place client-supplied files in this folder and the placeholders disappear with
zero layout change. Expected paths:

| Path                         | Used by            | Intended dimensions |
| ---------------------------- | ------------------ | ------------------- |
| `/assets/logo.svg`           | nav / footer       | vector              |
| `/assets/product/hero.jpg`   | Hero               | portrait 4:5        |
| `/assets/product/home.jpg`   | Who it's for (home)| 16:10               |
| `/assets/product/venue.jpg`  | Who it's for (biz) | 16:10               |

To wire a real image into a placeholder, pass `src="/assets/product/hero.jpg"`
to the `<Placeholder />` component in the relevant section.

Also swap before public launch:
- `app/opengraph-image.tsx` — replace generated placeholder with a 1200×630 product render.
