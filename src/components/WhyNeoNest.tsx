import { Shield, DollarSign, Bot, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const features = [
  {
    id: 'safe',
    icon: Shield,
    title: 'Safe & Verified',
    description: 'All our caregivers undergo rigorous background checks, certification verification, and continuous training to ensure your family\'s safety.',
    color: 'from-green-500/20 to-green-500/5',
    iconColor: 'text-green-600',
    stats: '100% Verified',
  },
  {
    id: 'affordable',
    icon: DollarSign,
    title: 'Affordable Care',
    description: 'Quality care shouldn\'t break the bank. We offer flexible pricing plans and work with insurance providers to make care accessible.',
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-600',
    stats: '50% Less Cost',
  },
  {
    id: 'ai',
    icon: Bot,
    title: 'AI Assistant',
    description: '24/7 AI-powered support provides instant answers, personalized recommendations, and emergency assistance when you need it most.',
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-600',
    stats: '24/7 Available',
  },
  {
    id: 'empowerment',
    icon: Users,
    title: 'Women Empowerment',
    description: 'We create meaningful employment opportunities for women while supporting mothers, building a stronger community for all.',
    color: 'from-pink-500/20 to-pink-500/5',
    iconColor: 'text-pink-600',
    stats: '500+ Jobs Created',
  },
];

export function WhyNeoNest() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose NeoNest?
          </h2>
          <p className="text-lg text-muted-foreground">
            We're more than just a care service. We're building a community that supports mothers, 
            empowers women, and creates lasting positive impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer border-0 shadow-lg overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{feature.stats}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">Trusted by Families Everywhere</h3>
            <p className="text-muted-foreground">Join our growing community of satisfied parents and caregivers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-sm text-muted-foreground">Happy Families</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Certified Caregivers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Care Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-4 mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}