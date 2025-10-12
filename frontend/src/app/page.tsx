import DualStaking from "@/components/landing/DualStaking"
import FeaturePillars from "@/components/landing/FeaturePillars"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import ReputationTiers from "@/components/landing/ReputationTiers"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="relative min-h-screen">
      {/* Advanced Static Background */}
      <div className="fixed inset-0 z-0" aria-hidden>
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
        
        {/* Geometric pattern layer */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }} />
        </div>
        
        {/* Organic flowing shapes */}
        <div className="absolute inset-0">
          {/* Large primary blob */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          
          {/* Secondary accent blob */}
          <div className="absolute top-1/3 -left-20 w-64 h-64 bg-accent/6 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          
          {/* Bottom tertiary blob */}
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        </div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
          backgroundImage: `
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
        
        {/* Edge vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Header />
        <Hero />

        <section id="pillars" className="px-4 md:px-6 py-16">
          <FeaturePillars />
        </section>

        <section id="dual-staking" className="px-4 md:px-6 py-16">
          <DualStaking />
        </section>

        <section id="reputation" className="px-4 md:px-6 py-16">
          <ReputationTiers />
        </section>

        <section id="how" className="px-4 md:px-6 py-16">
          <HowItWorks />
        </section>

        <section className="px-4 md:px-6 pb-20 pt-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-border/50 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 shadow-2xl shadow-primary/5">
              <CardContent className="p-8 md:p-12 text-center">
                <h3 className="text-balance text-3xl md:text-4xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Transform noise into signal. Finance credible information.
                </h3>
                <p className="mt-4 md:mt-6 text-muted-foreground text-lg text-pretty max-w-2xl mx-auto">
                  Early Informer Program opens for analysts building verifiable, on-chain credibility.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="min-w-[160px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25">
                    Become an Informer
                  </Button>
                  <Button size="lg" variant="outline" className="min-w-[160px] border-border/50 hover:bg-accent/10">
                    Back Informers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
