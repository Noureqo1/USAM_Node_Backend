module.exports = {
  apps: [
    {
      name: 'skills-ideas-api',
      script: './server.js',
      instances: 2, 
      exec_mode: 'cluster', 
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Cluster-specific settings
      listen_timeout: 8000,
      kill_timeout: 5000,
      wait_ready: true,
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10
    }
  ]
};
