import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contacto = () => {
  return (
    <div className="pt-28 min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-800">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
          <p className="text-xl text-gray-600">
            Ponte en contacto para comenzar tu camino hacia el bienestar
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8 animate-in fade-in slide-in-from-left-6 duration-1000">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Envíame un mensaje
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300"
                  placeholder="Cuéntame cómo puedo ayudarte..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 px-6 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-1000">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="text-pink-400" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-600">af.salud.integrativa@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="text-pink-400" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800">Teléfono</p>
                    <p className="text-gray-600">+1 (813) 564-1016</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="text-pink-400" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800">Ubicación</p>
                    <p className="text-gray-600">Tampa, Florida</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Horarios de Atención
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>Lunes - Viernes: 9:00 - 18:00</p>
                <p>Sábados: 10:00 - 14:00</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;