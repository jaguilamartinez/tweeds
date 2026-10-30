import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@tinker-works/ui/styles.css';
import '@tinker-works/ui/fonts.css';
import App from './App';
import './site.css';

const root = document.getElementById('root');
if (!root) throw new Error('The playbook needs a root element.');

createRoot(root).render(<StrictMode><App /></StrictMode>);
