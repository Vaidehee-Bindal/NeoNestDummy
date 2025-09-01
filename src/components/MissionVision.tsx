import { Heart, Target, Users, Globe, Award, Lightbulb, Shield, Baby, Linkedin, Twitter, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useScrollAnimation, useStaggeredAnimation } from './hooks/useScrollAnimation';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function MissionVision() {
  const { elementRef: heroRef } = useScrollAnimation();
  const { containerRef: whyNeoNestRef } = useStaggeredAnimation(3, 200);
  const { containerRef: founderRef } = useStaggeredAnimation(1, 300);
  const { containerRef: teamRef } = useStaggeredAnimation(4, 150);

  const reasons = [
    {
      icon: Baby,
      title: "Maternal Healthcare Gap",
      description: "90% of new mothers struggle with inadequate postpartum support, leading to increased stress, anxiety, and health complications during a critical time.",
      stat: "90%",
      statDesc: "mothers lack adequate support"
    },
    {
      icon: Users,
      title: "Unemployment Among Women",
      description: "Millions of skilled women face unemployment or underemployment, particularly those seeking flexible work that allows them to support their own families.",
      stat: "65%",
      statDesc: "women need flexible work"
    },
    {
      icon: Shield,
      title: "Trust and Safety Concerns",
      description: "Parents struggle to find verified, trained caregivers they can trust with their most precious possessions - their children and family's wellbeing.",
      stat: "78%",
      statDesc: "parents worry about caregiver quality"
    }
  ];

  const founder = {
    name: "Dr. Ananya Sharma",
    title: "Founder & CEO",
    image: "indian woman doctor entrepreneur",
    bio: "A pediatrician and mother of two, Dr. Ananya experienced firsthand the challenges of finding quality postpartum care. After struggling to balance her medical practice with motherhood while searching for reliable support, she was inspired to create NeoNest - a platform that would solve this problem for millions of mothers while creating meaningful employment for women in her community.",
    experience: "15+ years in Pediatrics",
    education: "MBBS, MD Pediatrics, IIM Bangalore MBA",
    achievements: [
      "2024 Healthcare Innovator Award",
      "Featured in Forbes 30 Under 30 Healthcare",
      "TEDx Speaker on Maternal Health",
      "Published researcher in child development"
    ],
    vision: "To revolutionize maternal care by creating a trusted ecosystem where every mother receives expert support and every woman caregiver achieves economic independence through meaningful work.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "ananya@neonest.com"
    }
  };

  const team = [
    {
      name: "Priya Mehta",
      title: "CTO & Co-founder",
      image: "female tech leader indian",
      bio: "Former Google engineer with 12+ years in AI/ML. Leading our technology platform and AI-powered matching algorithms.",
      goals: ["Scale platform to 100+ cities", "Develop advanced AI care recommendations", "Build world-class caregiver training programs"]
    },
    {
      name: "Rajesh Kumar",
      title: "Head of Operations",
      image: "indian business operations manager",
      bio: "15+ years in healthcare operations. Ensuring seamless service delivery and caregiver quality across all markets.",
      goals: ["Maintain 99.5% service reliability", "Expand caregiver network to 10,000+", "Implement comprehensive quality assurance"]
    },
    {
      name: "Dr. Meera Iyer",
      title: "Head of Medical Advisory",
      image: "indian female doctor advisor",
      bio: "Obstetrician with 20+ years experience. Developing medical protocols and caregiver training curricula.",
      goals: ["Create evidence-based care protocols", "Train 1,000+ certified caregivers", "Establish medical partnerships"]
    },
    {
      name: "Kavitha Rao",
      title: "Head of Community",
      image: "indian woman community leader",
      bio: "Social work background with expertise in women's empowerment and community building programs.",
      goals: ["Support 5,000+ women caregivers", "Build strong community networks", "Create sustainable livelihood programs"]
    }
  ];

  return (
    <section id="mission" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div ref={heroRef} className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Mission & Vision
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Building a world where every mother receives the support she deserves, 
            and every woman has the opportunity to make a meaningful impact through dignified work.
          </p>
        </div>

        {/* Why NeoNest Was Needed */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why NeoNest Was Born</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The maternal care crisis and women's employment challenges created an urgent need for a 
              comprehensive solution that addresses both problems simultaneously.
            </p>
          </div>
          
          <div ref={whyNeoNestRef} className="grid lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => {
              const IconComponent = reason.icon;
              return (
                <Card key={index} className="opacity-0 group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-1">{reason.stat}</div>
                      <div className="text-sm text-muted-foreground">{reason.statDesc}</div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-foreground mb-4 text-center">{reason.title}</h4>
                    <p className="text-muted-foreground text-center leading-relaxed">{reason.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-8">
                <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-foreground mb-4">The Solution</h4>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  NeoNest bridges this gap by creating a trusted platform that connects mothers with verified, 
                  trained caregivers while providing women with flexible, meaningful employment opportunities. 
                  We're not just solving a problem - we're creating a sustainable ecosystem that empowers both 
                  mothers and caregivers to thrive.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Founder Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Meet Our Founder</h3>
            <p className="text-lg text-muted-foreground">
              The visionary behind NeoNest's mission to transform maternal care
            </p>
          </div>
          
          <div ref={founderRef} className="max-w-5xl mx-auto">
            <Card className="opacity-0 overflow-hidden shadow-2xl border-0">
              <div className="lg:flex">
                <div className="lg:w-1/3">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                    <ImageWithFallback
                      src={`https://source.unsplash.com/400x400/?${encodeURIComponent(founder.image)}`}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-2xl font-bold text-foreground mb-2">{founder.name}</h4>
                        <p className="text-lg text-primary font-medium mb-1">{founder.title}</p>
                        <p className="text-sm text-muted-foreground">{founder.experience}</p>
                        <p className="text-sm text-muted-foreground">{founder.education}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={founder.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={founder.social.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${founder.social.email}`}>
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">{founder.bio}</p>
                    
                    <div className="mb-6">
                      <h5 className="font-semibold text-foreground mb-3">Key Achievements</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {founder.achievements.map((achievement, index) => (
                          <Badge key={index} variant="outline" className="justify-start p-2">
                            <Award className="w-3 h-3 mr-2 text-primary" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h5 className="font-semibold text-foreground mb-3">Vision Statement</h5>
                      <p className="text-muted-foreground italic leading-relaxed">"{founder.vision}"</p>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Leadership Team</h3>
            <p className="text-lg text-muted-foreground">
              Experienced leaders united by a shared commitment to maternal care and women's empowerment
            </p>
          </div>
          
          <div ref={teamRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="opacity-0 group hover:shadow-xl transition-all duration-500 text-center">
                <CardContent className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={`https://source.unsplash.com/200x200/?${encodeURIComponent(member.image)}`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <h4 className="font-bold text-foreground mb-1">{member.name}</h4>
                  <p className="text-sm text-primary font-medium mb-3">{member.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{member.bio}</p>
                  
                  <div>
                    <h5 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Goals</h5>
                    <div className="space-y-1">
                      {member.goals.map((goal, goalIndex) => (
                        <div key={goalIndex} className="text-xs text-muted-foreground flex items-center">
                          <div className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                          {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mission Panel */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    Our Mission
                  </h3>
                  <p className="text-sm text-muted-foreground">What drives us every day</p>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed mb-6">
                To provide exceptional, personalized care for mothers and babies while creating 
                meaningful employment opportunities for women in our communities. We believe that 
                supporting mothers during their most vulnerable time strengthens families and 
                builds stronger communities.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Personalized Care</div>
                    <div className="text-sm text-muted-foreground">Tailored support for each family's unique needs</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Women Empowerment</div>
                    <div className="text-sm text-muted-foreground">Creating dignified employment opportunities</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Community Building</div>
                    <div className="text-sm text-muted-foreground">Fostering connections and support networks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vision Panel */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-secondary transition-colors duration-300">
                    Our Vision
                  </h3>
                  <p className="text-sm text-muted-foreground">Where we're headed</p>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed mb-6">
                To become the leading platform connecting mothers with expert care while 
                revolutionizing how society supports the transition to motherhood. We envision 
                a world where no mother feels alone, and every woman has the opportunity to 
                thrive professionally while caring for others.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Global Reach</div>
                    <div className="text-sm text-muted-foreground">Expanding care access worldwide</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">AI Innovation</div>
                    <div className="text-sm text-muted-foreground">Leading healthcare technology advancement</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Social Impact</div>
                    <div className="text-sm text-muted-foreground">Creating lasting positive change</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Stats */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Growing Impact</h3>
            <p className="text-muted-foreground">Making a difference, one family at a time</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-sm text-muted-foreground">Families Served</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Women Employed</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-accent mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Hours of Care</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-chart-4/20 to-chart-4/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-chart-4" />
              </div>
              <div className="text-3xl font-bold text-chart-4 mb-2">25</div>
              <div className="text-sm text-muted-foreground">Cities Reached</div>
            </div>
          </div>
        </div>

        {/* Community Image */}
        <div className="mt-16 relative rounded-2xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1623764410283-b45aeaacfd5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJpbmclMjBjb21tdW5pdHklMjB3b21lbnxlbnwxfHx8fDE3NTY2NDIwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Caring community of women supporting each other"
            className="w-full h-64 lg:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
            <div className="p-8 text-center w-full">
              <p className="text-lg font-medium text-foreground mb-2">
                "Building a community where every mother thrives and every woman succeeds."
              </p>
              <p className="text-sm text-muted-foreground">- NeoNest Team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}