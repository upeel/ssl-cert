export default [
  {
    path: '/domains',
    name: 'domain-list',
    component: () => import('@/views/ssl-certificate/domain/DomainList.vue'),
  },
  {
    path: '/domains/add/',
    name: 'domain-add',
    component: () => import('@/views/ssl-certificate/domain/DomainAdd.vue'),
  },
  {
    path: '/domains/edit/:id',
    name: 'domain-edit',
    component: () => import('@/views/ssl-certificate/domain/DomainEdit.vue'),
  }
]