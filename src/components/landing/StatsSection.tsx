import { DollarSign, Users, TrendingUp, Clock } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: DollarSign,
      value: "$2.4M+",
      label: "Money Split",
      description: "Total amount split between friends"
    },
    {
      icon: Users,
      value: "50K+",
      label: "Happy Users",
      description: "People managing their finances better"
    },
    {
      icon: TrendingUp,
      value: "23%",
      label: "Average Savings",
      description: "Users save money with our insights"
    },
    {
      icon: Clock,
      value: "2 mins",
      label: "Setup Time",
      description: "From signup to first split"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by thousands of{" "}
            <span className="hero-gradient bg-clip-text text-transparent">
              smart spenders
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join the community that's revolutionizing how people manage money together
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="financial-card p-6 text-center space-y-4">
              <div className="primary-gradient p-4 rounded-xl w-16 h-16 mx-auto flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-lg font-semibold">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}