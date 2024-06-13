export default [
    {
      path: '/dns',
      name: 'dns-list',
      component: () => import('@/views/ssl-certificate/dns/DnsList.vue'),
    },
    {
      path: '/dns/add/',
      name: 'dns-add',
      component: () => import('@/views/ssl-certificate/dns/DnsAdd.vue'),
    },
    {
      path: '/dns/edit/:id',
      name: 'dns-edit',
      component: () => import('@/views/ssl-certificate/dns/DnsEdit.vue'),
    }
  ]