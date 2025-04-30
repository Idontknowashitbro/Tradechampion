
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is TradeChampionX different from prop firms?",
    answer: "Unlike traditional prop firms that profit when traders fail, our community-focused model distributes 70% of entry fees directly to top performers. We have transparent rules, no hidden disqualification clauses, no restrictive trading windows, and guaranteed payouts with no withdrawal hoops to jump through.",
  },
  {
    question: "How does the dynamic prize pool work?",
    answer: "Our prize pool grows with each participant. 70% of all entry fees go directly to the top performers: 40% to 1st place, 20% to 2nd place, and 10% to 3rd place. This creates a truly community-driven reward system where everyone benefits from growth.",
  },
  {
    question: "How do I connect my cTrader account?",
    answer: "After registering and paying for a challenge, you'll be redirected to cTrader's OAuth page. Simply log in with your cTrader credentials and authorize our application. We'll securely store your access token and automatically sync your trading data every 2 hours throughout the challenge period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cryptocurrency payments through NOWPayments. This includes Bitcoin, Ethereum, and several other popular cryptocurrencies. The payment process is secure and typically confirms within minutes, allowing you to start trading immediately after connecting your cTrader account.",
  },
  {
    question: "How often is the leaderboard updated?",
    answer: "The leaderboard is updated every 2 hours as we sync with the cTrader API. This ensures you have near real-time tracking of your standing against other participants. All trading metrics are pulled directly from cTrader to guarantee accuracy and prevent manipulation.",
  },
  {
    question: "What happens if I exceed the maximum drawdown?",
    answer: "If you exceed the maximum drawdown limit (4% for daily challenges, 6% for weekly challenges, 10% for monthly challenges), you'll be automatically disqualified. You'll receive a notification via Discord, and your status on the leaderboard will be updated. Unlike prop firms, we don't use hidden rules or manipulate markets to force disqualification.",
  },
  {
    question: "Are there any trading restrictions during challenges?",
    answer: "Unlike prop firms with restrictive trading requirements, we allow trading of all major forex pairs, cryptocurrencies, indices, and commodities available on cTrader. There are no specific session restrictions and no manipulated spreads or slippage. You're free to trade as you would in your personal account, while following the challenge rules.",
  },
  {
    question: "Can I participate in multiple challenges simultaneously?",
    answer: "Yes, you can participate in multiple challenges at the same time. Each challenge is tracked separately, allowing you to test different strategies across different timeframes. Many of our successful traders participate in daily, weekly, and monthly challenges concurrently to maximize their earning potential.",
  },
  {
    question: "How do I connect my Discord account?",
    answer: "After registering, you'll receive instructions to connect your Discord account. Once connected, you'll automatically receive the 'Verified Challenger' role in our Discord community. This gives you access to exclusive channels for challenge discussion, trading tips, and special announcements.",
  },
  {
    question: "What happens if there's an issue with my cTrader connection?",
    answer: "If we detect an issue with your cTrader connection, we'll automatically attempt to refresh your access token. If problems persist, you'll receive a notification via email and Discord. Our system includes automatic retry mechanisms, and our support team is available to help resolve any connection issues quickly.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-forex-light">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-white text-forex-primary font-medium rounded-full mb-4 shadow-sm">
            Answers to Your Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-forex-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-forex-neutral">
            Everything you need to know about our trading challenges
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-forex-border/30">
                <AccordionTrigger className="text-lg font-medium text-left py-5 hover:text-forex-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-forex-neutral pb-5 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-12 p-6 bg-forex-light rounded-xl border border-forex-border/30">
            <h3 className="font-bold text-xl mb-3 text-forex-dark">Still have questions?</h3>
            <p className="text-forex-neutral mb-4">
              Our support team is ready to help with any questions about our trading challenges.
            </p>
            <a 
              href="#" 
              className="inline-block px-6 py-3 bg-forex-primary text-white rounded-lg hover:bg-forex-hover transition-colors font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
