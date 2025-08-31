import { Button } from "@/components/ui/button";
import { ArrowRight, Users, PieChart, Shield, Smartphone } from "lucide-react";
import Image from "next/image";
// import heroImage from "@/assets/hero-dashboard.jpg";

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Split smart,{" "}
                <span className="hero-gradient bg-clip-text text-transparent">
                  spend smarter
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The all-in-one platform that makes splitting expenses with friends effortless 
                while helping you master your personal finances.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                See How It Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8">
              <div className="text-center">
                <div className="primary-gradient p-3 rounded-xl w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Split Bills</p>
              </div>
              <div className="text-center">
                <div className="secondary-gradient p-3 rounded-xl w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Track Spending</p>
              </div>
              <div className="text-center">
                <div className="hero-gradient p-3 rounded-xl w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Bank Security</p>
              </div>
              <div className="text-center">
                <div className="primary-gradient p-3 rounded-xl w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Mobile First</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="financial-card-gradient p-8 overflow-hidden">
              {/* <img 
                src={"https://vecteezy.com/free-vector/financial-management"} 
                alt="Finice Dashboard" 
                className="w-full h-auto rounded-lg shadow-[var(--shadow-large)]"
              /> */}
              <Image src="/hero-dashboard.jpg" alt="Hero image " width={500} height={200} className="w-full h-auto rounded-lg shadow-[var(--shadow-large)]"/>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 financial-card p-4 !bg-card">
              <div className="text-sm font-medium text-success">+$1,247</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </div>
            <div className="absolute -bottom-4 -left-4 financial-card p-4 bg-card">
              <div className="text-sm font-medium">Bill Split</div>
              <div className="text-xs text-muted-foreground">3 friends</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}