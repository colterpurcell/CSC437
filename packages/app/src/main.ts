import { Auth, define, History, Switch, Form, Store } from "@calpoly/mustang";
import update from "./update";
import { html } from "lit";
import { NavElement } from "./components/nav.ts";
import { CardElement, CardGrid } from "./components/card.ts";
import { SectionHeader } from "./components/section-header.ts";
import ParksListingElement from "./components/parks-listing.ts";
import PathsListingElement from "./components/paths-listing.ts";
import PoiListingElement from "./components/poi-listing.ts";
import "./views/home-view.ts";
import "./views/parks-view.ts";
import "./views/paths-view.ts";
import "./views/trips-view.ts";
import "./views/poi-view.ts";
import "./views/itinerary-view.ts";
import "./views/itinerary-create-view.ts";
import "./pages/park-page.ts";
import "./pages/campsite-page.ts";
import "./pages/path-page.ts";
import "./pages/poi-page.ts";
import "./views/trip-view.ts";
import "./views/login-view.ts";
import "./views/register-view.ts";
import { Msg } from "./messages.ts";
import { init, Model } from "./model.ts";
// campers view removed (placeholder content) - routes/imports cleaned up

const routes = [
  {
    path: "/app/parks",
    view: () => html`<parks-view></parks-view>`,
  },
  {
    path: "/app/parks/:parkid",
    view: (params: Switch.Params) =>
      html`<park-page park-id=${params.parkid}></park-page>`,
  },
  {
    path: "/app/paths",
    view: () => html`<paths-view></paths-view>`,
  },
  {
    path: "/app/paths/:pathid",
    view: (params: Switch.Params) =>
      html`<path-page path-id=${params.pathid}></path-page>`,
  },
  {
    path: "/app/trips",
    view: () => html`<trips-view></trips-view>`,
  },
  {
    path: "/app/trips/itinerary",
    view: () => html`<itinerary-view></itinerary-view>`,
  },
  {
    path: "/app/trips/new",
    view: () => html`<itinerary-create-view></itinerary-create-view>`,
  },
  {
    path: "/app/trips/:slug",
    view: (params: Switch.Params) =>
      html`<trip-view slug=${params.slug}></trip-view>`,
  },
  {
    path: "/app/poi",
    view: () => html`<poi-view></poi-view>`,
  },
  {
    path: "/app/parks/:parkid/poi/:poiid",
    view: (params: Switch.Params) =>
      html`<poi-page poi-id=${params.poiid}></poi-page>`,
  },
  {
    path: "/app/login",
    view: () => html`<login-view></login-view>`,
  },
  {
    path: "/app/register",
    view: () => html`<register-view></register-view>`,
  },
  {
    path: "/app/poi/:poiid",
    view: (params: Switch.Params) =>
      html`<poi-page poi-id=${params.poiid}></poi-page>`,
  },
  {
    path: "/app/campsites/:siteid",
    view: (params: Switch.Params) =>
      html`<campsite-page site-id=${params.siteid}></campsite-page>`,
  },
  {
    path: "/app",
    view: () => html`<home-view></home-view>`,
  },
  {
    path: "/",
    redirect: "/app",
  },
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "natty:history", "natty:auth");
    }
  },
  "nav-element": NavElement,
  "card-element": CardElement,
  "card-grid": CardGrid,
  "section-header": SectionHeader,
  "parks-listing": ParksListingElement,
  "paths-listing": PathsListingElement,
  "poi-listing": PoiListingElement,
  "mu-form": Form.Element,
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "natty:auth");
    }
  },
});
