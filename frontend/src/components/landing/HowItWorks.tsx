import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const STEPS = [
  { 
    title: "Connect & Browse", 
    description: "Connect your wallet and Farcaster account. Explore curated NEWS across crypto, macro, and tech.",
    icon: "🔗",
    color: "from-blue-500 to-cyan-500",
    details: ["Wallet authentication", "Farcaster integration", "NEWS discovery"]
  },
  { 
    title: "Write Analysis", 
    description: "Submit detailed reasoning with evidence. Stake USDC on your analysis to prove conviction.",
    icon: "✍️",
    color: "from-green-500 to-emerald-500",
    details: ["Research & evidence", "Reasoning submission", "Conviction staking"]
  },
  { 
    title: "Community Stakes", 
    description: "Others stake on outcomes or back your credibility. Dual staking pools accumulate.",
    icon: "🎯",
    color: "from-purple-500 to-violet-500",
    details: ["Outcome staking", "Informer backing", "Pool accumulation"]
  },
  { 
    title: "Oracle Resolution", 
    description: "AI agents and oracles verify outcomes using real-world data sources.",
    icon: "⚡",
    color: "from-orange-500 to-red-500",
    details: ["Data verification", "Oracle consensus", "Dispute resolution"]
  },
  { 
    title: "Rewards & Reputation", 
    description: "Distribute rewards based on accuracy. Update dynamic NFTs and build permanent credibility.",
    icon: "🏆",
    color: "from-yellow-500 to-amber-500",
    details: ["Reward distribution", "NFT updates", "Reputation building"]
  },
]

export default function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          How Forter Works
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-6">
          From connecting your wallet to building permanent on-chain reputation — the complete Information Finance journey.
        </p>
        <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          5-Step Process to Credible Rewards
        </Badge>
      </div>

      <div className="relative">
        {/* Connection lines */}
        <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <Card className="group border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardContent className="p-6 relative">
                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg mb-3`}>
                      <span className="text-xl">{step.icon}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs mb-2">
                      Step {i + 1}
                    </Badge>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="space-y-2">
                    {step.details.map((detail, detailIdx) => (
                      <div key={detailIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${step.color}`} />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow connector for larger screens */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-background border border-border/50 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Card className="border border-border/50 bg-background/90 backdrop-blur-sm max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4">The Complete Cycle</h3>
            <p className="text-muted-foreground leading-relaxed">
              Each prediction cycle builds your on-chain reputation. Over time, your accuracy becomes a measurable, 
              portable asset that other protocols can integrate — transforming information into a financial primitive.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
