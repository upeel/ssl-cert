/*

NOTE: tag is not supported in horizontal menu

Array of object

Top level object can be:
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- nav Grp (top level grp is called header group) ---/

title
icon (if it's on top/second level)
children

/--- nav Item (top level item is called header link) ---/

icon (if it's on top/second level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)

*/
import brand from './brand'
import dns from './dns'
import domain from './domain'
import ssl from './ssl'
import queue from './queue'

// Array of sections
export default [...brand, ...dns, ...domain, ...queue, ...ssl]
