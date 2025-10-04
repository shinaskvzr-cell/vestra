import React from "react";
import Footer from "../../../../components/footer/Footer";
import ProductDetail from "../../../ProductDetail";
import Button from "../../../../components/button/Button";
import NewArrival from "./NewArrival"; 
import ShopByLeague from "./ShopByLeague";
import MostSelling from "./MostSelling";
import VestraFeatures from "./VestraFeatures";

function Home() {
  return (
    <div>
       {/* <Button variant="outline">Outline Button</Button> */}
      {/* <NewArrival /> */}
      
      <NewArrival/>
      <ShopByLeague/>
      <MostSelling/>
      <VestraFeatures/>
      <Footer/>
    </div>
  );
}

export default Home;
