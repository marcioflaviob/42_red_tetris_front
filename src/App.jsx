import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import Layout from './Layout';
import { PATHS } from './Paths';

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Layout />}>
          {PATHS.map((item) => (
            <Route key={item.path} path={item.path} element={item.component} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
