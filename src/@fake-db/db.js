import mock from './mock'

/* eslint-disable import/extensions */

// JWT
import './jwt'

// pages
import './data/pages/account-setting'
import './data/pages/profile-data'
/* eslint-enable import/extensions */

mock.onAny().passThrough() // forwards the matched request over network
