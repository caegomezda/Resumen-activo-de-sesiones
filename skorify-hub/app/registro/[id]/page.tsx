"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RegistroAsistencia({ params }: { params: { id: string } }) {
  const [sesion, setSesion] = useState<any>(null);
  const [enviado, setEnviado] = useState(false);

  // 1. Validar que la sesión existe
  useEffect(() => {
    const checkSesion = async () => {
      const { data } = await supabase
        .from("sesiones")
        .select("nombre, fecha")
        .eq("id", params.id)
        .single();
      if (data) setSesion(data);
    };
    checkSesion();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Guardamos en una tabla de 'asistencias' vinculada al ID de la sesión
    const { error } = await supabase.from("asistencias").insert([{
      sesion_id: params.id,
      nombre_completo: formData.get("nombre"),
      rol: formData.get("rol"),
      email: formData.get("email")
    }]);

    if (!error) setEnviado(true);
  };

  if (enviado) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6">
      <div className="text-center space-y-4">
        <CheckCircle2 size={64} className="text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold">¡Registro Exitoso!</h1>
        <p className="text-slate-500">Gracias por asistir a {sesion?.nombre}</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#1A1135] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-xl font-black text-[#1A1135] uppercase">Registro de Asistencia</h2>
        <p className="text-sm text-[#FF9900] font-bold mb-6">{sesion?.nombre || "Cargando..."}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nombre" placeholder="Nombre Completo" className="w-full border p-3 rounded-xl" required />
          <input name="email" type="email" placeholder="Correo Electrónico" className="w-full border p-3 rounded-xl" required />
          <select name="rol" className="w-full border p-3 rounded-xl">
            <option>Estudiante</option>
            <option>Profesional</option>
            <option>Speaker</option>
          </select>

          <div className="bg-blue-50 p-3 rounded-xl flex gap-3">
            <ShieldCheck className="text-blue-600" size={20} />
            <p className="text-[10px] text-blue-800">Acepto el tratamiento de datos (Ley 1581).</p>
          </div>

          <button type="submit" className="w-full bg-[#FF9900] text-[#1A1135] py-4 rounded-xl font-bold shadow-lg">
            CONFIRMAR ASISTENCIA
          </button>
        </form>
      </div>
    </main>
  );
}