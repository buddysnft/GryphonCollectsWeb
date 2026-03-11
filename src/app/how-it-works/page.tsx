import Link from "next/link";
import { brandConfig } from "@/config/brand";

export const metadata = {
  title: `How It Works | ${brandConfig.name}`,
  description: `Learn how card breaking works on ${brandConfig.name}. From selecting your spot to receiving your cards, we make the process simple and transparent.`,
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            How Card Breaking Works
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            New to card breaking? We'll walk you through the entire process step-by-step.
          </p>
        </div>

        {/* Main Steps */}
        <div className="space-y-16 mb-16">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary/10 border-4 border-primary rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">1</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Browse Upcoming Breaks</h2>
              <p className="text-text-secondary text-lg mb-4">
                Check out our <Link href="/breaks" className="text-primary hover:underline">breaks page</Link> to see what's scheduled. 
                Each break features different products like Prizm, Select, Topps Chrome, and more.
              </p>
              <p className="text-text-secondary text-lg">
                Every break includes details about the product, break format (team vs. random), price per spot, and the date/time we'll be breaking live.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary/10 border-4 border-primary rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">2</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Select Your Spot(s)</h2>
              <p className="text-text-secondary text-lg mb-4">
                Choose which team(s) or spot number(s) you want. Some breaks are team-based (you get all cards from your team), 
                while others are random (spots are randomized before the break).
              </p>
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-text-primary mb-3">Break Formats:</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span><strong className="text-text-primary">Team Break:</strong> Select your favorite team. You receive all cards from that team.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span><strong className="text-text-primary">Random Break:</strong> Spots are randomized before opening. Creates excitement!</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span><strong className="text-text-primary">Player Break:</strong> Specific players are assigned to spots. You get cards of your selected player.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary/10 border-4 border-primary rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">3</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Secure Checkout</h2>
              <p className="text-text-secondary text-lg mb-4">
                Complete payment through our secure Stripe checkout. We accept all major credit cards and digital wallets.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-text-secondary">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-text-secondary">PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary/10 border-4 border-primary rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">4</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Watch the Break Live</h2>
              <p className="text-text-secondary text-lg mb-4">
                On break day, join us live on YouTube, Instagram, or Whatnot. We'll open your boxes and show every card pulled in real-time.
              </p>
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-text-primary mb-3">Where to Watch:</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {brandConfig.social.youtube && (
                    <a
                      href={brandConfig.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-danger text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube
                    </a>
                  )}
                  {brandConfig.social.instagram && (
                    <a
                      href={brandConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {brandConfig.social.whatnot && (
                    <a
                      href={brandConfig.social.whatnot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Whatnot
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary/10 border-4 border-primary rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">5</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Receive Your Cards</h2>
              <p className="text-text-secondary text-lg mb-4">
                After the break, we carefully pack your cards and ship them within 48 hours. All cards are sleeved and protected.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Standard Shipping</h3>
                  <p className="text-text-secondary text-sm">Included in break price. USPS First Class with tracking.</p>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Card Protection</h3>
                  <p className="text-text-secondary text-sm">All hits sleeved in penny sleeves + toploaders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-border pt-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                What if I don't get any hits?
              </h3>
              <p className="text-text-secondary">
                That's the nature of card breaking - not every spot will have hits. However, you always receive all base cards 
                and inserts from your team/spot. We recommend joining multiple breaks to increase your chances!
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Can I cancel or refund my spot?
              </h3>
              <p className="text-text-secondary">
                Due to the nature of live breaks, all sales are final once a break is full or 48 hours before the scheduled break time. 
                If the break is canceled by us, you will receive a full refund.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                How long until I receive my cards?
              </h3>
              <p className="text-text-secondary">
                We ship within 48 hours after the break. USPS First Class typically takes 3-5 business days. 
                You'll receive tracking information via email.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                What happens if a box is damaged or tampered with?
              </h3>
              <p className="text-text-secondary">
                We only open factory-sealed boxes on camera. If we receive a damaged box from the distributor, 
                we will show it on stream and work with participants to resolve fairly (refund or replacement break).
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-2xl">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Ready to Join Your First Break?
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Browse our upcoming breaks and reserve your spot today. Watch live, collect your hits, and join the community!
          </p>
          <Link
            href="/breaks"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-lg"
          >
            View Upcoming Breaks
          </Link>
        </div>
      </div>
    </div>
  );
}
