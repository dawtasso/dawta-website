import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import ProjectDetail from './pages/ProjectDetail';
import JudgeSurveyVote from './pages/JudgeSurveyVote';
import LabelAnswers from './pages/LabelAnswers';
import DemographicAlignment from './pages/DemographicAlignment';
import EpCases from './pages/EpCases';
import EpCaseDetail from './pages/EpCaseDetail';
import { SecretModeProvider } from './contexts/SecretModeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SecretModeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:projectId" element={<ProjectDetail />} />
              <Route path="projects/ue-pair-correlation/judge" element={<JudgeSurveyVote />} />
              <Route path="projects/ue-pair-correlation/label-answers" element={<LabelAnswers />} />
              <Route path="projects/ue-pair-correlation/demographic-alignment" element={<DemographicAlignment />} />
              <Route path="projects/europressing/cases" element={<EpCases />} />
              <Route path="projects/europressing/cases/:affairId" element={<EpCaseDetail />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SecretModeProvider>
    </QueryClientProvider>
  );
}

export default App;
