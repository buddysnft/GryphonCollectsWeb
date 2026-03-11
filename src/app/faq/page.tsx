import Link from "next/link";
import { brandConfig } from "@/config/brand";

export const metadata = {
  title: `FAQ | ${brandConfig.name}`,
  description: `Frequently asked questions about ${brandConfig.name} card breaks. Learn about our process, shipping, payments, and more.`,
};

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is a card break?",
          a: "A card break is when a sealed box or case of trading cards is opened and the contents are distributed to participants based on teams, random assignment, or other predetermined methods. It's a fun and affordable way to collect cards!"
        },
        {
          q: "How do I participate in a break?",
          a: "Browse our upcoming breaks, select the one you want to join, choose your spot(s) or team(s), and complete checkout. You'll receive an email confirmation with break details and a link to watch live."
        },
        {
          q: "Do I need an account to join a break?",
          a: "No account required! You can check out as a guest. We'll email you all the details you need to watch the break and track your cards."
        },
        {
          q: "What if I'm new to card collecting?",
          a: "Welcome! Card breaks are a great way to start collecting. Check out our How It Works page for a detailed walkthrough, and feel free to reach out with any questions before joining your first break."
        }
      ]
    },
    {
      category: "Break Formats",
      questions: [
        {
          q: "What is a team break?",
          a: "In a team break, you select a specific team. You receive all cards pulled from that team during the break. Great if you're a fan of a particular team!"
        },
        {
          q: "What is a random break?",
          a: "In a random break, teams or players are randomly assigned to spot numbers before the break begins. You purchase a spot number, and randomization determines which team/player you get. Adds excitement and keeps pricing fair!"
        },
        {
          q: "What is a player break?",
          a: "Some breaks assign specific players to each spot. You select a player spot, and you receive all cards of that player pulled during the break."
        },
        {
          q: "Can I buy multiple spots?",
          a: "Yes! You can purchase as many available spots as you'd like in a single break. More spots = more chances at hits!"
        }
      ]
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, Apple Pay, and Google Pay through our secure Stripe checkout."
        },
        {
          q: "Is my payment information secure?",
          a: "Yes! We use Stripe for payment processing, which is PCI-compliant and industry-leading in security. We never store your payment information on our servers."
        },
        {
          q: "Why do prices vary between breaks?",
          a: "Prices depend on the product being broken (Prizm costs more than base products), the break format, and market value of the product. We price breaks fairly based on cost and expected value."
        },
        {
          q: "Are there any hidden fees?",
          a: "No hidden fees! The price you see includes the spot cost and standard shipping. The only additional cost would be if you request expedited shipping (contact us)."
        }
      ]
    },
    {
      category: "The Break Process",
      questions: [
        {
          q: "When will my break happen?",
          a: "Each break listing shows the scheduled date and time. We'll also send you an email reminder 24 hours before the break with links to watch live."
        },
        {
          q: "What if I can't watch the break live?",
          a: "No problem! All breaks are recorded and available for replay. You'll receive a link to the video after the break is complete."
        },
        {
          q: "Where can I watch the break?",
          a: `We stream breaks live on YouTube, Instagram, and Whatnot. Links are provided in your confirmation email and on the ${brandConfig.name} homepage.`
        },
        {
          q: "How do I know the break is fair?",
          a: "We only open factory-sealed boxes on camera. For random breaks, we use a public randomizer tool shown on stream. Transparency is our top priority!"
        },
        {
          q: "What if the box is damaged or tampered with?",
          a: "If we receive a damaged or tampered box, we show it on camera before opening and work with participants to resolve fairly (refund or replacement break)."
        }
      ]
    },
    {
      category: "Receiving Your Cards",
      questions: [
        {
          q: "How long until I receive my cards?",
          a: "We ship cards within 48 hours after the break. Standard USPS First Class shipping typically takes 3-5 business days after that. You'll receive tracking information via email."
        },
        {
          q: "How are cards packaged?",
          a: "All cards are sleeved in penny sleeves. Hits and numbered cards go into toploaders. Base cards are bundled and protected. Everything ships in a bubble mailer or small box."
        },
        {
          q: "Is shipping included in the price?",
          a: "Yes! Standard shipping (USPS First Class) is included in the break price. Expedited shipping is available for an additional fee - contact us before the break."
        },
        {
          q: "What if my cards arrive damaged?",
          a: "We pack cards carefully, but if damage occurs in transit, contact us immediately with photos. We'll work with you to resolve the issue."
        },
        {
          q: "Can I combine shipping from multiple breaks?",
          a: "Yes! If you participate in multiple breaks close together, we can hold and ship your cards together. Just let us know before we ship."
        }
      ]
    },
    {
      category: "Policies",
      questions: [
        {
          q: "Can I cancel or get a refund?",
          a: "Due to the nature of live breaks, all sales are final once a break is full or 48 hours before the scheduled time. If the break is canceled by us, you'll receive a full refund."
        },
        {
          q: "What if I don't get any hits?",
          a: "That's the nature of card breaking - not every spot will have hits. However, you always receive all base cards and inserts from your team/spot. The thrill is in the chase!"
        },
        {
          q: "What happens if a break doesn't fill?",
          a: "If a break doesn't fill by the scheduled time, we'll either postpone it or offer refunds. You'll be notified via email with options."
        },
        {
          q: "Do you offer international shipping?",
          a: "Currently, we only ship within the United States. International shipping may be available in the future - check back or contact us for updates."
        }
      ]
    },
    {
      category: "Product & Inventory",
      questions: [
        {
          q: "Where do you source your products?",
          a: "We purchase all products from authorized distributors and reputable retailers. We never buy from unauthorized sources or resellers."
        },
        {
          q: "Are boxes factory sealed?",
          a: "Yes, all boxes are factory sealed and opened on camera during the live break. We show the sealed box before opening to ensure authenticity."
        },
        {
          q: "Can I request a specific product to break?",
          a: "Absolutely! We take product requests. Reach out via email or Instagram DM and let us know what you'd like to see. If there's enough interest, we'll schedule it!"
        },
        {
          q: "Do you sell singles or sealed products?",
          a: `Yes! Visit our ${brandConfig.name} Shop page to browse individual cards and sealed products available for purchase.`
        }
      ]
    },
    {
      category: "Contact & Support",
      questions: [
        {
          q: "How can I contact you?",
          a: `Reach out via email (${brandConfig.email || 'contact@gryphoncollects.com'}) or DM us on Instagram (@gryphoncollects). We respond within 24 hours!`
        },
        {
          q: "Do you have a Discord or community?",
          a: "Not yet, but we're building one! Join our newsletter to be notified when our Discord launches. We'll host exclusive breaks and giveaways for community members."
        },
        {
          q: "Can I follow the action on social media?",
          a: `Yes! Follow us on Instagram (@gryphoncollects), YouTube (@gryphoncollects), and TikTok (@gryphoncollects) for break highlights, big hits, and updates.`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Everything you need to know about {brandConfig.name} card breaks
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-text-primary mb-4">Jump to section:</h2>
          <div className="flex flex-wrap gap-2">
            {faqs.map((section, index) => (
              <a
                key={index}
                href={`#${section.category.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm bg-background border border-border text-text-primary px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition"
              >
                {section.category}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} id={section.category.toLowerCase().replace(/ /g, '-')}>
              <h2 className="text-2xl font-bold text-primary mb-6 pb-3 border-b-2 border-primary/30">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition">
                    <h3 className="text-lg font-semibold text-text-primary mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-2xl">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Still Have Questions?
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            We're here to help! Reach out via email or Instagram DM and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {brandConfig.email && (
              <a
                href={`mailto:${brandConfig.email}`}
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Email Us
              </a>
            )}
            {brandConfig.social.instagram && (
              <a
                href={brandConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                DM on Instagram
              </a>
            )}
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/how-it-works"
            className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition group"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition">
              How It Works →
            </h3>
            <p className="text-text-secondary text-sm">
              New to card breaking? Learn the step-by-step process from start to finish.
            </p>
          </Link>
          <Link
            href="/breaks"
            className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition group"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition">
              View Breaks →
            </h3>
            <p className="text-text-secondary text-sm">
              Browse upcoming breaks and reserve your spot today!
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
