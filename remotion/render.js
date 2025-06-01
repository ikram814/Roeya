const { bundle } = require('@remotion/bundler');
const { getCompositions, renderMedia } = require('@remotion/renderer');
const path = require('path');

const start = async () => {
  // Créer un bundle webpack
  const bundled = await bundle(path.join(__dirname, './index.jsx'));

  // Obtenir les compositions disponibles
  const compositions = await getCompositions(bundled);
  const composition = compositions.find((c) => c.id === 'MyVideo');

  if (!composition) {
    throw new Error('Could not find composition');
  }

  // Rendre la vidéo
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: `out/video.mp4`,
    inputProps: {
      // Ajoutez vos props ici
    },
  });
};

start()
  .then(() => {
    console.log('Render completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error occurred:', err);
    process.exit(1);
  }); 