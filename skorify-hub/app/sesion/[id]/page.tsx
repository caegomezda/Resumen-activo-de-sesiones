"use client";

import { useState, useEffect, use } from "react"; // Añadido 'use'
import { supabase } from "@/lib/supabase";
import { 
  Users, Calendar, Mic2, FileText, QrCode, 
  Share2, BarChart3, ChevronLeft 
} from "lucide-react";
import Link from "next/link";

export default function DetalleSesion({ params }: { params: Promise<{ id: string }> }) {
  // 1. Desenvolvemos los params asíncronos
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [sesion, setSesion] = useState<any>(null);
  const [asistentes, setAsistentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      
      // 1. Obtener datos de la sesión
      const { data: sData } = await supabase
        .from("sesiones")
        .select("*")
        .eq("id", id)
        .single();
      
      // 2. Obtener asistentes vinculados a esta sesión
      const { data: aData } = await supabase
        .from("asistencias")
        .select("*")
        .eq("sesion_id", id);

      setSesion(sData);
      setAsistentes(aData || []);
      setLoading(false);
    };

    if (id) {
      cargarDatos();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-[#1A1135] animate-pulse">Cargando ecosistema...</p>
        </div>
      </div>
    );
  }

  if (!sesion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-6">
        <h2 className="text-2xl font-black text-[#1A1135]">SESIÓN NO ENCONTRADA</h2>
        <p className="text-slate-500 mb-6">El ID de sesión no existe o ha sido removido.</p>
        <Link href="/" className="bg-[#1A1135] text-white px-6 py-3 rounded-xl font-bold">
          Volver al Dashboard
        </Link>
      </div>
    );
  }

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
            <span className="text-[10px] font-black bg-orange-100 text-[#FF9900] px-3 py-1 rounded-full uppercase tracking-widest">
              Ficha Técnica de Sesión
            </span>
            <h1 className="text-3xl font-black text-[#1A1135] mt-4 uppercase italic leading-none">
              {sesion.nombre}
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-500"><Calendar size={20}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Fecha</p>
                  <p className="font-bold text-slate-700">{sesion.fecha}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-500"><Mic2 size={20}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Exponentes</p>
                  <p className="font-bold text-slate-700">{sesion.exponentes || "Por asignar"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FileText size={18} className="text-[#FF9900]" /> NOTAS DE LA SESIÓN
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                {sesion.notas_sesion || "No hay notas adicionales para esta sesión."}
              </p>
            </div>
          </div>

          {/* LISTADO DINÁMICO DE ASISTENCIA */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-[#1A1135] flex items-center gap-2">
                <Users size={18} /> ASISTENCIA EN TIEMPO REAL
              </h3>
              <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                {asistentes.length} Registrados
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {asistentes.length > 0 ? (
                    asistentes.map((asistente) => (
                      <tr key={asistente.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700 uppercase">{asistente.nombre_completo}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">
                            {asistente.rol}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-green-500 font-bold text-[10px]">PRESENTE</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic text-sm">
                        Esperando ingresos para esta sesión...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: ACCIONES RÁPIDAS */}
        <div className="space-y-6">
          <div className="bg-[#1A1135] text-white p-6 rounded-3xl shadow-xl border-b-4 border-[#FF9900]">
            <QrCode size={40} className="text-[#FF9900] mb-4" />
            <h3 className="font-bold text-lg mb-2">Check-in Escarapela</h3>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              Activa la cámara para capturar el QR y registrar la asistencia automáticamente.
            </p>
            <button className="w-full bg-white text-[#1A1135] py-3 rounded-xl font-black hover:bg-[#FF9900] transition-all shadow-lg">
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
              <p className="text-xs text-slate-500 italic">Mide el impacto de la sesión según los KPIs del User Group.</p>
              <button className="w-full border-2 border-slate-100 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                VER RESULTADOS
              </button>
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-black transition-all">
                ABRIR FORMULARIO
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}