'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { newsService } from '@/lib/services';
import { News } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import FloatingIndicator from '@/components/shared/FloatingIndicator';
import { useTransactionFeedback } from '@/lib/hooks/useTransactionFeedback';
import { poolService, tokenService } from '@/lib/services';

export default function CreatePoolPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  const { address, isConnected } = useAccount();
  const { feedback, executeTransaction, showError } = useTransactionFeedback();

  const [news, setNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    position: 'YES' as 'YES' | 'NO',
    reasoning: '',
    evidenceLinks: [''],
    imageUrl: '',
    imageCaption: '',
    creatorStake: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: Image upload state
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await newsService.getById(newsId);
        setNews(newsData || null);
      } catch (error) {
        console.error('[CreatePoolPage] Failed to load news:', error);
        setNews(null);
      }
    };

    loadNews();
  }, [newsId]);

  const handleAddEvidenceLink = () => {
    setFormData({
      ...formData,
      evidenceLinks: [...formData.evidenceLinks, '']
    });
  };

  const handleEvidenceLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.evidenceLinks];
    newLinks[index] = value;
    setFormData({ ...formData, evidenceLinks: newLinks });
  };

  const handleRemoveEvidenceLink = (index: number) => {
    if (formData.evidenceLinks.length > 1) {
      setFormData({
        ...formData,
        evidenceLinks: formData.evidenceLinks.filter((_, i) => i !== index)
      });
    }
  };

  // NEW: Image upload handlers
  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);

      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsUploading(false);

        // Simulate upload to Imgur or similar service
        setTimeout(() => {
          const mockImageUrl = `https://i.imgur.com/${Math.random().toString(36).substring(7)}.png`;
          setFormData({ ...formData, imageUrl: mockImageUrl });
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, imageUrl: '', imageCaption: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      showError('Please connect your wallet first');
      return;
    }

    const stakeAmount = parseFloat(formData.creatorStake);

    // Validate balance (if using contracts)
    if (address) {
      const hasBalance = await tokenService.hasSufficientBalance(address as `0x${string}`, stakeAmount);
      if (!hasBalance) {
        showError('Insufficient USDC balance');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Filter empty evidence links
      const evidenceLinks = formData.evidenceLinks.filter(link => link.trim() !== '');

      const pool = await executeTransaction(
        async () => {
          const result = await poolService.create({
            newsId,
            position: formData.position,
            reasoning: formData.reasoning,
            evidence: evidenceLinks,
            imageUrl: formData.imageUrl,
            imageCaption: formData.imageCaption,
            creatorStake: stakeAmount
          });

          return {
            success: true,
            data: result,
            hash: result.id // In contract mode, this would be tx hash
          };
        },
        'Creating pool on blockchain...',
        `Pool created successfully! Staked ${stakeAmount} USDC`,
        'primary'
      );

      if (pool) {
        // Mock: Auto-post to Farcaster
        console.log('Posting pool to Farcaster:', {
          newsId,
          poolId: pool.id,
          text: `Just created a pool on @forter!\n\n${news?.title}\nPosition: ${formData.position}\n\nStake & discuss: forter.app/news/${newsId}`
        });

        // Redirect after success
        setTimeout(() => {
          router.push(`/news/${newsId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to create pool:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.reasoning.trim().length >= 100 &&
      formData.creatorStake &&
      parseFloat(formData.creatorStake) >= 20
    );
  };

  // NEW: Enhanced validation with image requirement
  const isFormFullyValid = () => {
    return isFormValid() && (formData.imageUrl || imagePreview);
  };

  if (!news) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Card className="border border-border bg-card">
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">NEWS not found</h3>
              <p className="text-muted-foreground mb-6">
                The NEWS you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link href="/news">
                <Button>Browse NEWS</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Floating Indicator */}
      <FloatingIndicator {...feedback} />

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/news" className="hover:text-foreground transition-colors">
            News
          </Link>
          <span>/</span>
          <Link href={`/news/${newsId}`} className="hover:text-foreground transition-colors">
            NEWS Details
          </Link>
          <span>/</span>
          <span className="text-foreground">Create Pool</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Create Pool</h1>
          <p className="text-muted-foreground text-lg mb-4">
            Submit your analysis with reasoning and stake to prove conviction.
          </p>

          {/* NEWS Context */}
          <Card className="border border-accent/50 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Badge variant="secondary">{news.category}</Badge>
                <div className="flex-1">
                  <div className="font-medium mb-1">{news.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Resolves: {new Date(news.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border border-border bg-card hover:bg-secondary transition-all duration-300">
              <CardContent className="p-6">
                {/* Position Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Your Position *</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, position: 'YES' })}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        formData.position === 'YES'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                          : 'border-border hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="text-lg font-bold">YES</div>
                      <div className="text-sm opacity-75">I believe this will happen</div>
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, position: 'NO' })}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        formData.position === 'NO'
                          ? 'border-rose-500 bg-rose-500/10 text-rose-600'
                          : 'border-border hover:border-rose-500/50'
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
                    Detailed Analysis & Reasoning * <span className="text-muted-foreground font-normal">(min 100 characters)</span>
                  </label>
                  <Textarea
                    placeholder="Provide detailed reasoning for your position. Include data, trends, and logical arguments to support your analysis..."
                    value={formData.reasoning}
                    onChange={(e) => setFormData({ ...formData, reasoning: e.target.value })}
                    className="min-h-[150px] bg-background border-border"
                    maxLength={1000}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.reasoning.length}/1000 characters • Quality analysis improves your reputation
                  </div>
                </div>

                {/* Image Upload (IMPROVED!) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Upload Chart/Image * <span className="text-muted-foreground font-normal">(Required for quality pools)</span> 📊
                  </label>

                  {!imagePreview ? (
                    // Upload Area
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <div className="text-2xl">📸</div>
                        </div>
                        <div className="text-sm font-medium mb-2">
                          {isDragging ? 'Drop your image here' : 'Drag & drop your chart/image here'}
                        </div>
                        <div className="text-xs text-muted-foreground mb-4">
                          PNG, JPG, GIF up to 10MB
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Choose File
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    // Preview with Remove Option
                    <div className="space-y-3">
                      <div className="relative rounded-lg overflow-hidden border border-border/30 bg-card">
                        {/* Image Preview with better display */}
                        <div className="relative w-full min-h-[300px] max-h-[500px]">
                          <Image
                            src={imagePreview}
                            alt="Chart preview"
                            fill
                            className="object-contain" // Changed from object-cover to object-contain to avoid cropping
                            unoptimized
                            style={{ maxHeight: '500px' }}
                          />
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>

                        {/* Upload Status */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-white text-sm">Uploading...</div>
                          </div>
                        )}
                      </div>

                      {/* Image Caption */}
                      <Input
                        placeholder="Describe your chart/image (optional)"
                        value={formData.imageCaption}
                        onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                        className="bg-background border-border"
                        maxLength={100}
                      />

                      <div className="text-xs text-muted-foreground">
                        {!formData.imageUrl
                          ? 'Uploading your image... 📤'
                          : '✅ Image uploaded successfully! Visual evidence boosts credibility 3-5x'}
                      </div>
                    </div>
                  )}

                  {/* Manual URL Fallback */}
                  {!imagePreview && (
                    <div className="mt-4">
                      <div className="text-xs text-muted-foreground mb-2">
                        Or paste image URL from Imgur, Twitter, etc.:
                      </div>
                      <Input
                        placeholder="https://i.imgur.com/your-chart.png"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="bg-background border-border text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Evidence Links */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Supporting Evidence (Optional)
                  </label>
                  {formData.evidenceLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="https://example.com/supporting-data"
                        value={link}
                        onChange={(e) => handleEvidenceLinkChange(index, e.target.value)}
                        className="bg-background border-border"
                      />
                      {formData.evidenceLinks.length > 1 && (
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
                    + Add Evidence Link
                  </Button>
                </div>

                {/* Creator Stake */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Your Initial Stake (USDC) *
                  </label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={formData.creatorStake}
                    onChange={(e) => setFormData({ ...formData, creatorStake: e.target.value })}
                    className="bg-background border-border"
                    min="20"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Minimum $20 USDC. You earn 20% of pool rewards if your position is correct.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    disabled={!isFormValid()}
                    className="flex-1"
                  >
                    {showPreview ? 'Hide Preview' : 'Preview'}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isSubmitting || !isConnected}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/90"
                  >
                    {!isConnected
                      ? 'Connect Wallet First'
                      : isSubmitting
                      ? 'Creating...'
                      : 'Create Pool & Post to FC'}
                  </Button>
                </div>

                {/* Enhanced Validation Message */}
                {!isFormFullyValid() && isFormValid() && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <span>💡</span>
                      <span>Add a chart/image to increase your pool&apos;s credibility and earnings potential!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            {showPreview && isFormValid() && (
              <Card className="border border-accent/50 bg-accent/5 mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      YO
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Your Address</div>
                      <div className="text-xs text-muted-foreground">Preview</div>
                    </div>
                    <Badge
                      className={formData.position === 'YES'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 ml-auto'
                        : 'bg-rose-100 text-rose-700 border-rose-200 ml-auto'
                      }
                    >
                      {formData.position}
                    </Badge>
                  </div>

                  {(imagePreview || formData.imageUrl) && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-border/30 bg-card">
                      {/* Better Image Display - object-contain to avoid cropping */}
                      <div className="relative w-full min-h-[200px] max-h-[400px]">
                        <Image
                          src={imagePreview || formData.imageUrl}
                          alt="Chart preview"
                          fill
                          className="object-contain" // Use object-contain instead of object-cover
                          unoptimized
                          style={{ maxHeight: '400px' }}
                        />
                      </div>
                      {formData.imageCaption && (
                        <div className="p-3 bg-card/80 border-t border-border/30">
                          <div className="text-sm text-muted-foreground text-center">
                            📊 {formData.imageCaption}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-foreground leading-relaxed mb-4">
                    {formData.reasoning}
                  </p>

                  <div className="p-3 rounded-lg bg-card/50 border border-border/30">
                    <div className="text-xs font-medium mb-2">Creator&apos;s Stake</div>
                    <div className="text-sm font-semibold">${parseFloat(formData.creatorStake || '0').toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Guidelines */}
          <div className="space-y-6">
            <Card className="border border-border bg-card hover:bg-secondary transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">📋 Pool Guidelines</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <span>✓</span>
                    <span>Write detailed, logical reasoning</span>
                  </div>
                  <div className="flex gap-2">
                    <span>✓</span>
                    <span>Include data and evidence</span>
                  </div>
                  <div className="flex gap-2">
                    <span>✓</span>
                    <span>Upload charts for visual proof</span>
                  </div>
                  <div className="flex gap-2">
                    <span>✓</span>
                    <span>Stake enough to show conviction</span>
                  </div>
                  <div className="flex gap-2">
                    <span>✓</span>
                    <span>Be objective, avoid hype</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card hover:bg-secondary transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">💰 Earning Potential</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <div className="font-medium text-foreground mb-1">If your position is CORRECT:</div>
                    <div className="flex justify-between mb-2">
                      <span>You (analyst) earn:</span>
                      <span className="font-semibold text-primary">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>&quot;Agree&quot; stakers earn:</span>
                      <span className="font-semibold text-accent">80%</span>
                    </div>
                  </div>
                  <div className="h-px bg-border"></div>
                  <div>
                    <div className="font-medium text-foreground mb-1">If your position is WRONG:</div>
                    <div>You lose your stake</div>
                    <div>&quot;Disagree&quot; stakers win</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card hover:bg-secondary transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">🎯 Pro Tips</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    • Higher stakes attract more backers
                  </p>
                  <p>
                    • Quality reasoning builds reputation
                  </p>
                  <p>
                    • Charts increase credibility 3-5x
                  </p>
                  <p>
                    • Link to credible sources
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
