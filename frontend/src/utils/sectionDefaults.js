export function createDefaultSection(type) {
  const timestamp = Date.now().toString().slice(-4);
  const id = `${type}-${timestamp}`;

  switch (type) {
    case 'hero':
      return {
        id,
        type: 'hero',
        variant: 'split',
        visible: true,
        customLabel: 'Hero Fold',
        content: {
          badge: 'Next-Generation Innovation',
          headline: 'Transform Your Workflow with Intelligent Automation',
          subtitle: 'The modern platform built to scale operations, eliminate manual bottlenecks, and accelerate measurable growth.',
          primaryCta: 'Start Free Trial',
          secondaryCta: 'Schedule Demo',
          imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80'
        }
      };

    case 'stats':
      return {
        id,
        type: 'stats',
        variant: 'grid',
        visible: true,
        customLabel: 'Key Metrics',
        content: {
          badge: 'Proven Metrics',
          title: 'Measurable Quantitative Impact',
          description: 'High-performing organizations achieve proven results using our architecture.',
          metrics: [
            { value: '99.8%', label: 'Efficiency Gain', description: 'Zero manual bottlenecks' },
            { value: '3.5x', label: 'Faster Execution', description: 'Real-time streamlined turnaround' },
            { value: '45k+', label: 'Active Users', description: 'Across enterprise and community teams' },
            { value: '$0', label: 'Hidden Setup Fees', description: 'Transparent and predictable licensing' }
          ]
        }
      };

    case 'features':
      return {
        id,
        type: 'features',
        variant: 'three-column',
        visible: true,
        customLabel: 'Feature Pillars',
        content: {
          badge: 'Core Capabilities',
          title: 'Engineered for Performance and Scale',
          description: 'Everything required to deploy, monitor, and optimize your operations.',
          items: [
            {
              title: 'Automated Operations',
              description: 'End-to-end hands-off workflows with instant sync across all connected endpoints.',
              icon: 'sparkles'
            },
            {
              title: 'Real-Time Intelligence',
              description: 'Actionable monitoring telemetry delivering proactive diagnostics and notifications.',
              icon: 'activity'
            },
            {
              title: 'Enterprise Security',
              description: 'Multi-layered cryptographic verification with strict access control policies.',
              icon: 'shield'
            }
          ]
        }
      };

    case 'showcase':
      return {
        id,
        type: 'showcase',
        variant: 'grid',
        visible: true,
        customLabel: 'Curated Catalog',
        content: {
          badge: 'Explore Catalog',
          title: 'Featured Collection & Rate Tiers',
          description: 'Browse specialized editions, standard tiers, and archival access available on-demand.',
          items: [
            {
              title: 'Premium Foundation Edition',
              category: 'Flagship Core',
              price: '$2.99 / item',
              badge: 'Popular',
              description: 'Comprehensive features curated for active enthusiasts and frequent subscribers.',
              imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
              ctaText: 'Access Item'
            },
            {
              title: 'Advanced Research Archives',
              category: 'Special Edition',
              price: '$4.99 / term',
              badge: 'Exclusive',
              description: 'In-depth reference compendiums designed for scholarly and institutional research.',
              imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3745b?auto=format&fit=crop&w=600&q=80',
              ctaText: 'Reserve Now'
            },
            {
              title: 'Preserved Historical Folio',
              category: 'Archival Vault',
              price: '$9.99 / loan',
              badge: 'Vault Access',
              description: 'Rare protected manuscripts and limited-run collector editions with special handling.',
              imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
              ctaText: 'Request Access'
            }
          ]
        }
      };

    case 'steps':
      return {
        id,
        type: 'steps',
        variant: 'process-flow',
        visible: true,
        customLabel: 'Process Workflow',
        content: {
          badge: 'Seamless Process',
          title: 'How It Works in 3 Frictionless Steps',
          description: 'Experience a smooth end-to-end journey from setup to daily execution.',
          steps: [
            {
              stepNumber: 1,
              title: 'Discover & Select',
              description: 'Browse items or services, filter specifications, and initiate reservation in seconds.'
            },
            {
              stepNumber: 2,
              title: 'Instant Check-Out',
              description: 'Scan barcodes or authenticate digital passes for frictionless self-service verification.'
            },
            {
              stepNumber: 3,
              title: 'Automated Check-In',
              description: 'Return or complete anytime via automated drop boxes with real-time digital receipts.'
            }
          ]
        }
      };

    case 'pricing':
      return {
        id,
        type: 'pricing',
        variant: 'highlighted-middle',
        visible: true,
        customLabel: 'Pricing Plans',
        content: {
          badge: 'Transparent Pricing',
          title: 'Predictable Tiered Membership Plans',
          description: 'Choose the plan that fits your volume with zero hidden maintenance charges.',
          plans: [
            {
              name: 'Starter Community',
              price: '$12',
              period: '/month',
              description: 'For individuals and emerging practitioners',
              features: ['Up to 10 active items', 'Standard 14-day duration', 'Mobile self-service app', 'Email support'],
              cta: 'Start Starter Plan',
              highlighted: false
            },
            {
              name: 'Professional Pro',
              price: '$29',
              period: '/month',
              description: 'Our most popular tier for power users and teams',
              features: ['Unlimited active items', 'Extended 30-day window', 'Zero late penalties', 'Priority hold queue', 'Multi-device sync'],
              cta: 'Choose Pro Plan',
              highlighted: true
            },
            {
              name: 'Enterprise Campus',
              price: '$99',
              period: '/month',
              description: 'For large facilities and institutional networks',
              features: ['Multi-branch network sync', 'Unlimited administrative seats', 'Custom API & RFID integration', '24/7 dedicated support'],
              cta: 'Contact Sales',
              highlighted: false
            }
          ]
        }
      };

    case 'testimonials':
      return {
        id,
        type: 'testimonials',
        variant: 'cards',
        visible: true,
        customLabel: 'User Reviews',
        content: {
          badge: 'Social Proof',
          title: 'Trusted by Leaders and Community Members',
          description: 'Discover how teams achieve breakthrough efficiency and satisfaction.',
          testimonials: [
            {
              quote: 'Switching to this automated platform eliminated desk queues by 80%. Patrons love the self-service flow!',
              name: 'Elena Rostova',
              role: 'Head of Circulation, Metropolitan Library',
              rating: 5,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
            },
            {
              quote: 'The tiered lending system and clear catalog rates made managing our collections seamless and transparent.',
              name: 'David Chen',
              role: 'Director of Academic Resources',
              rating: 5,
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            },
            {
              quote: 'Unbelievable ease of use. The UI is gorgeous, and our patrons give it a 5-star rating consistently.',
              name: 'Sarah Jenkins',
              role: 'Campus Community Lead',
              rating: 5,
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
            }
          ]
        }
      };

    case 'faq':
      return {
        id,
        type: 'faq',
        variant: 'accordion',
        visible: true,
        customLabel: 'FAQ Accordion',
        content: {
          badge: 'Common Inquiries',
          title: 'Frequently Asked Questions',
          description: 'Everything you need to know about circulation, memberships, and automated returns.',
          items: [
            {
              question: 'How do lending prices and borrowing limits work?',
              answer: 'Standard collections are included in your active membership. Specialty archives and high-demand textbooks feature transparent weekly lending rates set by administrators.'
            },
            {
              question: 'What happens when books are returned via smart drops?',
              answer: 'Smart drop chutes scan RFID or barcode tags instantly, verifying the return in real-time and clearing any overdue notices immediately.'
            },
            {
              question: 'Can I customize plans and add new sections at any time?',
              answer: 'Yes! The Studio lets you add, duplicate, reorder, and edit any section with instant live preview and zero-friction export.'
            }
          ]
        }
      };

    case 'contact':
      return {
        id,
        type: 'contact',
        variant: 'split',
        visible: true,
        customLabel: 'Lead Capture',
        content: {
          badge: 'Zero-Friction Access',
          headline: 'Start Exploring in Under 60 Seconds',
          subtitle: 'Enter your email to gain immediate patron access, explore live inventories, and test the self-checkout system.',
          buttonText: 'Claim Your Access',
          emailPlaceholder: 'Enter your work or personal email...',
          secondaryText: 'No credit card required • Instant automated onboarding'
        }
      };

    default:
      return {
        id,
        type: 'features',
        variant: 'three-column',
        visible: true,
        customLabel: 'Custom Section',
        content: {
          title: 'New Section',
          description: 'Configure this section using the editor.'
        }
      };
  }
}
