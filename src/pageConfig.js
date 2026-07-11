export const pageConfigs = {
  trends: {
    title: 'Hot Trends',
    description: 'Track public and media trends, then turn a selected topic into a script flow.',
    endpoints: [
      { label: 'Aggregated trends', path: '/api/hotlist/list', auth: false, params: { category: 'all' } },
      { label: 'Media trends', path: '/api/hotlist/search', auth: false, params: { source: '抖音' } },
    ],
    actions: ['Send to AI Assistant', 'Save topic', 'Refresh'],
  },
  assistant: {
    title: 'AI Assistant',
    description: 'Instruction sets for copywriting, music, image, and video creation.',
    endpoints: [{ label: 'Instruction sets', path: '/api/instruction_sets', params: { page_size: 100 } }],
    actions: ['Create instruction set', 'Edit selected', 'Open chat'],
  },
  video: {
    title: 'Video Studio',
    description: 'Create, review, remake, assign, and publish generated videos.',
    endpoints: [
      { label: 'Video production tasks', path: '/api/video/production/list' },
      { label: 'Mixed video tasks', path: '/api/video-mix/list' },
    ],
    actions: ['New video', 'Schedule publish', 'Assign team'],
  },
  assets: {
    title: 'Asset Studio',
    description: 'Train digital humans from profile videos or generated images, then manage cloned voices and shared assets.',
    endpoints: [
      { label: 'Digital humans', path: '/api/aihuman/list' },
      { label: 'Authorization videos', path: '/api/aihuman/auth-videos' },
      { label: 'Voices', path: '/api/ai-voice/list' },
      { label: 'Public digital humans', path: '/api/aihuman/common-list' },
      { label: 'Generated images', path: '/api/image-generation/images' },
    ],
    actions: ['Train digital human', 'Image-to-avatar', 'Clone voice', 'Use public asset'],
  },
  music: {
    title: 'Music Studio',
    description: 'Generate songs, instrumentals, voice-based music, and music videos.',
    endpoints: [
      { label: 'Generated music', path: '/api/music/generated' },
      { label: 'Music voices', path: '/api/music/voice/list' },
    ],
    actions: ['Create music', 'Create music voice', 'Make music video'],
  },
  image: {
    title: 'Image Studio',
    description: 'Generate images and reuse selected images for digital-human training.',
    endpoints: [{ label: 'Generated images', path: '/api/image-generation/images' }],
    actions: ['Generate image', 'Train image avatar', 'Upload reference'],
  },
  materials: {
    title: 'Materials',
    description: 'Upload, preview, select, and delete reusable production materials.',
    endpoints: [{ label: 'Material library', path: '/api/material/list' }],
    actions: ['Upload material', 'Select for video', 'Delete selected'],
  },
  templates: {
    title: 'Templates',
    description: 'Browse video templates, cover templates, and team video presets.',
    endpoints: [
      { label: 'Video templates', path: '/api/shanjian/video-templates', auth: false },
      { label: 'Cover templates', path: '/api/shanjian/cover-templates', auth: false },
      { label: 'Team presets', path: '/api/team-video-preset/list' },
    ],
    actions: ['Use template', 'Set default preset', 'Create preset'],
  },
  billing: {
    title: 'Billing',
    description: 'Check quotas and plans for digital humans, voices, videos, and AI music.',
    endpoints: [
      { label: 'Current plan', path: '/api/plan/user-plan' },
      { label: 'Plan list', path: '/api/plan/list', auth: false },
    ],
    actions: ['Upgrade plan', 'Refresh quota', 'View invoices'],
  },
  settings: {
    title: 'Settings',
    description: 'User profile, account preferences, subscriptions, and agreements.',
    endpoints: [
      { label: 'User profile', path: '/api/user/info' },
      { label: 'Subscribe message config', path: '/api/user/subscribe-message/config' },
    ],
    actions: ['Save profile', 'Bind phone', 'Sign out'],
  },
};
