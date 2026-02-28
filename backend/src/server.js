import app from './app.js';

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () =>
  console.log(`🚀 Backend listo en http://localhost:${PORT}  [${process.env.NODE_ENV || 'development'}]`)
);

/* ─── Graceful shutdown ─── */
const shutdown = (signal) => {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  });
  // Force close after 10 s
  setTimeout(() => process.exit(1), 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
