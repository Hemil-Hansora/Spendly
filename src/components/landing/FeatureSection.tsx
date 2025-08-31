import { Button } from "@/components/ui/button";
import {
  Users,
  PieChart,
  Smartphone,
  Shield,
  CreditCard,
  TrendingUp,
  Bell,
  Camera,
} from "lucide-react";
import Image from "next/image";

export function FeatureSection() {
  const features = [
    {
      icon: Users,
      title: "Smart Bill Splitting",
      description:
        "Split expenses instantly with friends, track who owes what, and settle up with one tap.",
      gradient: "primary-gradient",
    },
    {
      icon: PieChart,
      title: "Personal Finance Dashboard",
      description:
        "Visualize your spending patterns, set budgets, and achieve your financial goals.",
      gradient: "secondary-gradient",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description:
        "Snap receipts, split on-the-go, and manage finances from anywhere with our mobile app.",
      gradient: "hero-gradient",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "Your financial data is protected with 256-bit encryption and biometric authentication.",
      gradient: "primary-gradient",
    },
    {
      icon: TrendingUp,
      title: "Smart Insights",
      description:
        "Get personalized recommendations to save money and optimize your spending habits.",
      gradient: "secondary-gradient",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description:
        "Stay updated on expense settlements, bill reminders, and budget alerts.",
      gradient: "hero-gradient",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Everything you need for{" "}
            <span className="hero-gradient bg-clip-text text-transparent">
              financial harmony
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From splitting dinner bills to managing your entire budget, Finice
            brings clarity and control to your financial life.
          </p>
        </div>

        {/* Split Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                Split expenses like a pro
              </h3>
              <p className="text-lg text-muted-foreground">
                No more awkward conversations about money. Split any expense
                fairly and keep track of everything automatically.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="primary-gradient p-2 rounded-lg flex-shrink-0">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Scan receipts instantly</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-powered receipt scanning extracts items and amounts
                    automatically
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="secondary-gradient p-2 rounded-lg flex-shrink-0">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Add friends easily</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with friends and split expenses in seconds
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="hero-gradient p-2 rounded-lg flex-shrink-0">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Settle up instantly</h4>
                  <p className="text-sm text-muted-foreground">
                    Integrated payments make settling debts effortless
                  </p>
                </div>
              </div>
            </div>

            <Button variant="financial" size="lg">
              Start Splitting Bills
            </Button>
          </div>

          <div className="relative">
            <div className="financial-card-gradient p-6 overflow-hidden">
              {/* <img 
                src={splitImage} 
                alt="Split expenses with friends" 
                className="w-full h-auto rounded-lg"
              /> */}
              <Image
                src={"/split-expenses.jpg"}
                alt="Split expenses with friends"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="financial-card p-6 text-center space-y-4"
            >
              <div
                className={`${feature.gradient} p-4 rounded-xl w-16 h-16 mx-auto flex items-center justify-center`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
