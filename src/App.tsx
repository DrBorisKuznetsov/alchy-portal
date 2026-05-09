import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import SeriesPage from './pages/SeriesPage';
import About from './pages/About';
import Sponsors from './pages/Sponsors';
import Tools from './pages/Tools';
import News from './pages/News';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
