import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import seta from "../assets/seta.png";
import locationIcon from "../assets/location.png";
import phoneIcon from "../assets/phone.png";
import emailIcon from "../assets/email.png";


const BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET || 'perfil_fotos';

export default function Contato() {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function verificarLogin() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate("/TelaCadastrar");
            } else {
                const { data: perfilData, error } = await supabase
                    .from("perfil")
                    .select("*")
                    .eq("id_user", user.id)
                    .single();

                if (!error) {
                    setUsuario({ ...user, ...perfilData });
                } else {
                    setUsuario({ ...user, nome: user.email });
                }

                buscarPedidosLocais(user.id);
            }
        }
        verificarLogin();
    }, [navigate]);

    const handleSair = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Erro ao sair:", error.message);
        else navigate("/TelaCadastrar");
    };

    const goBack = () => {
        if (navigation && navigation.goBack) {
            navigation.goBack();
        } else {
            window.history.back();
        }
    };

    const openEmail = () => {
        window.location.href = "mailto:relacionamento.caioba@sescpr.com.br";
    };
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header usuario={usuario} handleSair={handleSair} />
            <div className="min-h-screen bg-yellow-400 flex flex-row items-center justify-center p-5 relative">
                <button
                    onClick={goBack}
                    className="absolute top-5 left-5 bg-transparent border-none cursor-pointer"
                >
                    <img src={seta} alt="Voltar" className="w-10 h-10 object-contain" />
                </button>

                <div className="flex flex-col items-center my-5">
                    <img src={locationIcon} alt="Localização" className="w-44 h-44 object-contain mb-2" />
                    <p className="text-white font-bold text-center w-64">
                        Rua Dr. José Pinto Rebelo Júnior, 91, Matinhos - PR, 83260-000
                    </p>
                </div>

                <div className="flex flex-col items-center my-5">
                    <img src={phoneIcon} alt="Telefone" className="w-44 h-44 object-contain mb-2" />
                    <p
                        className="text-white font-bold text-center w-64 underline cursor-pointer"
                        onClick={() => (window.location.href = "tel:+554134528800")}
                    >
                        (41) 3452-8800
                    </p>
                </div>

                <div className="flex flex-col items-center my-5">
                    <img src={emailIcon} alt="Email" className="w-44 h-44 object-contain mb-2" />
                    <p
                        className="text-white font-bold text-center w-64 cursor-pointer"
                        onClick={openEmail}
                    >
                        relacionamento.caioba@sescpr.com.br
                    </p>
                </div>
            </div>
        </div>
    );
}
