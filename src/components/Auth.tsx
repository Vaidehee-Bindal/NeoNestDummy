import { useState } from 'react';
import { Eye, EyeOff, Heart, Mail, Lock, User, Phone, ArrowRight, Check, Shield, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

interface AuthProps {
  onNavigate?: (view: AppView) => void;
}

export function Auth({ onNavigate }: AuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState<'parent' | 'caregiver'>('parent');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { elementRef: heroRef } = useScrollAnimation();
  const { login } = useAuth();

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Caregivers',
      description: 'All caregivers are thoroughly background-checked and verified'
    },
    {
      icon: Heart,
      title: '24/7 Support',
      description: 'Round-the-clock support for emergency situations'
    },
    {
      icon: Star,
      title: 'AI-Powered Matching',
      description: 'Smart matching based on your specific needs and preferences'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'New Mother',
      content: 'NeoNest connected me with the perfect caregiver. The support during those first weeks was invaluable.',
      rating: 5
    },
    {
      name: 'Maria Rodriguez',
      role: 'Certified Caregiver',
      content: 'As a caregiver, NeoNest has provided me with meaningful work helping families during such an important time.',
      rating: 5
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call - in real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from the API response
      const userData = {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        userType: userType
      };

      login(userData);
      
      // Redirect to book-care after successful login
      if (onNavigate) {
        onNavigate('book-care');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call - in real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from the API response
      const userData = {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        userType: userType
      };

      login(userData);
      
      // Redirect to book-care after successful signup
      if (onNavigate) {
        onNavigate('book-care');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pt-16">
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Hero Content */}
        <div ref={heroRef} className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join the NeoNest Community
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with trusted caregivers or find meaningful work supporting families during their most important moments.
            </p>

            {/* Benefits */}
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">"{testimonial.content}"</p>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <p className="text-muted-foreground">Sign in to your NeoNest account</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">Remember me</Label>
                      </div>
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Forgot password?
                      </Button>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup">
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                    <p className="text-muted-foreground">Join the NeoNest community</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSignup} className="space-y-6">
                    {/* User Type Selection */}
                    <div className="space-y-3">
                      <Label>I am a:</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Card 
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            userType === 'parent' ? 'ring-2 ring-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setUserType('parent')}
                        >
                          <CardContent className="p-4 text-center">
                            <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="font-medium">Parent</p>
                            <p className="text-xs text-muted-foreground">Looking for care</p>
                          </CardContent>
                        </Card>
                        <Card 
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            userType === 'caregiver' ? 'ring-2 ring-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setUserType('caregiver')}
                        >
                          <CardContent className="p-4 text-center">
                            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="font-medium">Caregiver</p>
                            <p className="text-xs text-muted-foreground">Providing care</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input 
                            id="firstName" 
                            placeholder="First name"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="signupEmail" 
                          type="email" 
                          placeholder="Enter your email"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="Enter your phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="signupPassword" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="confirmPassword" 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" className="mt-1" />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          I agree to the <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox id="marketing" className="mt-1" />
                        <Label htmlFor="marketing" className="text-sm leading-relaxed">
                          I would like to receive updates and promotional emails from NeoNest
                        </Label>
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <Badge variant="outline" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Secure & HIPAA Compliant
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}