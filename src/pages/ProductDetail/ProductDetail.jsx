import React, { useContext, useEffect, useState, useRef } from "react";
import { TopProductDetail } from "../../components/TopPageDetail";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillStar } from "react-icons/ai";
import Like from "../../components/Like";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import supabase from "../../supabase";
import { useParams } from "react-router-dom";
import Clock from "../../components/clock";
import { CardList } from "../Landing/Landing";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { HiMiniCurrencyRupee } from "react-icons/hi2";
import { SessionContext } from "../../components/SessionContext";
import { WishlistContext } from "../../components/WishlListContext";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem } from "../../components/cartSlice";
import { PiMinusCircleFill } from "react-icons/pi";
import { PiPlusCircleFill } from "react-icons/pi";
import { Helmet } from "react-helmet-async";
import { addSize } from "../../components/cartSlice";

const Slideshow = ({ slideImages }) => {
  return (
    <div className="slide-container">
      <Slide>
        {slideImages.map((slideImage, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-center bg-cover h-96 w-[96%] mx-auto rounded-lg bg-center bg-no-repeat mt-4 cursor-zoom-in lg:object-contain"
              style={{
                backgroundImage: `url("${slideImage}")`,
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              }}
            ></div>
          );
        })}
      </Slide>
    </div>
  );
};

