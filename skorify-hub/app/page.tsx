"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Importado para la navegación
import { PlusCircle, FileText, ClipboardList, ShieldCheck, ExternalLink, Calendar } from "lucide-react";
// Importamos el cliente de supabase que configuramos en lib/supabase.ts
import { supabase } from "@/lib/supabase"; 

// URL del Drive para vinculación directa
const DRIVE_URL = "https://drive.google.com/drive/u/2/folders/1TpKHXi43RQi0CjB_gRo_1Y9qPFl1PVoz";

export default function SkorifyDashboard() {
  const [showForm, setShowForm] = useState(false);
  // Nuevo estado para el formulario de creación de sesión
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // NUEVO: Estado para almacenar las sesiones reales de la base de datos
  const [sesiones, setSesiones] = useState<any[]>([]);

  // NUEVO: Cargar sesiones desde Supabase al iniciar
  useEffect(() => {
    fetchSesiones();
  }, []);

  const fetchSesiones = async () => {
    const { data, error } = await supabase
      .from("sesiones")
      .select("*")
      .order("fecha", { ascending: false });
    
    if (!error && data) {
      setSesiones(data);
    }
  };

  // Función para crear la sesión en Supabase
  const handleCreateSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const nombreSesion = formData.get("nombre_sesion");
    const fechaSesion = formData.get("fecha");

    const { data, error } = await supabase
      .from("sesiones")
      .insert([
        { 
          nombre: nombreSesion, 
          fecha: fechaSesion,
          link_drive: DRIVE_URL,
          estado: "planificada"
        }
      ])
      .select(); // Seleccionamos el resultado para obtener el ID

    if (error) {
      alert("Error al crear sesión: " + error.message);
    } else {
      const nuevaSesion = data[0];
      // Redirigimos al panel administrativo de la sesión creada
      window.location.href = `/sesion/${nuevaSesion.id}`;
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] font-sans antialiased text-slate-900">
      
      {/* HEADER INSTITUCIONAL CON MEMBRETE REAL */}
      <header className="relative bg-[#1A1135] overflow-hidden min-h-[160px]">
        {/* Imagen de fondo (Curva del documento) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-40 pointer-events-none">
            <Image 
              src="/header-curve.png" 
              alt="Curve Background" 
              fill
              className="object-right-top object-contain"
            />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto p-6 flex flex-col md:flex-row justify-between items-center md:items-end h-full">
          <div className="flex items-center gap-6">
            {/* Logo Hexagonal de Manizales - AGREGADO SEGÚN DOCUMENTO */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full p-2 backdrop-blur-sm border border-white/10">
              <Image 
                src="/logo-mzl.png" 
                alt="AWS User Group Manizales Logo" 
                fill
                className="object-contain p-2"
                // AÑADE ESTA LÍNEA:
                sizes="(max-width: 768px) 80px, 96px"
                loading="eager"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                AWS USER GROUP
              </h1>
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 bg-[#FF9900]"></span>
                <p className="text-[#FF9900] text-sm md:text-base font-bold tracking-[0.2em] uppercase">
                  Manizales, Colombia
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 text-center md:text-right text-white/90 border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-6">
            <p className="text-lg font-semibold text-[#FF9900]">Skorify</p>
            <p className="text-sm opacity-80 uppercase tracking-wider">Manizales 2026</p>
            <p className="text-xs opacity-60 mt-1">AWS</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* PANEL DE ACCIÓN - COMITÉ LOGÍSTICA */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-3">
              <PlusCircle size={20} className="text-[#FF9900]" /> 
              Comité de Logística
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowCreateSession(true)}
                className="w-full bg-[#1A1135] text-white py-3 rounded-xl font-bold hover:bg-[#2D1F5D] transition-all flex justify-center items-center gap-2 border-b-4 border-orange-500"
              >
                <Calendar size={18} />
                Crear Nueva Sesión
              </button>

              <button 
                onClick={() => setShowForm(true)}
                className="w-full bg-[#FF9900] text-[#1A1135] py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-md shadow-orange-200 flex justify-center items-center gap-2"
              >
                Abrir Registro Digital
              </button>
              
              <button 
                onClick={() => window.open(DRIVE_URL, '_blank')}
                className="w-full bg-slate-50 border border-slate-200 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-all flex justify-center items-center gap-2"
              >
                <ExternalLink size={16} />
                Notas de Eventos (Drive)
              </button>
            </div>
          </div>

          {/* HABEAS DATA COMPLIANCE  */}
          <div className="bg-[#EBF5FF] p-5 rounded-2xl border border-blue-100 flex gap-4">
            <div className="bg-blue-500/10 p-2 rounded-lg h-fit text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-900 uppercase">Habeas Data</p>
              <p className="text-[10px] leading-relaxed text-blue-700">
                Cumple con la Ley 1581 de 2012. Los datos serán usados para carnetización y organización de eventos. 
              </p>
            </div>
          </div>
        </div>

        {/* TRAZABILIDAD - HISTORIAL */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList size={18} className="text-slate-400" />
                Trazabilidad de Sesiones
              </h3>
              <span className="text-[10px] font-bold bg-[#1A1135] text-white px-3 py-1 rounded-full uppercase tracking-widest">
                Enfoque en Calidad
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {sesiones.length > 0 ? (
                sesiones.map((sesion, index) => (
                  <Link key={sesion.id} href={`/sesion/${sesion.id}`} className="block hover:bg-slate-50 transition-colors">
                    <div className="p-6 flex justify-between items-center">
                      <div className="flex gap-5 items-center">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF9900] font-bold">
                          #{String(sesiones.length - index).padStart(2, '0')}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{sesion.nombre}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            {sesion.fecha} • Universidad Nacional
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#FF9900] bg-orange-50 px-4 py-2 rounded-lg">
                        <FileText size={14} />
                        Gestionar
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="p-10 text-sm text-slate-400 italic text-center w-full">No hay sesiones registradas aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PARA CREAR NUEVA SESIÓN (NUEVA FUNCIONALIDAD) */}
      {showCreateSession && (
        <div className="fixed inset-0 bg-[#1A1135]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-t-8 border-[#FF9900]">
            <h2 className="text-xl font-black text-[#1A1135] mb-2 uppercase">Planear Sesión</h2>
            <p className="text-xs text-slate-500 mb-6 italic">Garantizando la trazabilidad técnica según objetivos de logística.</p>
            
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre del Encuentro</label>
                <input name="nombre_sesion" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FF9900]" placeholder="Ej. Sesión #7 - Workshop IoT" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha Programada</label>
                <input name="fecha" type="date" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FF9900]" required />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowCreateSession(false)} className="flex-1 py-3 font-bold text-slate-400">CANCELAR</button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#FF9900] text-[#1A1135] py-3 rounded-xl font-bold shadow-lg disabled:opacity-50">
                  {loading ? "GUARDANDO..." : "CONFIRMAR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRO ORIGINAL */}
      {showForm && (
        <div className="fixed inset-0 bg-[#1A1135]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-100">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-[#1A1135]">REGISTRO DE SESIÓN</h2>
                <p className="text-sm text-slate-500 font-medium">Completa tus datos para el carnet </p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-slate-300 hover:text-slate-500 text-2xl font-light">×</button>
            </div>
            
            <form className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nombre Completo</label>
                <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none transition-all" placeholder="Ej. Camilo Gomez" required />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Rol en la Comunidad</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none">
                  <option>Estudiante</option>
                  <option>Profesional</option>
                  <option>Speaker</option>
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 mt-6">
                <input type="checkbox" className="mt-1 w-4 h-4 accent-[#FF9900]" required />
                <p className="text-[10px] leading-tight text-slate-500 italic">
                  Autorizo el tratamiento de mis datos personales según la Política de Privacidad del AWS UG Manizales y la Ley 1581. 
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all">
                  CANCELAR
                </button>
                <button type="submit" className="bg-[#1A1135] text-white py-3 rounded-xl font-bold hover:bg-[#2D1F5D] transition-all shadow-lg shadow-purple-100">
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}