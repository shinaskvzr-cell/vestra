import React from 'react'
import { useNavigate } from 'react-router-dom';
import bgImg from "../../../../assets/bgImg.jpg";
import Button from '../../../../components/button/Button';

function NewArrival() {

    const navigate = useNavigate();

    function handleShopNow() {
        navigate("/shop");
    }

    return (
        <div>
            <div className="relative h-screen flex items-center justify-center">
                {/* Blurred Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xs"
                    style={{ backgroundImage: `url(${bgImg})` }}
                ></div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content */}
                <div className="relative z-10 text-center text-white px-6">
                    <p className="text-sm uppercase tracking-widest">New Arrivals</p>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mt-2">
                        THE NEW <br /> 2025/26 JERSEYS
                    </h1>

                    {/* <p className="mt-4 text-lg font-medium">
          Get <span className="font-bold">10% OFF</span> for your first order
        </p> */}

                    {/* <button onClick={handleShopNow} className="mt-6 bg-white text-black px-8 py-3 font-semibold rounded-md shadow-lg hover:bg-gray-200 transition">
                        Shop Now
                    </button> */}
                    <Button className='mt-6' onClick={handleShopNow} variant='ghost' sizes='medium'>Shop Now</Button>
                </div>
            </div>
        </div>
    )
}


export default NewArrival