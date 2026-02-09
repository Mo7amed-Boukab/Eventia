import React from 'react';
import { Star } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '@/lib/constants';

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'serif' }}>
            Retours <span className="text-[#C5A059] italic">Participants</span>
          </h2>
          <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold">L'impact de nos événements sur votre carrière</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="bg-[#F8F8F8] p-10 rounded relative border border-transparent hover:border-[#C5A059]/20 transition-all group">
              <div className="flex gap-1 mb-8">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#C5A059] text-[#C5A059]" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-10 leading-relaxed font-light text-lg">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 border-t border-gray-200 pt-8">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'serif' }}>{testimonial.name}</h4>
                  <p className="text-[10px] text-[#C5A059] uppercase tracking-widest font-bold">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
