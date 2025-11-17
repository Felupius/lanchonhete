import React from "react";
import locationIcon from "../assets/location.png";
import phoneIcon from "../assets/phone.png";
import emailIcon from "../assets/email.png";

export default function Footer() {
    const openEmail = () => {
        window.location.href = "mailto:relacionamento.caioba@sescpr.com.br";
    };

    const callPhone = () => {
        window.location.href = "tel:+554134528800";
    };

    return (
        <footer className="bg-[#F6BE00] py-16 px-5 flex flex-col md:flex-row justify-around items-stretch gap-8">
            {/* Localização */}
            <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-[#F6BE00]/50 transition-all duration-500 transform hover:-translate-y-2">
                <div className="p-4 rounded-full bg-gradient-to-tr from-[#F6BE00] via-[#F6BE00]/80 to-[#F6BE00] animate-pulse">
                    <img src={locationIcon} alt="Localização" className="w-12 h-12" />
                </div>
                <p className="text-center font-semibold text-white mt-4 text-base md:text-lg">
                    Rua Dr. José Pinto Rebelo Júnior, 91<br />Matinhos - PR, 83260-000
                </p>
            </div>

            {/* Telefone */}
            <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-[#002D85]/50 transition-all duration-500 transform hover:-translate-y-2">
                <div className="p-4 rounded-full bg-gradient-to-tr from-[#002D85] via-[#002D85]/80 to-[#002D85] animate-pulse">
                    <img src={phoneIcon} alt="Telefone" className="w-12 h-12" />
                </div>
                <button
                    className="mt-4 text-center font-semibold text-white text-base md:text-lg underline hover:text-[#002D85] transition-colors"
                    onClick={callPhone}
                >
                    (41) 3452-8800
                </button>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-[#F6BE00]/50 transition-all duration-500 transform hover:-translate-y-2">
                <div className="p-4 rounded-full bg-gradient-to-tr from-[#F6BE00] via-[#F6BE00]/80 to-[#F6BE00] animate-pulse">
                    <img src={emailIcon} alt="Email" className="w-12 h-12" />
                </div>
                <button
                    className="mt-4 text-center font-semibold text-white text-base md:text-lg hover:text-[#F6BE00] transition-colors"
                    onClick={openEmail}
                >
                    relacionamento.caioba@sescpr.com.br
                </button>
            </div>
        </footer>
    );
}
