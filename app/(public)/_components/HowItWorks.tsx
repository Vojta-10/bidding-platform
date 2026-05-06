import { ArrowRight, Gavel, Search, Trophy } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: 1,
    Icon: Search,
    heading: 'Browse',
    body: 'Browse hundreds of live auctions across all categories.',
  },
  {
    number: 2,
    Icon: Gavel,
    heading: 'Bid',
    body: "Place your bid before the clock runs out — raise anytime you're outbid.",
  },
  {
    number: 3,
    Icon: Trophy,
    heading: 'Win',
    body: 'Highest bidder at deadline takes it home.',
  },
];

export function HowItWorks() {
  return (
    <section className='bg-muted/20 border-t border-border py-24'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <h2 className='font-heading text-2xl font-semibold tracking-tight text-center mb-16'>
          How It Works
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6'>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className='flex flex-col items-center text-center gap-5'
            >
              {/* Circle with half-connector lines on desktop */}
              <div className='relative w-full flex justify-center'>
                {i > 0 && (
                  <div className='hidden md:block absolute top-1/2 left-0 right-1/2 h-0 border-t border-dashed border-muted-foreground/30' />
                )}
                {i < steps.length - 1 && (
                  <div className='hidden md:block absolute top-1/2 left-1/2 right-0 h-0 border-t border-dashed border-muted-foreground/30' />
                )}
                <div className='relative z-10 size-8 rounded-full bg-primary flex items-center justify-center shrink-0'>
                  <span className='text-xs font-bold text-primary-foreground'>
                    {step.number}
                  </span>
                </div>
              </div>

              <step.Icon className='size-6 text-muted-foreground' />

              <div>
                <h3 className='font-heading text-lg font-semibold'>
                  {step.heading}
                </h3>
                <p className='text-sm text-muted-foreground mt-1.5 max-w-[22ch] mx-auto'>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className='text-center mt-16'>
          <Link
            href='/auctions/new'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5'
          >
            Ready to start? Create your first listing{' '}
            <ArrowRight className='size-4' />
          </Link>
        </p>
      </div>
    </section>
  );
}
