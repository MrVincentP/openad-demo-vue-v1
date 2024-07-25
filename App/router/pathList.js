
import { AppEnv } from '@utils/AppEnv';

const pathList = [{
  path: '/',
  name: 'LayOut',
  meta: { title: AppEnv.title, keepAlive: false },
  component: () => import(/* webpackChunkName: "LayOut" */'@/pages/Layout.vue'),
  // eslint-disable-next-line array-bracket-newline
  children: [
    {
      path: '/home/index',
      name: 'HomeIndex',
      meta: { title: 'home', keepAlive: false },
      component: () => import(/* webpackChunkName: "HomeIndex" */'@/pages/home/index.vue'),
    },
    {
      path: '/SinglePage/direct',
      name: 'SinglePageDirect',
      meta: { title: '', keepAlive: false },
      component: () => import(/* webpackChunkName: "HomeIndex" */'@/pages/SinglePage/direct.vue'),
    },
    {
      path: '/SinglePage/async',
      name: 'SinglePageAsync',
      meta: { title: '', keepAlive: false },
      component: () => import(/* webpackChunkName: "HomeIndex" */'@/pages/SinglePage/async.vue'),
    }],
}];
export default pathList;
