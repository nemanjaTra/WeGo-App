import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="940859404597-eau25kd34721pa95ff9l7io082a8v1g3.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </StrictMode>,
)