import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DualStaking() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Dual Staking Mechanism
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
          Unlike traditional prediction markets, Forter lets you stake on both outcomes and the credibility of analysts.
        </p>
        <Badge variant="outline" className="mt-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          Outcome + Informer = Complete Information Finance
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Outcome Staking */}
        <Card className="group border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2 bg-blue-500/10 text-blue-600">Market Staking</Badge>
                <h3 className="text-xl font-bold">Stake on Outcome</h3>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Traditional YES/NO positions. Provide market liquidity and earn from collective market correctness.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reward Share</span>
                <span className="font-semibold text-blue-600">30%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Risk Level</span>
                <span className="font-semibold">Medium</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Entry Barrier</span>
                <span className="font-semibold text-green-600">Low</span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Example</span>
              </div>
              <p className="text-sm text-muted-foreground">
                "Will BTC hit $100k by Dec 2024?" → Stake $100 on YES → Earn proportional rewards if correct
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informer Staking */}
        <Card className="group border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2 bg-accent/10 text-accent">Credibility Staking</Badge>
                <h3 className="text-xl font-bold">Stake on Informer</h3>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Back specific analysts based on their track record. Earn when your chosen informer proves correct.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reward Share</span>
                <span className="font-semibold text-accent">70%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Risk Level</span>
                <span className="font-semibold">Higher</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Research Required</span>
                <span className="font-semibold text-orange-600">High</span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-sm font-medium">Example</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Alice has 87% accuracy → Stake $50 on Alice's BTC analysis → Earn if Alice's prediction is correct
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Distribution Visual */}
      <Card className="border border-border/50 bg-background/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-center mb-6">Reward Pool Distribution</h3>
          
          <div className="relative">
            <div className="flex h-12 rounded-lg overflow-hidden shadow-lg">
              <div className="flex-[30] bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                30% Outcome Stakers
              </div>
              <div className="flex-[70] bg-gradient-to-r from-accent to-primary flex items-center justify-center text-white font-semibold">
                70% Informer Ecosystem
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-6 text-center">
              <div>
                <div className="text-sm font-medium text-blue-600 mb-2">Market Liquidity Providers</div>
                <div className="text-xs text-muted-foreground">
                  Rewards for providing market depth and collective intelligence
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-accent mb-2">Credibility Ecosystem</div>
                <div className="text-xs text-muted-foreground">
                  50% to correct informers + 20% to their backers
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground italic">
          "Balance market wisdom with human intelligence — credibility drives the majority of rewards."
        </p>
      </div>
    </div>
  )
}