const ProductDetail = () => {
  const [product, setProduct] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [relatedProducts, setRelatedProducts] = React.useState([]);
  const { session } = useContext(SessionContext);

  //-----Size Selection Functionality-----

  const [availableSizes, setavailableSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeClick = (size) => {
    if (availableSizes.includes(size)) {
      setSelectedSize(size);
    } else {
      toast.error("This size is not available for this product yet!");
    }
  };

  //-----------------------------------
  const location = useLocation();
  const { productId } = useParams();

  const scroll = () => {
    const section = document.querySelector("#top");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Wishlist functionality
  const { wishlist, setWishlist } = useContext(WishlistContext);
  const isInWishlist = wishlist.includes(product.id);

  // Copy the URL to the clipboard

  const handleCopy = async () => {
    const url = window.location.origin + location.pathname;
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast(`Failed to copy the link. Please copy it manually: ${url}`);
    }
  };

  // Shopping cart functionality

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const productInCart = cartItems.find((item) => item.id === product.id);
  const quantity = productInCart ? productInCart.quantity : 0;
  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    const productInCart = cartItems.find(
      (item) => item.id === product.id && item.size === selectedSize
    );
    setLocalQuantity(productInCart ? productInCart.quantity : 0);
  }, [cartItems, product.id, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedSize && availableSizes.length > 0) {
      toast.error("Please select a size first!");
    } else {
      console.log("Product added to cart");
      setLocalQuantity(quantity + 1);
      dispatch(addItem({ ...product, size: selectedSize }));
      dispatch(addSize({ id: product.id, size: selectedSize }));
      console.log(quantity);
    }
  };
  const handleIncrement = (event) => {
    event.stopPropagation();
    setLocalQuantity(quantity + 1);
    dispatch(addItem({ ...product, size: selectedSize }));
  };

  const handleDecrement = (event) => {
    event.stopPropagation();
    if (quantity > 0) {
      setLocalQuantity(quantity - 1);
      dispatch(removeItem({ ...product, size: selectedSize }));
      console.log("Decremented");
    }
  };

  useEffect(() => {
    setLocalQuantity(0);
    scroll();
  }, [productId]);

  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!selectedSize && availableSizes.length > 0) {
      toast.error("Please select a size first!");
    } else {
      dispatch(addItem({ ...product, size: selectedSize }));
      dispatch(addSize({ id: product.id, size: selectedSize }));
      navigate("/cart");
    }
  };

  //-----------------------------------

  //
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId);
      if (error) {
        console.log(error);
      }
      setProduct(data[0]);
      console.log("Product: ", data[0]);
      setavailableSizes(data[0].available_sizes || []);
      console.log("Available sizes", availableSizes);
      setIsLoading(false);

      const fetchCategories = async () => {
        const { data, error } = await supabase.from("categories").select("*");
        if (error) {
          console.error("Error fetching categories: ", error);
        } else {
          setCategories(data);
          console.log(categories);
        }
      };

      const fetchRelatedProducts = async () => {
        //exclding the current product
        const { data: relatedData, error } = await supabase
          .from("products")
          .select("*")
          .limit(10)
          .order("category", { ascending: true })
          .neq("id", data[0].id)
          .eq("category", data[0].category);

        if (error) {
          console.log(error);
        }
        console.log("Related Products");
        console.log(relatedData);

        // Select 4 random products
        const randomProducts = [];
        for (let i = 0; i < 4; i++) {
          const randomIndex = Math.floor(Math.random() * relatedData.length);
          if (relatedData[randomIndex]) {
            randomProducts.push(relatedData[randomIndex]);
            relatedData.splice(randomIndex, 1);
          }
        }

        setRelatedProducts(randomProducts);
      };

      fetchCategories();
      fetchRelatedProducts();
    };

    fetchProduct();
  }, [productId]);

  //-----------------------------------
  // Wishlist functionality

  const toggleWishlist = async () => {
    const id = product.id;
    // Optimistically update the UI
    if (isInWishlist) {
      setWishlist((oldWishlist) => oldWishlist.filter((item) => item !== id));
    } else {
      setWishlist((oldWishlist) => [...oldWishlist, id]);
    }

    // Then perform the network request in the background
    if (isInWishlist) {
      // Remove from wishlist
      const { data, error } = await supabase
        .from("wishlist")
        .delete()
        .match({ user_id: session.user.id, product_id: id });
      if (error) {
        console.log(error);
        // If the request fails, revert the UI update
        setWishlist((oldWishlist) => [...oldWishlist, id]);
      }
    } else {
      // Add to wishlist
      const { data, error } = await supabase
        .from("wishlist")
        .insert([{ user_id: session.user.id, product_id: id }]);
      if (error) {
        console.log(error);
        // If the request fails, revert the UI update
        setWishlist((oldWishlist) => oldWishlist.filter((item) => item !== id));
      }
    }
  };

  // Image zoom functionality
  const [isCover, setIsCover] = useState(true);

  const handleImageClick = () => {
    setIsCover(!isCover);
  };

  if (isLoading) {
    return (
      <div className="page">
        <TopProductDetail title="Product Detail" />
        <div className="flex items-center justify-center h-[80vh]">
          <Clock />
        </div>
      </div>
    );
  }

  return (
    <div className="page overflow-x-hidden pb-[5em]">
      {product && (
        <Helmet>
          <title>{product.name} - TAQWA Fashion Store</title>
          <meta
            name="description"
            content={`Buy ${product.name} at the best price on TAQWA Fashion Store. Home Delivery and 100% satisfaction guaranteed.`}
          />
          <meta property="og:title" content={product.name} />
          <meta property="og:image" content={product.images[0]} />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
      )}
      <TopProductDetail title={product.name} onCopy={handleCopy} />
      <ToastContainer />

      <div className="product-detail">
        {product.images.length === 1 ? (
          <img
            src={product.images[0]}
            alt=""
            className={`w-[96%] m-auto rounded-lg mt-4 mb-3 h-96 cursor-zoom-in ${
              isCover ? "object-cover" : "object-contain"
            }`}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            }}
            onClick={handleImageClick}
          />
        ) : (
          <Slideshow slideImages={product.images} />
        )}

        <div className="product-details mt-1 w-full p-4 ">
          <div className="flex justify-between mb-3">
            <p className="text-2xl ">{product.name}</p>
            {session && (
              <Like
                checked={isInWishlist}
                size="1em"
                onClick={toggleWishlist}
              />
            )}
          </div>
          <p
            style={{
              color: "#ff0054",
            }}
            className="mt-1 mb-3 text-lg"
          >
            ₹ {product.price}
          </p>
          <span className="block mt-1 text-yellow-500">
            {Array(Math.round(product.avg_rating))
              .fill()
              .map((_, index) => (
                <AiFillStar
                  key={index}
                  size={20}
                  color="#FFD700"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                />
              ))}
          </span>
        </div>
        {categories &&
          categories.find(
            (category) => category.category === product.category
          ) &&
          categories.find((category) => category.category === product.category)
            .sizes &&
          categories.find((category) => category.category === product.category)
            .sizes.length > 0 && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-center"
                htmlFor="size"
              >
                Available Sizes
              </label>
              <div className="pb-2 flex flex-row justify-center align-middle items-center overflow-x-auto flex-wrap">
                {categories
                  .find((category) => category.category === product.category)
                  .sizes.map((size, index) => (
                    <div key={index} className="items-center m-2">
                      <span
                        style={{
                          boxShadow: availableSizes.includes(size)
                            ? "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                            : null,
                          fontSize: "0.8em",
                        }}
                        className={`inline-block w-10 h-10 font-mono  flex items-center justify-center text-center rounded-full cursor-pointer ${
                          size === selectedSize
                            ? "bg-[#ff0054] text-white font-bold"
                            : availableSizes.includes(size)
                            ? "bg-gray-200 cursor-pointer"
                            : "bg-gray-400 cursor-wait"
                        }`}
                        onClick={() => handleSizeClick(size)}
                        disabled={
                          !product.available_sizes ||
                          !product.available_sizes.includes(size)
                        } // Disable the size if it's not in product.available_sizes
                      >
                        {size}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        <div className="  product-action justify-center items-center  w-full flex m-auto gap-3">
          <div
            style={{
              backgroundColor: "#ff0054",
              color: "white",
              transition: "transform 0.1s",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
            onClick={handleAddToCart}
            className="px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
          >
            {quantity > 0 ? (
              <>
                <PiMinusCircleFill
                  size={20}
                  className="mr-3 inline-block align-middle z-10"
                  color="white"
                  onClick={handleDecrement}
                />
                {localQuantity}
                <PiPlusCircleFill
                  size={20}
                  className="ml-3 inline-block align-middle z-10"
                  color="white"
                  onClick={handleIncrement}
                />
              </>
            ) : (
              <>
                <PiShoppingCartSimpleLight
                  size={20}
                  className="mr-2 inline-block align-middle"
                  color="white"
                />
                Add to Cart
              </>
            )}
          </div>
          <div
            style={{
              backgroundColor: "#ff9f00",
              color: "white",
              transition: "transform 0.1s",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
            onClick={handleBuyNow}
            className="px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
          >
            <HiMiniCurrencyRupee
              size={20}
              className="mr-2 inline-block align-middle"
              color="white"
            />
            Buy Item
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <CardList
          session={session}
          title="Related Products"
          products={relatedProducts}
        />
      )}
    </div>
  );
};

export default ProductDetail;
