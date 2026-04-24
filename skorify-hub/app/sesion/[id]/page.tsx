"use client";

import { useState, useEffect, use } from "react"; // Importamos 'use'
import { supabase } from "@/lib/supabase";
import { 
  Users, Calendar, Mic2, FileText, QrCode, 
  Share2, BarChart3, ChevronLeft 
} from "lucide-react";
import Link from "next/link";

export default function DetalleSesion({ params }: { params: Promise<{ id: string }> }) {
  // Desenvolvemos los params usando el hook 'use'
  const { id } = use(params); 
  
  const [sesion, setSesion] = useState<any>(null);
  const [asistentes, setAsistentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      // 1. Obtener datos de la sesión usando el id ya desenvuelto
      const { data: sData } = await supabase
        .from("sesiones")
        .select("*")
        .eq("id", id)
        .single();
      
      // 2. Obtener asistentes en tiempo real
      const { data: aData } = await supabase
        .from("asistencias")
        .select("*")
        .eq("sesion_id", id);

      setSesion(sData);
      setAsistentes(aData || []);
      setLoading(false);
    };
    
    if (id) cargarDatos();
  }, [id]); // Dependemos del id desenvuelto

  if (loading) return <div className="p-10 text-center font-bold text-[#1A1135]">Cargando ecosistema...</div>;

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      {/* NAVBAR DE CONTROL */}
      <nav className="bg-[#1A1135] text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
            <ChevronLeft size={16} /> Volver al Dashboard
          </Link>
          <div className="flex gap-4">
            <button className="bg-[#FF9900] text-[#1A1135] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all">
              <Share2 size={14} /> COMPARTIR EVALUACIÓN
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: INFORMACIÓN TÉCNICA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-black bg-orange-100 text-[#FF9900] px-3 py-1 rounded-full uppercase tracking-tighter">
              Ficha Técnica de Sesión
            </span>
            <h1 className="text-3xl font-black text-[#1A1135] mt-4 uppercase italic">
              {sesion?.nombre}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-500"><Calendar size={20}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Fecha</p>
                  <p className="font-bold text-slate-700">{sesion?.fecha}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-500"><Mic2 size={20}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Exponentes</p>
                  <p className="font-bold text-slate-700">{sesion?.exponentes || "Por asignar"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FileText size={18} className="text-[#FF9900]" /> NOTAS DE LA SESIÓN
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                {sesion?.notas_sesion || "No hay notas adicionales para esta sesión."}
              </p>
            </div>
          </div>

          {/* LISTADO DINÁMICO DE ASISTENCIA */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-[#1A1135] flex items-center gap-2 uppercase text-sm">
                <Users size={18} className="text-[#FF9900]" /> Asistencia en tiempo real
              </h3>
              <span className="bg-green-100 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                {asistentes.length} Registrados
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Nombre del Asistente</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {asistentes.length > 0 ? (
                    asistentes.map((asistente) => (
                      <tr key={asistente.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">{asistente.nombre_completo}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">
                            {asistente.rol}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <button className="text-[10px] font-bold text-[#FF9900] hover:underline">VER DETALLE</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic text-xs">
                        Esperando ingresos... proyecta el QR para iniciar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: QR & EVALUACIÓN */}
        <div className="space-y-6">
          <div className="bg-[#1A1135] text-white p-6 rounded-3xl shadow-xl border-b-4 border-[#FF9900]">
            <QrCode size={40} className="text-[#FF9900] mb-4" />
            <h3 className="font-bold text-lg mb-2 uppercase">Check-in Escarapela</h3>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              Utiliza la cámara para validar la entrada de los asistentes de forma automática.
            </p>
            <button className="w-full bg-white text-[#1A1135] py-3 rounded-xl font-black hover:bg-[#FF9900] transition-all text-xs uppercase">
              ESCANEAR QR
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 text-[#FF9900] rounded-lg">
                <BarChart3 size={20} />
              </div>
              <h3 className="font-bold text-slate-800 uppercase text-sm tracking-tight">Evaluación</h3>
            </div>
            <div className="space-y-4">
              <p className="text-[11px] text-slate-500 leading-normal">
                Genera el enlace para que los asistentes califiquen la sesión y el desempeño del exponente.
              </p>
              <button className="w-full border-2 border-slate-100 py-3 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                CONFIGURAR FORMULARIO
              </button>
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-bold hover:bg-black transition-all">
                VER DASHBOARD DE RESULTADOS
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}