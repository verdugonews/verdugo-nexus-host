import { useLocation } from '@modern-js/runtime/router';
import { MfeLoader } from '../components/common/MfeLoader';

export default function UniversalBridge() {
  const location = useLocation();
  const mfeScope = location.pathname.split('/').filter(Boolean)[0];
  if (!mfeScope) return null;
  return <MfeLoader scope={mfeScope} />;
}
