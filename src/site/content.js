import { localeMeta, localize, supportedLocales } from './localization.js';
import { helpPages } from './help.js';

export const siteName = 'Kali';
export { localeMeta, supportedLocales };

export const basePages = [
    {
      slug: 'ai-video-generator',
      title: 'AI Video Generator for Global Content Teams',
      description: 'Turn a topic or script into a production-ready video with digital humans, voices, templates, music, covers, and publishing workflows.',
      eyebrow: 'AI VIDEO PRODUCTION',
      headline: 'From an idea to a publish-ready video in one workflow',
      lead: 'Kali connects trend discovery, script creation, digital humans, cloned voices, visual assets, music, templates, and publishing into one browser-based production flow.',
      bullets: ['Start from a trend, brief, or finished script', 'Reuse approved digital humans, voices, and brand assets', 'Create, review, schedule, and manage videos in one workspace'],
      sections: [
        ['Build from reusable assets', 'Select a digital human, voice, video style, cover style, background music, and supporting material without rebuilding the project every time.'],
        ['Keep production visible', 'Track drafts, processing jobs, completed videos, failures, and publishing status from a single production list.'],
        ['Designed for repeatable output', 'Team presets and reusable templates reduce manual setup for recurring short-form content.'],
      ],
      faq: [['What can I use as input?', 'You can begin with a topic, title, hashtags, a complete script, images, videos, and assets already saved in the workspace.'], ['Does Kali replace editing software?', 'Kali is designed for repeatable AI-assisted production. Teams can still download completed media for additional editing when a project needs custom post-production.'], ['Can I publish immediately?', 'Publishing workflows support account selection and immediate or scheduled publishing when the relevant account connection is available.']],
    },
    {
      slug: 'digital-human',
      title: 'Create and Manage Digital Humans for AI Video',
      description: 'Train video-based or image-based digital humans and reuse approved avatars in AI video production.',
      eyebrow: 'DIGITAL HUMAN STUDIO',
      headline: 'Create a digital presenter you can use in every video',
      lead: 'Create digital humans from approved video or image materials, manage personal and shared avatars, and bring them directly into the video production workflow.',
      bullets: ['Video-based and image-based creation flows', 'Explicit image and likeness authorization steps', 'Personal and shared avatar libraries'],
      sections: [['Two creation paths', 'Use a personal image generated in Image Studio or provide the required training and authorization videos for a video-based digital human.'], ['Consent is part of the workflow', 'Image collection and digital-human authorization are confirmed at the point where sensitive materials are submitted.'], ['Reuse without repeating setup', 'Once ready, a digital human can be previewed and selected in future video projects.']],
      faq: [['What materials are required?', 'Requirements depend on the creation path. Video-based training uses a profile video and authorization video; image-based creation uses an eligible image and authorization video.'], ['Can team members share digital humans?', 'The asset library distinguishes personal and shared digital humans so eligible assets can be reused in production.'], ['Can I use someone else’s likeness?', 'Only upload and use materials for which you have sufficient authorization and rights.']],
    },
    {
      slug: 'voice-cloning',
      title: 'AI Voice Cloning for Multilingual Video Production',
      description: 'Record or upload authorized voice material, train a reusable voice, preview it, and apply it to digital-human video projects.',
      eyebrow: 'VOICE STUDIO',
      headline: 'Turn an authorized recording into a reusable production voice',
      lead: 'Kali provides a guided voice-training flow with recording or file upload, language selection, explicit voiceprint consent, and a library for previewing available voices.',
      bullets: ['Record in the browser or upload an audio file', 'Choose the source language before training', 'Preview personal and shared voices before production'],
      sections: [['A clear submission flow', 'Provide a clean sample, confirm the source language, review the authorization terms, and submit the training task.'], ['Built into video creation', 'Select an available voice and speaking speed when configuring a digital-human video.'], ['Rights-aware by design', 'Voiceprint authorization is presented separately from general account terms because voice data requires specific consent.']],
      faq: [['How long can the recording be?', 'The current workflow accepts voice material up to two minutes.'], ['Can I listen before using a voice?', 'Available voices can be previewed from the asset library before they are selected for production.'], ['Do I need permission to clone a voice?', 'Yes. You must have the required rights and provide the explicit authorization requested in the training flow.']],
    },
    {
      slug: 'ai-music-generator',
      title: 'AI Music Generator for Songs and Video Soundtracks',
      description: 'Create music from a description or lyrics, review multiple results, download completed tracks, and turn music into video.',
      eyebrow: 'AI MUSIC STUDIO',
      headline: 'Create a song, instrumental, or soundtrack from a clear brief',
      lead: 'Describe the mood and style, provide lyrics when needed, choose a voice option, and manage generated tracks and related music videos from one studio.',
      bullets: ['Prompt-based, lyric-based, and instrumental creation', 'One task can return multiple completed tracks', 'Preview, download, retry, and create a music video'],
      sections: [['Choose the right creation mode', 'Start with a musical description, write a complete lyric-driven song, or generate an instrumental track for background use.'], ['Keep every version together', 'Generated tracks remain attached to their task so alternatives can be compared and downloaded without losing context.'], ['Move from audio to video', 'A completed track can be used to start a related music-video task.']],
      faq: [['Can I generate instrumental music?', 'Yes. The creation flow supports an instrumental mode without sung lyrics.'], ['Can a task create more than one song?', 'A generation task may contain multiple completed tracks, each available for preview and download when ready.'], ['What happens if generation fails?', 'Failed tasks remain visible and can be retried from the music detail workflow.']],
    },
    {
      slug: 'pricing',
      title: 'Kali Plans and Usage',
      description: 'Understand how Kali trials, plan quotas, production usage, and team workflows are organized.',
      eyebrow: 'PLANS & USAGE',
      headline: 'Choose a plan that fits your production volume',
      lead: 'Kali tracks plan usage inside the workspace so teams can see available production capacity before starting resource-intensive creation tasks.',
      bullets: ['Trial access for eligible creation features', 'Usage visibility inside the workspace', 'Plan options designed around production volume'],
      sections: [['Start with the workflow', 'Use trial access to understand the end-to-end production process before selecting ongoing capacity.'], ['See usage where work happens', 'Current quotas and consumption are shown in the signed-in workspace rather than hidden from the production team.'], ['Match the plan to output', 'Select capacity based on the mix of videos, images, music, voice, and digital-human work your team expects to produce.']],
      faq: [['Is there a free trial?', 'The workspace presents trial benefits for eligible accounts and features. Exact availability is shown when you sign in.'], ['Where can I see current pricing?', 'Current plan details, quotas, and purchase options are shown in the billing area of the workspace.'], ['Do all creation types use the same quota?', 'Different production capabilities may use different plan allowances. Review the current billing page before starting a large batch.']],
    },
    {
      slug: 'payment-policy',
      title: 'Kali Payment Policy',
      description: 'Understand prices, currencies, taxes, payment processing, plan activation, credits, and recurring charges for Kali purchases.',
      eyebrow: 'PAYMENT POLICY',
      headline: 'Clear payment terms before you confirm a purchase',
      lead: 'The checkout page shows the plan or service, amount, currency, billing period, available payment method, and applicable taxes before you authorize payment.',
      bullets: ['Review the final amount before confirming payment', 'Plans and credits activate after payment is confirmed', 'Recurring billing applies only when disclosed at checkout'],
      sections: [
        ['Prices, currencies, and taxes', 'Displayed prices may vary by region, currency, plan, promotion, and applicable tax rules. The final payable amount is shown before you confirm the order.'],
        ['Payment processing', 'Payments may be processed by authorized third-party payment providers. Kali does not require you to send passwords, verification codes, or complete card details by email or support message.'],
        ['Plan and credit activation', 'A plan, credit package, or paid capability becomes available after successful payment confirmation. Usage is deducted according to the rules shown in the workspace and at purchase.'],
        ['Renewals and cancellation', 'If a purchase renews automatically, the renewal period, amount, and cancellation method will be disclosed before payment. Cancelling a future renewal does not automatically refund an earlier charge.'],
      ],
      faq: [['When is my plan activated?', 'Eligible plans and credits are normally activated after the payment provider confirms a successful charge.'], ['Will Kali renew my plan automatically?', 'Only purchases clearly marked as recurring at checkout renew automatically. One-time purchases do not become recurring without disclosure.'], ['What should I do if a charge looks incorrect?', 'Do not start a chargeback immediately. Contact feedback@xyaip.fun with your account email, order reference, charge date, amount, and a description of the issue.']],
    },
    {
      slug: 'refund-policy',
      title: 'Kali Refund Policy',
      description: 'Learn when a Kali payment may qualify for a refund, which consumed services are normally non-refundable, and how to submit a request.',
      eyebrow: 'REFUND POLICY',
      headline: 'A practical refund process for billing and service problems',
      lead: 'Refund eligibility depends on the reason for the request, whether credits or services have been consumed, the payment method, and any mandatory rights under applicable law.',
      bullets: ['Duplicate or incorrect charges can be reviewed', 'Unused purchases may qualify depending on the circumstances', 'Consumed generation work is normally non-refundable'],
      sections: [
        ['When a refund may apply', 'We will review duplicate charges, incorrect billing amounts, payments for services that were not delivered because of a verified platform failure, and unused purchases where required by applicable law or approved after review.'],
        ['Normally non-refundable items', 'Consumed credits, completed generation tasks, downloaded or delivered digital results, third-party costs already incurred, and accounts restricted for policy violations are normally non-refundable unless applicable law requires otherwise.'],
        ['How to request a refund', 'Email feedback@xyaip.fun with the account email, order or payment reference, purchase date, amount, reason, and relevant evidence. Never include passwords, verification codes, or complete payment-card details.'],
        ['Review and payment timing', 'We will confirm receipt and review the request against usage and payment records. Approved refunds return to the original payment method when possible; final arrival time depends on the payment provider and financial institution.'],
      ],
      faq: [['Does cancelling a subscription create a refund?', 'Cancellation stops a future renewal when completed before the next billing date. It does not automatically refund the current billing period.'], ['Can used credits be refunded?', 'Credits already consumed by generation or processing tasks are normally non-refundable because the underlying service cost has already been incurred.'], ['How long does a refund take?', 'Review time depends on the request and available records. After approval, the payment provider or bank controls the final settlement time.']],
    },
    {
      slug: 'about',
      title: 'About Kali',
      description: 'Learn how Kali brings trend discovery, AI creation, reusable assets, video production, and publishing into one content workflow.',
      eyebrow: 'ABOUT KALI',
      headline: 'A connected production workspace for modern content teams',
      lead: 'Kali is focused on turning fragmented AI tools into a repeatable content-production system for global creators and teams.',
      bullets: ['One workflow from discovery to publishing', 'Reusable team assets and production presets', 'Built for multilingual, multi-market content operations'],
      sections: [['Why we built it', 'Content teams often move ideas, scripts, media, and task status across disconnected tools. Kali brings those steps into one operational workspace.'], ['What we prioritize', 'Clear workflows, reusable assets, visible task status, and explicit authorization for sensitive voice and likeness data.'], ['Who it is for', 'Creators and teams producing recurring short-form video, digital-human content, social campaigns, and localized media.']],
      faq: [['Is Kali the same as Yixiu?', 'Kali is the international-facing product brand. Yixiu refers to the underlying product lineage and system used during its development.'], ['Who maintains the service?', 'The Kali product and operations team maintains the service.'], ['How can I contact the team?', 'Use the contact page for product feedback, business enquiries, and privacy requests.']],
    },
    {
      slug: 'contact',
      title: 'Contact Kali',
      description: 'Contact the Kali team for product feedback, business enquiries, privacy requests, and authorization withdrawal.',
      eyebrow: 'CONTACT',
      headline: 'Reach the right team without going through a support maze',
      lead: 'Use the appropriate mailbox below and include enough context for the team to identify your account, task, or request.',
      bullets: ['Product feedback: feedback@xyaip.fun', 'Privacy, deletion, and consent withdrawal: privacy@xyaip.fun', 'Do not send passwords or verification codes'],
      sections: [['Product and business', 'Send product feedback, partnership questions, and general enquiries to feedback@xyaip.fun.'], ['Privacy requests', 'Send access, correction, deletion, account cancellation, and consent-withdrawal requests to privacy@xyaip.fun.'], ['What to include', 'Provide the relevant account identifier, task time, feature name, and a concise description. Never include your password or one-time verification code.']],
      faq: [['Which address handles privacy requests?', 'Use privacy@xyaip.fun for personal-information rights, deletion, account cancellation, and withdrawal of authorization.'], ['How should I report a production problem?', 'Include the approximate time, feature, task identifier if available, and what you expected to happen.'], ['Will the team ask for my password?', 'No. Do not send passwords, verification codes, or other authentication secrets.']],
    },
  ...helpPages,
];

export const pagesByLocale = Object.fromEntries(supportedLocales.map((locale) => [locale, localize(basePages, locale)]));

export function getPage(locale, slug) {
  return pagesByLocale[locale]?.find((page) => page.slug === slug);
}

export function pagePath(locale, slug = '') {
  return `/${locale}/${slug ? `${slug}/` : ''}`;
}
