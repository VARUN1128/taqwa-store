import React, { useContext, useEffect, useState } from "react";
import TopPageDetail from "../../components/TopPageDetail";
import { CardList } from "../Landing/Landing";
import { SessionContext } from "../../components/SessionContext";
import supabase from "../../supabase";
import NoWish from "../../images/no_wish.svg";
import Clock from "../../components/clock";

export default function Wishlist() {
  const { session } = useContext(SessionContext);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", session.user.id);
      if (wishlistError) {
        console.log(wishlistError);
      } else {
        const productIds = wishlistData.map((item) => item.product_id);
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")

          .in("id", productIds);
        if (productError) {
          console.log(productError);
        } else {
          setWishlist(productData);
        }
      }
      setIsLoading(false);
    };
    fetchWishlist();
  }, [session.user.id]);

  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[10em]">
      <TopPageDetail title="Wishlist" />
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Clock />
        </div>
      ) : wishlist.length === 0 ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-600 text-center mt-10">
            Your wishlist is empty !
          </h2>
          <div className="flex justify-center items-center h-full">
            <img src={NoWish} alt="No Wishlist" className="w-1/2" />
          </div>
        </>
      ) : (
        <CardList title="Your Wishlist" session={session} products={wishlist} />
      )}
    </div>
  );
}
