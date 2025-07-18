import React from 'react';
import fondo from '../assets/fondo.png';
import AFtherapy from '../assets/AFtherapy.png';
import AFpeople from '../assets/AFpeople.png';
import AFchairs from '../assets/AFchairs.png';
import AFcuadros4 from '../assets/AFcuadros4.jpg';
import AFfoto from '../assets/AFfoto.jpg';

const Inicio = () => {
  return (
    <div className="relative">
      {/* Hero Section with Background */}
      <div 
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${fondo})`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Buscas equilibrio para tu vida?
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Bienvenido a AF Salud Integrativa, donde tu bienestar integral es nuestra prioridad. En este espacio, te invitamos a poner el foco en ti mismo, a explorar tu mundo interior y a descubrir cómo puede transformar tu realidad exterior.
            </p>
            <div className="space-x-4">
              <button className="bg-pink-400 hover:bg-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Comenzar Ahora
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Saber Más
              </button>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Diferentes maneras de acompañarte
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Individual Sessions */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 bg-cover bg-center" style={{backgroundImage: `url(${AFtherapy})`}}>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sesiones Individuales
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sesiones virtuales, en la comodidad de tu hogar o desde el lugar donde te encuentres, disponibles vía Zoom.
                </p>
              </div>
            </div>

            {/* Group Consultation */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 bg-cover bg-center" style={{backgroundImage: `url(${AFpeople})`}}>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Consulta Grupal
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Estas ofrecen una oportunidad única para embarcarse en un viaje de salud y bienestar junto a otras personas con intereses similares.
                </p>
              </div>
            </div>

            {/* Workshops */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 bg-cover bg-center" style={{backgroundImage: `url(${AFchairs})`}}>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Talleres
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Talleres virtuales o presenciales que comparten información específica destinada a generar cambios duraderos.
                </p>
              </div>
            </div>

            {/* Art Therapy */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 bg-cover bg-center" style={{backgroundImage: `url(${AFcuadros4})`}}>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Arte Terapia
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Utilizando piedras, cristales, colores y resina epóxica, creando espacios de conexión con la belleza, la esperanza, la creatividad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <div className="py-20 bg-pink-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Sobre Mí
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Ana's Photo */}
            <div className="flex-shrink-0">
              <div className="w-80 h-80 rounded-full overflow-hidden shadow-2xl">
                <img 
                  src={AFfoto} 
                  alt="Ana Franco" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Ana's Story */}
            <div className="flex-1 text-gray-700 leading-relaxed">
              <p className="text-lg mb-4">
                Mi camino hacia la nutrición holística comenzó con un diagnóstico de hepatitis autoinmune, un desafío que transformó por completo mi vida. Este momento crucial me llevó a cuestionar profundamente mi forma de vivir y a buscar alternativas que no solo mejoraran mi salud física, sino también mi bienestar emocional y espiritual.
              </p>
              <p className="text-lg mb-4">
                Fue entonces cuando descubrí el poder transformador de la alimentación consciente y la importancia de mirar hacia mi interior para identificar aquellas carencias nutricionales que iban más allá del plano físico, llegando hasta el alma. Comprendí que no nos nutrimos únicamente de los alimentos que consumimos, sino de todo lo que nos rodea: nuestras emociones, relaciones, hábitos y pensamientos.
              </p>
              <p className="text-lg mb-4">
                Este viaje hacia una vida más plena me impulsó a explorar diversas herramientas de sanación integral, abriendo puertas hacia respuestas que resonaban con mi cuerpo y mi espíritu. Hoy, siento una gratitud infinita hacia mi cuerpo, especialmente hacia mi hígado, por haber sido el maestro que me despertó a un mundo de sabiduría interior.
              </p>
              <p className="text-lg">
                Esta experiencia me mostró que incluso en los momentos más oscuros, el cuerpo puede ser un faro de luz, guiándonos hacia un mayor entendimiento de nosotros mismos. Gracias a este proceso de transformación y aprendizaje, me formé como Coach de Nutrición Integrativa para acompañar a otros en sus propios caminos de sanación y autodescubrimiento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Conociéndonos
            </h2>
            <p className="text-lg text-gray-600">
              Nuestro equilibrio interno, solo depende de nuestro trabajo personal.
            </p>
          </div>
          
          <blockquote className="text-3xl md:text-4xl font-bold text-gray-900 leading-relaxed italic mb-8">
            "La reconciliación inicia en el alma, y la alcanzamos con una mirada humilde y espiritual."
          </blockquote>
          
          <div className="w-24 h-1 bg-pink-400 mx-auto"></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            Afsaludintegrativa 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;