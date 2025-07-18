import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Target, Lightbulb, Heart } from 'lucide-react';

const Enfoque = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const fourPillars = [
    {
      id: 'alimentacion',
      icon: <User className="w-8 h-8 text-pink-400" />,
      title: 'Alimentación',
      description: 'Nuestra alimentación es el primer paso a trabajar, siendo conscientes de como estamos nutriendo nuestro cuerpo físico.'
    },
    {
      id: 'mente',
      icon: <Lightbulb className="w-8 h-8 text-pink-400" />,
      title: 'Nuestra Mente',
      description: 'Entender que nuestros pensamientos, generan sentimientos, y estos generan emociones que son parte de nuestra nutrición.'
    },
    {
      id: 'interior',
      icon: <Target className="w-8 h-8 text-pink-400" />,
      title: 'Nutrir tu Interior',
      description: 'Somos nuestra propia medicina, solo debemos redescubrir nuestro interior y aprender a nutrirlo.'
    },
    {
      id: 'acompanamiento',
      icon: <Heart className="w-8 h-8 text-pink-400" />,
      title: 'Acompañamiento',
      description: 'Debemos ser soberanos de nuestra vida. Te acompaño en el proceso de comenzar tu camino de autodescubrimiento.'
    }
  ];

  const expandableThemes = [
    {
      id: 'coaching',
      title: 'Coaching',
      content: 'El coaching holístico es un enfoque integral de acompañamiento personal y profesional que considera a la persona en su totalidad, abarcando no solo sus metas y desafíos específicos, sino también su bienestar emocional, mental, físico y espiritual. A diferencia de otros tipos de coaching que pueden centrarse únicamente en objetivos concretos, como el coaching ejecutivo o el coaching de vida, el coaching holístico busca un equilibrio armonioso entre todas las áreas de la vida del individuo.'
    },
    {
      id: 'alimentacion-consciente',
      title: 'Alimentación Consciente',
      content: 'La alimentación consciente es un enfoque que va más allá de simplemente elegir alimentos saludables. Se trata de desarrollar una relación consciente y equilibrada con la comida, entendiendo cómo nuestras elecciones alimentarias afectan no solo nuestro cuerpo físico, sino también nuestro estado emocional y mental. Implica estar presente durante las comidas, escuchar las señales de nuestro cuerpo y comprender los patrones emocionales que influyen en nuestros hábitos alimentarios.'
    },
    {
      id: 'pensamiento-consciente',
      title: 'Pensamiento Consciente',
      content: 'El pensamiento consciente se refiere a la práctica de observar y dirigir nuestros pensamientos de manera intencional. Reconocemos que nuestros pensamientos crean nuestras emociones, que a su vez influyen en nuestras acciones y resultados. A través de técnicas de mindfulness, meditación y autoobservación, aprendemos a identificar patrones de pensamiento limitantes y a cultivar una mentalidad más positiva y constructiva que apoye nuestro bienestar integral.'
    },
    {
      id: 'area-espiritual',
      title: 'Área Espiritual',
      content: 'El área espiritual abarca nuestra conexión con algo más grande que nosotros mismos, ya sea a través de prácticas religiosas, conexión con la naturaleza, meditación, o simplemente el cultivo de valores y propósito en la vida. Esta dimensión espiritual es fundamental para el bienestar integral, ya que proporciona sentido, dirección y paz interior. No se trata de seguir una doctrina específica, sino de explorar y nutrir aquello que nos conecta con nuestro ser más auténtico y con el mundo que nos rodea.'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-pink-50 to-gray-50 py-20 flex items-center">
        <div className="max-w-6xl mx-auto px-4 text-center w-full">
          <h1 className="text-5xl font-bold text-gray-900 animate-in fade-in slide-in-from-bottom-4 duration-800">
            Pasos al Equilibrio
          </h1>
        </div>
      </div>

      {/* Main Diagram Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por donde empezamos...</h2>
            <p className="text-lg text-gray-600">Somos Cuerpo, Mente y Espíritu.</p>
          </div>
          
          <div className="relative min-h-[600px] flex items-center justify-center">
            {/* Left Column - First Two Pillars */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-16 w-80">
              {fourPillars.slice(0, 2).map((pillar, index) => (
                <div
                  key={pillar.id}
                  className="text-center animate-in fade-in slide-in-from-left duration-800"
                >
                  <div className="flex justify-center mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Center Column - Central Image */}
            <div className="flex justify-center mx-auto">
              <img 
                src="/src/assets/enfoque.png" 
                alt="Pasos al Equilibrio" 
                className="w-96 h-auto max-w-full object-contain animate-in fade-in scale-in duration-1000"
              />
            </div>

            {/* Right Column - Last Two Pillars */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-16 w-80">
              {fourPillars.slice(2, 4).map((pillar, index) => (
                <div
                  key={pillar.id}
                  className="text-center animate-in fade-in slide-in-from-right duration-800"
                >
                  <div className="flex justify-center mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Themes Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">De que se trata.</h2>
            <p className="text-lg text-gray-600">Algunos aspectos que trabajamos como acompañante.</p>
          </div>

          <div className="space-y-4">
            {expandableThemes.map((theme) => (
              <div
                key={theme.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleSection(theme.id)}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 text-left">
                    {theme.title}
                  </h3>
                  <div className="flex-shrink-0 ml-4">
                    {expandedSection === theme.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>
                
                {expandedSection === theme.id && (
                  <div className="px-6 py-4 bg-white animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-gray-600 leading-relaxed">
                      {theme.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enfoque;