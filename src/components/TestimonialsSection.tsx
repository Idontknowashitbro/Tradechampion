
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex M.",
    role: "Day Trader",
    avatar: "AM",
    content: "After trying multiple prop firms that seemed designed to make me fail, TradeChampionX is a breath of fresh air. The transparent rules and fair evaluation made all the difference. I won a weekly challenge and received my payout within 24 hours!",
    stars: 5
  },
  {
    name: "Jessica K.",
    role: "Swing Trader",
    avatar: "JK",
    content: "I love that 70% of fees go back to traders. The dynamic prize pool means everyone benefits from more participation. As someone who's been trading for years, this is the most transparent platform I've found.",
    stars: 5
  },
  {
    name: "Daniel R.",
    role: "Algorithmic Trader",
    avatar: "DR",
    content: "The direct cTrader integration gives me confidence that my trades are being recorded accurately. No more mysterious slippage or spread widening during crucial trades. This is how trading challenges should be.",
    stars: 5
  },
  {
    name: "Sophia T.",
    role: "Forex Trader",
    avatar: "ST",
    content: "I was skeptical after being burned by traditional prop firms, but the weekly challenges here are genuinely fair. The transparent performance tracking and clear rules have helped me focus on trading instead of worrying about fine print.",
    stars: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-forex-light text-forex-primary font-medium rounded-full mb-4 shadow-sm">
            Trader Experiences
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-forex-dark mb-4">
            What Our Traders Say
          </h2>
          <p className="text-lg text-forex-neutral">
            Hear from traders who have experienced the TradeChampionX difference
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="glass-card h-full p-6 m-1">
                    <div className="flex items-start mb-4">
                      <Avatar className="h-12 w-12 mr-4 border-2 border-forex-primary/20">
                        <AvatarFallback className="bg-forex-primary/10 text-forex-primary">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h4 className="font-bold text-lg text-forex-dark">
                          {testimonial.name}
                        </h4>
                        <p className="text-forex-neutral text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-forex-neutral">
                      "{testimonial.content}"
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="static translate-y-0 mr-2" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
