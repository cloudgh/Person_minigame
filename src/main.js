import { createApp } from 'vue'
import App from '@/App'
import router from '@/router/index'
// import components from '@/components'
import store from '@/store/index';

const app = createApp(App)

// components.forEach(component => {
//     app.component(component.name, component)
// })



app
    .use(router)
    .use(store) 
    .mount('#app')
    

