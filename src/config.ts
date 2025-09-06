// This file reads configuration variables from the environment.
// In a typical React setup (like Create React App or Vite), these are injected at build time.

interface AppConfig {
  hubbardAgentUrl: string;
  hubbardAgentApiKey: string;
}

const getApiUrl = () => {
    // In a real self-hosted environment, you might have a relative path.
    // For development and this mocked environment, we use a placeholder.
    if (process.env.NODE_ENV === 'production') {
        // This would typically point to your backend service.
        return '/api/hubbard';
    }
    // The mock service is handled internally, but we can use a placeholder for consistency.
    return process.env.REACT_APP_HUBBARD_AGENT_URL || 'http://mock-api/api/hubbard';
}


const config: AppConfig = {
  // URL for the backend API that communicates with the Hubbard Windows Agent.
  hubbardAgentUrl: getApiUrl(),
  
  // API key for authenticating with the backend.
  hubbardAgentApiKey: process.env.REACT_APP_HUBBARD_AGENT_API_KEY || '',
};

if (process.env.NODE_ENV !== 'production' && !config.hubbardAgentApiKey) {
    console.warn('HUBBARD_AGENT_API_KEY environment variable is not set. API requests may fail in a real environment.');
}


export default config;
