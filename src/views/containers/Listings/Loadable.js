import Loadable from 'react-loadable'
import Loading from 'views/components/Loading'

export default Loadable({
  loader: () => import('./index'),
  loading: Loading,
})
