export default [
  {
    path: '/ssl',
    name: 'sslc-list',
    component: () => import('@/views/ssl-certificate/ssl-certificate/SslList.vue'),
  },
  {
    path: '/ssl/:id',
    name: 'ssl-view',
    component: () => import('@/views/ssl-certificate/ssl-certificate/SslView.vue'),
  }
]