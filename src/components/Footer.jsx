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
        <footer className="py-7 px-6 flex flex-col md:flex-row justify-center items-stretch gap-10 bg-gray-100">
            {/* Localização */}
            <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-200">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#F6BE00] to-[#F6BE70]/70 shadow-md">
                    <img src={locationIcon} alt="Localização" className="w-14 h-14" />
                </div>
                <p className="text-center font-semibold text-gray-700 mt-4 text-lg">
                    Rua Dr. José Pinto Rebelo Júnior, 91<br />Matinhos - PR, 83260-000
                </p>
            </div>

            {/* Telefone */}
            <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-200">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#F6BE00] to-[#F6BE70]/70 shadow-md">
                    <img src={phoneIcon} alt="Telefone" className="w-14 h-14" />
                </div>
                <button
                    className="mt-4 text-center font-semibold text-gray-700 text-lg underline hover:text-[#F6BE00] transition-colors"
                    onClick={callPhone}
                >
                    (41) 3452-8800
                </button>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-200">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#F6BE00] to-[#F6BE70]/70 shadow-md">
                    <img src={emailIcon} alt="Email" className="w-14 h-14" />
                </div>
                <button
                    className="mt-4 text-center font-semibold text-gray-700 text-lg hover:text-[#F6BE00] transition-colors"
                    onClick={openEmail}
                >
                    relacionamento.caioba@sescpr.com.br
                </button>
            </div>
        </footer>
    );
}
