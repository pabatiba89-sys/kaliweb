// Add approved, public media here. Empty sources render an illustration, never a fake player.
export const showcaseMedia = {
  overview: { src: '', poster: '/previews/creative-studio.webp', type: 'video/mp4', captions: [] },
  'ai-video-generator': { src: '', poster: '/previews/creative-studio.webp', type: 'video/mp4', captions: [] },
  'digital-human': { src: '', poster: '/previews/creative-studio.webp', type: 'video/mp4', captions: [] },
  'voice-cloning': { src: '', poster: '/previews/creative-studio.webp', type: 'video/mp4', captions: [] },
  'ai-music-generator': { src: '', poster: '/previews/music-studio.webp', type: 'video/mp4', captions: [] },
};

export const productScenes = {
  'ai-video-generator': { position: 'center', label: 'AI video', page: 'ai-video' },
  'digital-human': { position: 'left', label: 'Digital humans', page: 'assets' },
  'voice-cloning': { position: 'right', label: 'Voice cloning', page: 'speech' },
  'ai-music-generator': { position: 'full', label: 'AI music', page: 'music' },
};

export const demoSteps = [
  { title: 'Find the angle', label: 'Discover', body: 'Start from a trend, topic, brief, or existing content idea.' },
  { title: 'Shape the script', label: 'Write', body: 'Use an assistant, refine the copy, and keep the selected context attached.' },
  { title: 'Assemble production', label: 'Produce', body: 'Select approved people, voices, templates, music, covers, and supporting media.' },
  { title: 'Review and publish', label: 'Video publishing', body: 'Track production status, download the result, or continue into publishing.' },
];
