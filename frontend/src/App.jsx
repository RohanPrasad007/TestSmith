import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import SignIn from './components/SignIn';
import Home from './components/Home';
import { useAuth } from './context/AuthContext';
import StartMockTest from './components/StartMockTest';
import ExamHall from './components/ExamHall';
import Result from './components/Result';
import Rank from './components/Rank';
import ReviewQuestionPaper from './components/ReviewQuestionPaper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} /> */}
          {/* <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} /> */}
          <Route path="/start-mock-test" element={
            <ProtectedRoute>
              <ExamProvider>
                <StartMockTest />
              </ExamProvider>
            </ProtectedRoute>
          } />
          <Route path="/exam-hall" element={
            <ProtectedRoute>
              <ExamProvider>
                <ExamHall />
              </ExamProvider>
            </ProtectedRoute>
          } />
          <Route path="/result" element={
            <ProtectedRoute>
              <ExamProvider>
                <Result />
              </ExamProvider>
            </ProtectedRoute>
          } />
          <Route path="/rank" element={
            <ProtectedRoute>
              <ExamProvider>
                <Rank />
              </ExamProvider>
            </ProtectedRoute>
          } />
          <Route path="/review" element={
            <ProtectedRoute>
              <ExamProvider>
                <ReviewQuestionPaper />
              </ExamProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" replace />;
};

export default App;