import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const TIERS = [
  { 
    name: "Novice", 
    range: "0–49%", 
    icon: "🥉", 
    color: "from-slate-400 to-slate-500",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-600",
    description: "Learning the ropes",
    benefits: ["Basic access", "Standard visibility"]
  },
  { 
    name: "Analyst", 
    range: "50–69%", 
    icon: "🥈", 
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-700",
    description: "Building credibility", 
    benefits: ["Featured content", "Increased rewards"]
  },
  { 
    name: "Expert", 
    range: "70–84%", 
    icon: "🥇", 
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-700",
    description: "Proven track record",
    benefits: ["Leaderboard position", "Priority display"]
  },
  { 
    name: "Master", 
    range: "85–94%", 
    icon: "💎", 
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-700",
    description: "Elite performance",
    benefits: ["Staking multiplier", "VIP features"]
  },
  { 
    name: "Legend", 
    range: "95–100%", 
    icon: "👑", 
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-700",
    description: "Legendary status",
    benefits: ["DAO governance", "Exclusive perks"]
  },
]

export default function ReputationTiers() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Dynamic Reputation System
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-6">
          Soulbound NFTs that evolve with your performance. Your credibility becomes a portable, verifiable asset.
        </p>
        <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          Visual Updates + Permanent On-Chain Record
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {TIERS.map((tier) => (
          <Card
            key={tier.name}
            className="group border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardContent className="p-6 relative">
              <div className="text-center">
                <div className="text-4xl mb-3">{tier.icon}</div>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tier.bgColor} ${tier.textColor} mb-2`}>
                  {tier.range}
                </div>
                <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                
                <div className="space-y-1">
                  {tier.benefits.map((benefit, benefitIdx) => (
                    <div key={benefitIdx} className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-current opacity-60" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <div className={`h-2 rounded-full bg-gradient-to-r ${tier.color} shadow-sm`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* NFT Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="font-bold mb-2">Soulbound</h3>
            <p className="text-sm text-muted-foreground">
              Non-transferable tokens tied to your identity. Your reputation can't be bought or sold.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="font-bold mb-2">Dynamic Visuals</h3>
            <p className="text-sm text-muted-foreground">
              NFT images update automatically based on your performance tier and accuracy stats.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-4">🌐</div>
            <h3 className="font-bold mb-2">Portable</h3>
            <p className="text-sm text-muted-foreground">
              Your reputation follows you across Web3. Other protocols can integrate your credibility score.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground italic">
          "Your credibility becomes a financial primitive — measurable, portable, and yield-bearing."
        </p>
      </div>
    </div>
  )
}
