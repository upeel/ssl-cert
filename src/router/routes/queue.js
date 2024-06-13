export default [
  {
    path: '/ssl-queue',
    name: 'ssl-queue',
    component: () => import('@/views/ssl-certificate/ssl-queue/SslQueue.vue'),
  },
  {
    path: '/ssl-queue/:id',
    name: 'ssl-queue-view',
    component: () => import('@/views/ssl-certificate/ssl-queue/SslQueueView.vue'),
  }
]