export default [
  {
    path: '/brands',
    name: 'brand-list',
    component: () => import('@/views/ssl-certificate/brand/BrandList.vue'),
  },
  {
    path: '/brands/add/',
    name: 'brand-add',
    component: () => import('@/views/ssl-certificate/brand/BrandAdd.vue'),
  },
  {
    path: '/brands/edit/:id',
    name: 'brand-edit',
    component: () => import('@/views/ssl-certificate/brand/BrandEdit.vue'),
  }
]