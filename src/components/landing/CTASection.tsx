import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="financial-card-gradient p-12 lg:p-16 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="hero-gradient p-3 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to take control of{" "}
              <span className="hero-gradient bg-clip-text text-transparent">
                your finances?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of people who've already simplified their financial lives 
              with Finice. Start splitting smarter today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              Start Free Today
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              Book a Demo
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            No credit card required • 30-day free trial • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}