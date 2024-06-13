export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/pages/authentication/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/pages/miscellaneous/coming-soon',
    name: 'misc-coming-soon',
    component: () => import('@/views/pages/miscellaneous/ComingSoon.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/not-authorized',
    name: 'misc-not-authorized',
    component: () => import('@/views/pages/miscellaneous/NotAuthorized.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/pages/miscellaneous/under-maintenance',
    name: 'misc-under-maintenance',
    component: () => import('@/views/pages/miscellaneous/UnderMaintenance.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/error',
    name: 'misc-error',
    component: () => import('@/views/pages/miscellaneous/Error.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/account-setting',
    name: 'pages-account-setting',
    component: () => import('@/views/pages/account-setting/AccountSetting.vue'),
    meta: {
      pageTitle: 'Account Settings',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Account Settings',
          active: true,
        },
      ],
    },
  },
  {
    path: '/pages/profile',
    name: 'pages-profile',
    component: () => import('@/views/pages/profile/Profile.vue'),
    meta: {
      pageTitle: 'Profile',
      breadcrumb: [
        {
          text: 'Pages',
        },
        {
          text: 'Profile',
          active: true,
        },
      ],
    },
  },
]
