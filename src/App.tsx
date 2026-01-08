import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeToggle from './components/ThemeToggle';
import FloatingAudioButton from './components/FloatingAudioButton';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import QuickAccessPanel from './components/QuickAccessPanel';
import OfflineIndicator from './components/OfflineIndicator';
import InstallPrompt from './components/InstallPrompt';
import { AudioProvider } from './contexts/AudioContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { offlineService } from './services/offlineService';
import { initializeNativeFeatures, setupAppStateListeners } from './utils/capacitor';
import './App.css';

// Lazy load routes for code splitting and better performance
// This reduces initial bundle size and improves load times
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AreasIndex = lazy(() => import('./pages/AreasIndex'));
const AreaDetail = lazy(() => import('./pages/AreaDetail'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const LessonPlansIndex = lazy(() => import('./pages/LessonPlansIndex'));
const LessonPlansByArea = lazy(() => import('./pages/LessonPlansByArea'));
const LessonPlansAll = lazy(() => import('./pages/LessonPlansAll'));
const LessonPlanDetail = lazy(() => import('./pages/LessonPlanDetail'));
const AudioLessons = lazy(() => import('./pages/AudioLessons'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const FlashcardsStudy = lazy(() => import('./pages/FlashcardsStudy'));
const Quizzes = lazy(() => import('./pages/Quizzes'));
const QuizTake = lazy(() => import('./pages/QuizTake'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Notes = lazy(() => import('./pages/Notes'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const AppendixDetail = lazy(() => import('./pages/AppendixDetail'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    color: 'var(--text-secondary)',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
      <div>Loading...</div>
    </div>
  </div>
);

function App() {
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Initialize native features (Capacitor)
    initializeNativeFeatures();
    let cleanupAppListeners: (() => void) | null = null;
    
    setupAppStateListeners().then(cleanup => {
      cleanupAppListeners = cleanup;
    });

    // Register service worker on mount (web only, or if supported in native)
    if ('serviceWorker' in navigator) {
      offlineService.registerServiceWorker().catch(error => {
        console.error('Failed to register service worker:', error);
      });
    }

    // Listen for update available event
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener('sw-update-available', handleUpdateAvailable);

    // Listen for service worker controller change (update activated)
    const handleControllerChange = () => {
      setUpdateAvailable(false);
      // Reload page to use new service worker
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      if (cleanupAppListeners) {
        cleanupAppListeners();
      }
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const handleUpdateNow = async () => {
    await offlineService.skipWaiting();
    // Page will reload automatically via controllerchange event
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AudioProvider>
          <Router basename="/cfi-app-offline">
          <OfflineIndicator />
          {updateAvailable && (
            <div className="update-notification">
              <div className="update-notification-content">
                <span>🔄 New version available</span>
                <button onClick={handleUpdateNow} className="update-button">
                  Update Now
                </button>
              </div>
            </div>
          )}
          <ThemeToggle />
          <FloatingAudioButton />
          <InstallPrompt />
          <button
            className="quick-access-trigger"
            onClick={() => setIsQuickAccessOpen(true)}
            title="Quick Access Bookmarks"
            aria-label="Open Quick Access"
          >
            ⭐
          </button>
          <QuickAccessPanel
            isOpen={isQuickAccessOpen}
            onClose={() => setIsQuickAccessOpen(false)}
          />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/areas" element={<AreasIndex />} />
              <Route path="/area/:areaNumber" element={<AreaDetail />} />
              <Route path="/area/:areaNumber/task/:taskLetter" element={<TaskDetail />} />
              <Route path="/lesson-plans" element={<ProtectedRoute><LessonPlansIndex /></ProtectedRoute>} />
              <Route path="/lesson-plans/area/:areaNumber" element={<ProtectedRoute><LessonPlansByArea /></ProtectedRoute>} />
              <Route path="/lesson-plans/all" element={<ProtectedRoute><LessonPlansAll /></ProtectedRoute>} />
              <Route path="/lesson-plan/:lessonPlanId" element={<ProtectedRoute><LessonPlanDetail /></ProtectedRoute>} />
              <Route path="/audio-lessons" element={<ProtectedRoute><AudioLessons /></ProtectedRoute>} />
              <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
              <Route path="/flashcards/study" element={<ProtectedRoute><FlashcardsStudy /></ProtectedRoute>} />
              <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
              <Route path="/quizzes/take" element={<ProtectedRoute><QuizTake /></ProtectedRoute>} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/appendix/:appendixNumber" element={<AppendixDetail />} />
            </Routes>
          </Suspense>
          <GlobalAudioPlayer />
        </Router>
      </AudioProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
