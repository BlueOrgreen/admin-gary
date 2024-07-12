import { createRoot } from 'react-dom/client'

// 引入 icons svg 雪碧图
import App from './app'
import './styles/index.less'

createRoot(document.getElementById('root')!).render(<App />)
