# TAQWA

### TODO

- RED: #ff0054
- SEO
- Complete login page
- Icons and font alignation check on phone

### Important ones

- Most wishlisted feature
- Top Rated
- Best Sellers
- Setup supabase dynos
- icons and stuff fix for categories. also add more categories
- SEO
- Edge functions for imagekit auth
- Verify order

### Small features

- Login page image is late loading, save to localStorage
- Order by random, set related items as most ordered
- banner
- Like button sound effect
- Vibrate effects
- Favicon
- Back button on admin portal page
- Delete image on admin panel should delete on imagekit

# For vaishak:

- ~~Scroll to top~~
- ~~Image loading animation fix~~
- ~~Change into secure version of razorpay payment with user rls disabled.~~
- Like button around when unliking. if you liked a product (wishlisted) and then proceeded to unlike the product. clicking anywhere on product card except the image itself unlikes it. presstty sure this is not due to javascript propogration.
- ~~Whatsapp product sharing image nd name as meta tags~~ obsolete

## Todo

- ~~Order id billing~~
- ~~Login with email/password~~
- ~~Size Chart~~
- ~~Marque~~
- ~~Price range~~
- ~~More products on Sidebar~~
- ~~Category fix~~
- Realtime on admins orders
- ~~Size chart~~
- ~~Category card scrolling~~
- Clock

## Changes made to supabase

- ~~new column - payment method~~
- ~~fragnance and accessories~~
- ~~category~~
- ~~thin and thick~~
- ~~Banner~~
- https://supabase.com/docs/guides/platform/going-into-prod
- https://supabase.com/docs/guides/auth/phone-login
- ~~Razorpay verification~~
- ~~Description~~
- ~~Order pay on delivery on dashboard~~
- ~~Card animation for banners~~
- ~~realtime on admin~~
- ~~Admin side order page fix.~~
- ~~Order page fix~~
- ~~Description - required~~
- ~~Orders admin side~~
- ~~Order page, print thing~~
- ~~banner order~~
- ~~image shiine~~
- ~~Price black~~
- Webp
- image deletion from server
- Address autofill issue
- Video client side test
- image size varun
- Iphone size issue and scrolling
- Category name
- Ordered and WIshlisted
- Add comment delete comment
- Images

```
<LazyLoadImage
  alt="Category Thumbnail"
  src={thumbnail}
  effect="blur"
  className="object-cover rounded-lg w-[10em] h-[15em]"
  style={{
    display: imageLoaded ? "block" : "none",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
  }}
  onLoad={() => {
    setTimeout(() => {
      setImageLoaded(true);
    }, 300);
  }}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "path/to/default/image.jpg"; // replace with your default image path
  }}
/>
```

https://www.sitepoint.com/five-techniques-lazy-load-images-website-performance/

## Todo

Comment only for proudct add
4 x 4 for shoes and
Converse size as shoe
Perfume prev price
0 Sheriyakkanam for converse
Add to cart not alerting
