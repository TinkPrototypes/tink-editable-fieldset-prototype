# Tink navigation Angular directive

v1.0.4

## What is this repository for?

The Tink navigation Angular directive gives you a scaffold for top and side navigation.

Tink is an in-house developed easy-to-use front-end framework for quick prototyping and simple deployment of all kinds of websites and apps, keeping a uniform and consistent look and feel.

## Setup

### Prerequisites

* nodeJS [http://nodejs.org/download/](http://nodejs.org/download/)
* bower: `npm install -g bower`

### Install

1. Go to the root of your project and type the following command in your terminal:

   `bower install tink-navigation-angular --save`

2. Add the following files to your project:

   `<link rel="stylesheet" href="bower_components/tink-core/dist/tink.css" />` (or one of the Tink themes)

   `<script src="bower_components/tink-navigation-angular/dist/tink-navigation-angular.js"></script>`

   `<script src="bower_components/lodash/lodash.js"></script>`

   `<script src="bower_components/tink-api-javascript/dist/tink-api-javascript.js"></script>`

   `<script src="bower_components/tink-api-angular/dist/tink-api-angular.js"></script>`

3. Add `tink.navigation` and `tink.tinkApi` to your app module's dependency.

   `angular.module('myApp', ['tink.navigation', 'tink.tinkApi']);`



----------



## How to use

### data-tink-top-nav

The `.nav-top` class makes sure the top navigation uses the Tink styling.

Logo and company name are automatically handled in `.nav-top-branding`.

All the other elements go in `.nav-top-section`, which is handily divided into three sections:

* `.nav-top-section-left`
* `.nav-top-section-center`
* `.nav-top-section-right`

```html
<nav data-tink-top-nav="" class="nav-top">
  <ul class="nav-top-branding">
    <li class="logo">
      <a href="#" title=""><span>Your Project</span></a>
    </li>
    <li class="toggle" data-tink-sidenav-collapse="asideNavLeft">
      <a href="#" title="Open menu"><i class="fa fa-bars"><span class="sr-only">Open menu</span></i></a>
    </li>
    <li class="app">
      <h1><a href="#">My App</a></h1>
    </li>
  </ul>
  <section class="nav-top-section">
    <ul class="nav-top-section-left">
      <li>
        <a href="#">Menu L1</a>
      </li>
      <li>
        <a href="#">Menu L2</a>
      </li>
    </ul>
    <div class="nav-top-section-center">
      <input type="search" class="input-search" placeholder="Zoeken">
    </div>
    <ul class="nav-top-section-right">
      <li class="active">
        <a href="#">Menu R1</a>
      </li>
      <li>
        <a href="#">Menu R2</a>
      </li>
    </ul>
  </section>
</nav>
```

### Options

Attr | Type | Default | Details
--- | --- | --- | ---
data-tink-sidenav-collapse | `string` | `''` | Toggle the side navigation with the corresponding id. In order to make the toggle to work, the `data-toggle-id` attribute needs to be defined on the side navigation (see below).
Use this attribute on the `.toggle item.

### data-tink-nav-aside

The `.nav-aside` class makes sure the side navigation uses the Tink styling.

Use multiple instances of `.nav-aside-section`, to divide the menu into multiple sections.

You can optionally use `.nav-aside-title` to give each section a title.

Use `<ul>` to bring hierarchy to your menu.

We don't encourage the use of icons in your side navigation, but if your app needs them, make sure you add the `fa-fw` class in order to align them correctly.

Add `data-tink-nav-aside` to the `.nav-aside element in order to activate extra behaviour among which:

* Detecting and collapsing submenus
* Highlighting the active (sub)menu item

###### Left or right navigation ######

The extra class `.nav-left` or `.nav-right` in the wrapping div will determine where your menu is positioned.

> **Important!** Add class="has-nav-left" or class="has-nav-right" to your `<html> in order to create the extra (needed) space and behaviour for your side navigation.

```html
<div data-tink-nav-aside="" data-auto-select="true" data-toggle-id="asideNavLeft" class="nav-aside nav-left">
  <aside>
    <div class="nav-aside-section">
      <p class="nav-aside-title">Section title</p>
      <ul>
        <li>
          <a href="#">
            <span>Menu item</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span>Menu item with badge</span>
            <span class="badge">2</span>
          </a>
        </li>
        <li>
          <a href="#">
            <span>Menu item with submenu items</span>
          </a>
          <ul>
            <li>
              <a href="#">
                <span>Submenu item</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span>Submenu item with badge</span>
                <span class="badge">8</span>
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-fw fa-cogs"></i>
            <span>Menu item with icon</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</div>
```

### Options

Attr | Type | Default | Details
--- | --- | --- | ---
data-auto-select | `boolean` | `true` | When `true, the first submenu item is automatically selected when its corresponding (main) menu item is clicked.
data-toggle-id | `string` | `''` | This id is used to trigger the menu by the `data-toggle-side-nav directive (see above).

###### API code: ######

```javascript
var element = $("sidenav");
var sideNav = window.tinkApi.sideNavigation(element);
// to start the side navigation
sideNav.init({
  accordion: false,
  gotoPage: false
});

// to open or close the menu
sideNav.toggleMenu();
```

### Example

A working example can be found in [the Tink documentation](http://tink.digipolis.be/#/docs/directives/navigation#example).

## Contribution guidelines

* If you're not sure, drop us a note
* Fork this repo
* Do your thing
* Create a pull request

## Who do I talk to?

* Jasper Van Proeyen - jasper.vanproeyen@digipolis.be - Lead front-end
* Tom Wuyts - tom.wuyts@digipolis.be - Lead UX
* [The hand](https://www.youtube.com/watch?v=_O-QqC9yM28)
