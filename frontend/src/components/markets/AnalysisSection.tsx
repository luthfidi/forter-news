'use client';

import { useState } from 'react';
import { Market, Analysis } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface AnalysisSectionProps {
  market: Market;
  analyses: Analysis[];
  loading: boolean;
}

export default function AnalysisSection({ analyses, loading }: AnalysisSectionProps) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<'YES' | 'NO'>('YES');
  const [reasoning, setReasoning] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState(['']);
  const [stakeAmount, setStakeAmount] = useState('');

  const handleAddEvidenceLink = () => {
    setEvidenceLinks([...evidenceLinks, '']);
  };

  const handleEvidenceLinkChange = (index: number, value: string) => {
    const newLinks = [...evidenceLinks];
    newLinks[index] = value;
    setEvidenceLinks(newLinks);
  };

  const handleRemoveEvidenceLink = (index: number) => {
    if (evidenceLinks.length > 1) {
      setEvidenceLinks(evidenceLinks.filter((_, i) => i !== index));
    }
  };

  const handleSubmitAnalysis = () => {
    // Handle analysis submission logic here
    console.log({
      position: selectedPosition,
      reasoning,
      evidence: evidenceLinks.filter(link => link.trim()),
      stakeAmount: parseFloat(stakeAmount)
    });
    
    // Reset form
    setShowSubmissionForm(false);
    setReasoning('');
    setEvidenceLinks(['']);
    setStakeAmount('');
  };

  const getReputationDisplay = (address: string) => {
    // Mock reputation data - in real app, fetch from user data
    const mockReputations: Record<string, { accuracy: number; tier: string }> = {
      '0x1234...5678': { accuracy: 87, tier: 'Master' },
      '0xabcd...efgh': { accuracy: 72, tier: 'Expert' }
    };
    
    return mockReputations[address] || { accuracy: 0, tier: 'Novice' };
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Novice': return '🥉';
      case 'Analyst': return '🥈';
      case 'Expert': return '🥇';
      case 'Master': return '💎';
      case 'Legend': return '👑';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border border-border/50 bg-background/80 backdrop-blur-sm animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
                <div className="h-4 bg-muted rounded w-3/5"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Submit Analysis Section */}
      <Card className="border border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Submit Your Analysis</h3>
              <p className="text-muted-foreground">
                Share your research and stake on your conviction. Build on-chain credibility.
              </p>
            </div>
            <Button 
              onClick={() => setShowSubmissionForm(!showSubmissionForm)}
              className="bg-gradient-to-r from-primary to-primary/90"
            >
              {showSubmissionForm ? 'Cancel' : 'Submit Analysis'}
            </Button>
          </div>

          {showSubmissionForm && (
            <div className="mt-6 p-6 bg-background/50 rounded-lg border border-border/30">
              {/* Position Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Your Position</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedPosition('YES')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      selectedPosition === 'YES'
                        ? 'border-green-500 bg-green-500/10 text-green-600'
                        : 'border-border/30 hover:border-green-500/50'
                    }`}
                  >
                    <div className="text-lg font-bold">YES</div>
                    <div className="text-sm opacity-75">I believe this will happen</div>
                  </button>
                  <button
                    onClick={() => setSelectedPosition('NO')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      selectedPosition === 'NO'
                        ? 'border-red-500 bg-red-500/10 text-red-600'
                        : 'border-border/30 hover:border-red-500/50'
                    }`}
                  >
                    <div className="text-lg font-bold">NO</div>
                    <div className="text-sm opacity-75">I don&apos;t think this will happen</div>
                  </button>
                </div>
              </div>

              {/* Reasoning */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Detailed Analysis & Reasoning *
                </label>
                <Textarea
                  placeholder="Provide detailed reasoning for your position. Include data, trends, and logical arguments to support your analysis..."
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  className="min-h-[120px] bg-background/50 border-border/50"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Minimum 100 characters. Quality analysis improves your reputation.
                </div>
              </div>

              {/* Evidence Links */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Supporting Evidence (Optional)
                </label>
                {evidenceLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="https://example.com/supporting-data"
                      value={link}
                      onChange={(e) => handleEvidenceLinkChange(index, e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                    {evidenceLinks.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEvidenceLink(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddEvidenceLink}
                  className="mt-2"
                >
                  Add Evidence Link
                </Button>
              </div>

              {/* Stake Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Conviction Stake (USDC) *
                </label>
                <Input
                  type="number"
                  placeholder="100"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Minimum $1 USDC. Higher stakes show stronger conviction.
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitAnalysis}
                  disabled={!reasoning.trim() || !stakeAmount || parseFloat(stakeAmount) < 1}
                  className="bg-gradient-to-r from-primary to-primary/90"
                >
                  Submit Analysis & Stake
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSubmissionForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Analyses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Expert Analyses ({analyses.length})</h3>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
              {analyses.filter(a => a.position === 'YES').length} YES
            </Badge>
            <Badge variant="secondary" className="bg-red-500/10 text-red-600">
              {analyses.filter(a => a.position === 'NO').length} NO
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {analyses.map((analysis) => {
            const reputation = getReputationDisplay(analysis.authorAddress);
            
            return (
              <Card key={analysis.id} className="border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200">
                <CardContent className="p-6">
                  {/* Author Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {analysis.authorAddress.slice(2, 4).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{analysis.authorAddress}</span>
                          <Badge variant="secondary" className="text-xs">
                            {getTierIcon(reputation.tier)} {reputation.tier}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reputation.accuracy}% accuracy • {analysis.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={analysis.position === 'YES' ? 'default' : 'secondary'}
                        className={analysis.position === 'YES' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                        }
                      >
                        {analysis.position}
                      </Badge>
                      <Badge variant="outline">
                        ${analysis.stakeAmount.toLocaleString()} staked
                      </Badge>
                    </div>
                  </div>

                  {/* Analysis Content */}
                  <div className="mb-4">
                    <p className="text-foreground leading-relaxed">
                      {analysis.reasoning}
                    </p>
                  </div>

                  {/* Evidence Links */}
                  {analysis.evidence.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Supporting Evidence:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.evidence.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
                          >
                            Source {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="hover:text-foreground transition-colors">
                        👍 Helpful
                      </button>
                      <button className="hover:text-foreground transition-colors">
                        🔗 Share
                      </button>
                      {analysis.farcasterCastHash && (
                        <a 
                          href={`https://warpcast.com/~/conversations/${analysis.farcasterCastHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-foreground transition-colors"
                        >
                          📱 View on Farcaster
                        </a>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="hover:bg-accent/10"
                    >
                      Back This Analyst
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {analyses.length === 0 && (
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share your research and build credibility on this market.
              </p>
              <Button 
                onClick={() => setShowSubmissionForm(true)}
                className="bg-gradient-to-r from-primary to-primary/90"
              >
                Submit First Analysis
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}