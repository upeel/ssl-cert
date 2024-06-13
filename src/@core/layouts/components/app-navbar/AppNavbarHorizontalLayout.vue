<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <!-- <ul class="nav navbar-nav d-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul> -->

    <ul
      id="navbar-menu-navigation"
      class="nav navbar-nav"
    >
      <component
        :is="resolveNavComponent(item)"
        v-for="item in navMenuItems"
        :key="item.header || item.title"
        :item="item"
      />
    </ul>

    <!-- Left Col -->
    <!-- <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <bookmarks />
    </div> -->

    <!-- Right Col -->
    <b-navbar-nav class="nav align-items-center ml-auto">
      <dark-Toggler class="d-none d-lg-block" />
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav,
} from 'bootstrap-vue'
import Bookmarks from './components/Bookmarks.vue'
import NavMenuHorizontal from '@/@core/layouts/layout-horizontal/components/horizontal-nav-menu/HorizontalNavMenu.vue'
import Locale from './components/Locale.vue'
import DarkToggler from './components/DarkToggler.vue'
import SearchBar from './components/SearchBar.vue'
import CartDropdown from './components/CartDropdown.vue'
import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'

import HorizontalNavMenuHeaderLink from '@/@core/layouts/layout-horizontal/components/horizontal-nav-menu/components/horizontal-nav-menu-header-link/HorizontalNavMenuHeaderLink.vue'
import HorizontalNavMenuHeaderGroup from '@/@core/layouts/layout-horizontal/components/horizontal-nav-menu/components/horizontal-nav-menu-header-group/HorizontalNavMenuHeaderGroup.vue'
import navMenuItems from '@/navigation/horizontal'

export default {
  components: {
    BLink,

    // Navbar Components
    BNavbarNav,
    Bookmarks,
    Locale,
    DarkToggler,
    SearchBar,
    CartDropdown,
    NotificationDropdown,
    UserDropdown,
    NavMenuHorizontal,

    HorizontalNavMenuHeaderLink,
    HorizontalNavMenuHeaderGroup,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  setup() {
    const resolveNavComponent = item => {
      if (item.children) return 'horizontal-nav-menu-header-group'
      return 'horizontal-nav-menu-header-link'
    }

    return {
      navMenuItems,
      resolveNavComponent,
    }
  },
}
</script>
