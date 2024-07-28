# TAQWA

### TODO

- RED: #ff0054
- SEO
- Favicon and metadata
- Service on supabase
- https://codepen.io/Wujek_Greg/pen/KRXYpg
- In case of pc, increase logo size
- Add some kind of background animation to login page
- Add domain in google consent
- Complete login page
- Sign in flow, details edit on cloud console
- Continue with google, make it correctly align
- Icons and font alignation check on phone

### Important ones

- Most wishlisted feature
- Top Rated
- Best Sellers
- Setup supabase dynoes
- Oauth verification and consent screen correection
- Login Page fix
- Admin
- Order
- icons and stuff fix for categories. also add more categories
- SEO
- Edge functions for imagekit auth
- All the remaining pages in client side including orders tab
- Login redirection fix for admin or change to email and password
- Before login stuff and add new products

### Small features

- Login page image is late loading
- Like button around when unliking
- Order by random, set related items as most ordered
- banner
- All links add
- Like button sound effect
- Logo on front screen correction, front screen itself correction
- Vibrate effects
- Favicon
- Delete entire product
- Add new product
- Back button on admin portal page
- valav poy
- Delete image on admin panel should delete on imagekit

# For vaishak:

- Fix categories length in card horizontal scrolling
- Scroll to top
- Image loading animation fix

```javascript

  // When the user confirms the order get all the data and sent to a whatsapp number well formated about the address and the product details including link, then clear the cart
  const confirmOrder = async () => {
    const message = `🛒 Order Confirmed 🛒\n\n📦 Shipping Address 📦\n\nName: ${
      address.name
    }\nPhone: ${address.phone}\nAddress: ${address.address}\nZip: ${
      address.zip
    }\nCity: ${address.city}\nState: ${address.state || ""}\nCountry: ${
      address.country || ""
    }\n\n📦 Order Details 📦\n\n${cart
      .map(
        (product) =>
          `Product: ${product.name}\nQuantity: ${product.quantity}\nPrice: ₹ ${
            product.price * product.quantity
          }\nCategory: ${
            product.category
          }\nLink: https://taqwafashionstore.com/product/${product.id}`
      )
      .join("\n\n")}\n\nTotal: ₹ ${cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )}`;

    const url = `https://api.whatsapp.com/send?phone=+918281931488&text=${encodeURIComponent(
      message
    )}`;
```
