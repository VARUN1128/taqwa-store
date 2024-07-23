import React, { useEffect } from "react";
import { TopProductDetail } from "../../components/TopPageDetail";
import { useLocation } from "react-router-dom";
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

const Slideshow = ({ slideImages }) => {
  return (
    <div className="slide-container">
      <Slide>
        {slideImages.map((slideImage, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-center bg-cover h-96 w-[96%] mx-auto rounded-lg bg-center bg-no-repeat mt-4"
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

  const rating = 4.5;
  const location = useLocation();
  const { productId } = useParams();

  const handleCopy = () => {
    const url = window.location.origin + location.pathname;
    navigator.clipboard.writeText(url);
    toast("Link copied to clipboard!");
  };
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
      setIsLoading(false);

      const fetchRelatedProducts = async () => {
        const { data: relatedData, error } = await supabase
          .from("products")
          .select("*")
          .limit(10)
          .order("category", { ascending: true })
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
          randomProducts.push(relatedData[randomIndex]);
          relatedData.splice(randomIndex, 1);
        }

        setRelatedProducts(randomProducts);
      };

      fetchRelatedProducts();
    };

    fetchProduct();
  }, [productId]);

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
      <TopProductDetail title={product.name} onCopy={handleCopy} />
      <ToastContainer />

      <div className="product-detail">
        {product.images.length === 1 ? (
          <img
            src={product.images[0]}
            alt=""
            className="w-[96%] m-auto rounded-lg mt-4 mb-3 h-96 object-cover"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            }}
          />
        ) : (
          <Slideshow slideImages={product.images} />
        )}

        <div className="product-details mt-1 w-full p-4 ">
          <div className="flex justify-between mb-3">
            <p className="text-2xl ">{product.name}</p>
            <Like size="2em" />
          </div>
          <p
            style={{
              color: "#FE3A30",
            }}
            className="mt-1 mb-3 text-lg"
          >
            ₹ {product.price}
          </p>
          <span className="block mt-1 text-yellow-500">
            {Array(Math.round(rating))
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
        <div className="product-action justify-center items-center  w-full flex m-auto gap-3">
          <span
            style={{
              backgroundColor: "#FE3A30",
              color: "white",
            }}
            className="px-10 py-5 cursor-pointer rounded-lg font-bold"
          >
            Add to Cart
          </span>
          <span
            style={{
              backgroundColor: "#3669C9",
              color: "white",
            }}
            className="px-10 py-5 cursor-pointer rounded-lg font-bold"
          >
            Buy Item
          </span>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <CardList title="Related Products" products={relatedProducts} />
      )}
    </div>
  );
};

export default ProductDetail;
