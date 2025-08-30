const APIServer = require('./interfaces/api_server');

async function main() {
  console.log('Starting Progressive Framework V5...');
  
  const server = new APIServer(process.env.PORT || 3000);
  
  try {
    await server.start();
    console.log('System started successfully');
  } catch (error) {
    console.error('Failed to start system:', error);
    process.exit(1);
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });
}

main().catch(console.error);
