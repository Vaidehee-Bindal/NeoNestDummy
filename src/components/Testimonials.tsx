import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'New Mother',
    image: 'https://images.unsplash.com/photo-1588869715763-2c42a7bf493c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMG1vdGhlciUyMHRlc3RpbW9uaWFsfGVufDF8fHx8MTc1NjY0MjAzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    content: 'NeoNest was a lifesaver during my first weeks with my baby. The caregiver was incredibly knowledgeable and helped me feel confident as a new mom. The AI assistant was available 24/7 for all my questions.',
    rating: 5,
    location: 'San Francisco, CA',
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    role: 'Certified Caregiver',
    image: 'https://images.unsplash.com/photo-1741880295779-c23238450dc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYXJlZ2l2ZXIlMjB3b21hbnxlbnwxfHx8fDE3NTY2MjQzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    content: 'Working with NeoNest has been incredibly fulfilling. I love being able to support new mothers during such an important time. The platform makes it easy to connect with families and provide the care they need.',
    rating: 5,
    location: 'Austin, TX',
  },
  {
    id: 3,
    name: 'Jennifer Park',
    role: 'Mother of Two',
    image: 'https://images.unsplash.com/photo-1730130596425-197566414dc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwbmV3JTIwbW90aGVyfGVufDF8fHx8MTc1NjY0MjAzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    content: 'The premium care package was worth every penny. Having a dedicated caregiver helped me recover faster and bond better with my second child. The meal prep service was amazing too!',
    rating: 5,
    location: 'Seattle, WA',
  },
  {
    id: 4,
    name: 'Emily Thompson',
    role: 'First-time Mother',
    image: 'https://images.unsplash.com/photo-1588869715763-2c42a7bf493c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMG1vdGhlciUyMHRlc3RpbW9uaWFsfGVufDF8fHx8MTc1NjY0MjAzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    content: 'I was overwhelmed after bringing my baby home, but NeoNest gave me the support I needed. The breastfeeding assistance and sleep guidance were particularly helpful. I recommend it to all new moms!',
    rating: 5,
    location: 'Denver, CO',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Our Families Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Real stories from mothers and caregivers who are part of the NeoNest community.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main testimonial display */}
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="w-full flex-shrink-0 border-0 shadow-xl">
                  <CardContent className="p-8 lg:p-12">
                    <div className="text-center max-w-3xl mx-auto">
                      {/* Quote Icon */}
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                        <Quote className="w-8 h-8 text-primary" />
                      </div>

                      {/* Stars */}
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Content */}
                      <blockquote className="text-lg lg:text-xl text-foreground mb-8 leading-relaxed italic">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary/20">
                          <ImageWithFallback
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-foreground">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          <div className="text-xs text-primary">{testimonial.location}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-primary/30 hover:bg-primary/50'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Ready to become part of our community?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-3 rounded-xl">
              Book Your Care
            </Button>
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-xl">
              Become a Caregiver
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}