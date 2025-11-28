Create a new package for your SPA
We are going to refactor the current proto considerably in order to turn it into an SPA, and you may want to refer back to it occasionally to see how it worked. You may even want to continue doing some explorations there. It’s probably gotten a little cluttered by now, which is fine, because that made it easier to explore without having to make it “complete”. So let’s keep proto around.

Instead start working on your SPA in fresh package, which we’ll call app.

Do you remember the drill? Here are the steps:

Create a new directory, packages/app
Run npm init in the app directory
Install dev dependences in app: npm install -D tsc vite
Install runtime dependences in app: npm install lit @calpoly/mustang
Copy your tsconfig.json file from proto to app
Create a public directory, with subdirectories for styles and icons
don’t copy all the CSS files just yet, we will pick and choose
you can copy your SVG icon sprite(s) from proto/public/icons
Create your SPA’s index.html
We’re going to start by copying index.html (the one that’s not in public) from proto. Yours should already have <mu-auth> in the <body>, as well as a some HTML, including your app’s header (which may be a component) and maybe some other web components. Remove everything from the body except the <mu-auth> and the app header.

Now, add two new framework components from mustang: <mu-history> and <mu-switch>. Here is what the new <body> of your index.html should look like:

  <body>
    <mu-history provides="blazing:history">
      <mu-auth provides="blazing:auth" redirect="/login.html">
          <article class="page">
            <blazing-header></blazing-header>
            <mu-switch></mu-switch>
          </article>
        </mu-store>
      </mu-auth>
    </mu-history>
  </body>
All the provides= arguments are up to you, but I suggest replacing “blazing” with a short name of your app everywhere, to avoid confusion.

Notice the two new components, <mu-history> and <mu-switch>. The reason they are arranged this way is that <mu-switch> is going to load new content based on the URL. Anything that does not need to change when the URL changes (such as the page header component) should be outside of <mu-switch>. The <mu-history> element is going to listen for clicks in order to prevent reloads on link navigation. So the header needs to be inside of <mu-history>. <mu-history> also makes it easier to perform navigation by sending messages, for example when <mu-auth> needs to redirect to the login page (or view).

You can also remove all <script> elements, and instead add one which will load your app’s main.ts, like this:

<script type="module" src="/src/main.ts"></script>
Keep all the <link>s in the <head> which load your fonts. Also keep the <link>s for the CSS files tokens.css, reset.css and page.css.

Create main.ts
All of your pages will be part a single app now, which is loaded from the index.html. This is the main entry point into your app. To start, you at least need to define any custom elements in the index.html, using define. We’ll also need html from lit. And if you have a custom element for your app header, you can define it here, too.

import {
  Auth,
  define,
  History,
  Switch
} from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { HeaderElement } from "./components/blazing-header";

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "blazing-header": HeaderElement
});
Configure the router, <mu-switch>
Unlike the other components we are using from mustang, <mu-switch> requires some customization. This customization can be done by extending the Switch.Element class, passing additional arguments through the super constructor.

To configure the Switch.Element, you need to provide the routes when calling super(). The second argument to super() is the name passed as the provides attribute on <mu-history> in the index.html. The third argument should be the provides attribute on <mu-auth>.

So, in your define({ }), add a definition for mu-switch that looks like this:

"mu-switch": class AppSwitch extends Switch.Element {
  constructor() {
    super(routes, "blazing:history", "blazing:auth");
  }
},
<mu-switch> needs access to the auth provider because it implements protected routes, which cannot be rendered unless the user is authenticated. Even though we’re not going to have protected routes, we still need to provide this additional argument to <mu-switch>.

Lets define routes now. This needs to go before the define() statement, where it’s referenced. You should list at least two routes that will bring up different views, and then also a default route for the home view. All of these routes should start with /app/.

The reason for this is we will again be serving our app from the same Express server as our API. Putting all the “pages” under the same prefix makes sure we don’t have any name collisions. Also, we will want to serve the same HTML for any request that starts with /app/ since we are making a single-page app.

You should also have a redirect from / to /app. The home page will be served at /app, and we want everyone who goes to the root of the server to get the landing page.

Here is an example list of routes. You should modify this to work with the routes you want for your app:

const routes = [
  {
    path: "/app/tour/:id",
    view: (params: Switch.Params) => html`
      <tour-view tour-id=${params.id}></tour-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <landing-view></landing-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];
Don’t worry if you don’t have these views defined yet in proto. You can make up names for now and we will get to defining those components later.

Each route has a path property, which is similar to the paths that we define in Express. Every time the browser’s location changes, <mu-switch> will try each route’s path (in the order you list them in routes) until it finds a match. When it finds a match, it will either render a new view or redirect to another route.

If redirect is given, that path will replace the path in the browser’s URL, and then <mu-switch> will go through the list of routes again to match it.

If view is given, the function is executed and the result is rendered in the Shadow DOM of the <mu-switch>. You will recognize the html expressions from Lit, and in fact, Lit is used to render these expressions. Notice how segments of the URL path can be used to pass path parameters into the html expression, where they can be used in any of the ways Lit allows you to pass data to a component.

Even though this expression is evaluated using Lit, the components you give do not need to be LitElements. Lit is able to render any HTML custom element, so you could re-use existing components you created in proto before we started Lit.

Convert existing page(s) to components
Look at index.html again. See where the <mu-switch> is? You deleted a bunch of HTML that used to be where the <mu-switch> is now. Go back to proto and look at what that was. Is it a single component? If, so you are lucky. Otherwise, you will now use Lit to create a component which renders the contents of the page.

If your home page is very complex, this may seem daunting. It’s ok to implement something much simpler as your home page for now. Eventually, all your pages will be Lit components, but it’s ok to wait until you have a little more experience with Lit before tackling the really beastly ones.

We’ll start by creating a new file (I called mine home-view.ts) in the directory app/src/views. I recommend you keep views (entire screens) separate from components (like your page header) which tend to be re-used. At this point, my app/src directory looks like this (we’ll talk about main.ts shortly):

src
├── components
│    └── blazing-header.ts
├── main.ts
├── styles
│    ├── headings.css.ts
│    ├── icon.css.ts
│    └── reset.css.ts
└── views
      └── home-view.ts
Start writing home-view.ts by create a class which for the component:

import { css, html, LitElement } from "lit";

export class HomeViewElement extends LitElement {
  render() {
    return html`
    `;
  }

  // more to come
}
In general, to convert a static HTML page to a Lit component, you can start by copying the HTML into the render() method. This should load, but probably won’t look great. That’s because these elements are now in the light DOM, so they are not getting the styles they need. Look in your CSS files to see which rules you need to get this looking correct.

Creating pages that load data
As described above, <home-view> is essentially static HTML. There is no state and no attributes. In general, your pages will need to get data and have attributes, which will be set in the route. The procedure for creating a page is similar to what we did in Labs 8 and 9, where we built a template and then populated that template with data from a REST API.

For example, I have a <profile-view> element which takes a src attribute to indicate where to read the JSON from. Let’s change that element now so that it takes a user-id attribute instead, and uses that to compute the API URL:

export class TravelerViewElement extends LitElement {
  static uses = define({
    "mu-form": Form.Element
  });

  @property(attribute: "user-id")
  userid?: string;

  @property()
  mode = "view";

  @state()
  traveler?: Traveler;

  get src() {
    return `/api/travelers/${this.userid}`;
  }
That is pretty much all that has to change. Anywhere that we use this.src, we will get the correct value, based on the user-id attribute.

Go ahead and convert the pages you created in Labs 8 and 9 to views, and add them to the routes.

Connecting Vite in Development mode to the API server
When we started using Lit and Typescript, we started using Vite in development mode, which was really great because of Hot Module Reload (HMR).

To use Vite’s development server, we must access our app at localhost:5173, but the API is still being served by Express at localhost:3000. And since we specify our API routes as server-absolute (meaning they start with a /), and when we pass those URLs to fetch, the request goes to the same server from which the HTML was loaded.

We solved that problem before by using Vite in production mode. Then we could serve proto as static files, using the same Express server.

So it seems we can’t have it all: either we get Vite’s HMR and can’t use our APIs, or we have to build our frontend each time we make a change, and test the built code. Now that we’re going to be spending most of our time in app, it would be really great if we could get our API served on the same port as Vite.

We can make requests to the Express server alongside Vite’s development server if we tell Vite to proxy the API requests to the other server. To our app, it will look like the API is available on port 5173, the same port on which Vite is serving our index.html.

To set up this proxy, create a vite.config.js file in your packages/app and enter this:

// app/vite.config.js
export default {
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/images": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/register": "http://localhost:3000"
    }
  }
};
Now run npm run dev. If your page makes any api requests, they are now being sent to your Express server. Make sure you also have your server running. You will need to do this in a separate terminal from the one where Vite is running. You don’t want it to serve pages from proto any more, so you can use the basic start script:

cd packages/server
npm run start
What about the Login page?
You may be tempted to convert your login page to a component, and add it to the routes. That is fine, and you are welcome to do that.

However, it’s also common to have the login and new user pages not be part of the app. The reason is that simplicity is better for security, and also for reliability. You don’t want somebody to be able to hack their way into your app through your login page. You also don’t want your login page to be unavailable if there’s an error keeping the app from loading or showing the login page.

So you can also copy your login.html from proto and have it work the same way that it did before.

Test your SPA
At this point, you should be able to run your SPA and test the same view which you worked on in Labs 8 and 9. If that view component took an attribute, you should be able to specify the value of that attribute in the URL, rather than hard-coding it like we did previously. Try to get those views working correctly before continuing.

For now, use the Vite development server (npm run dev). You should’ve had it set up to proxy API requests to your Express server. Note that you still need to have the Express server running in another terminal when using the Vite dev server.

To really see if the router is working, you need to have more than one view component. If you have not done so already, convert another one of your pages from proto into a view.

Alternatively, if you have a view which does not require any data (such as an “about” page or a splash page), that will be easier to work with for now. For that kind of view, you may not even need to use Lit.

Once you have two views working, try adding a link from one view to the other, using <a href="/app/some_other_view">. Now test the link to make sure you can navigate from one view to the other. Also try using the “Back” button on your browser to return to the first view.

If you navigate back and forth with the Console or Network tab open, you should see that there is no page reload happening. This is important to check, as it is the key to the preferred user experience of a single-page app. If the Console or Network tab is cleared and then re-written when you click on a link, that means it’s reloading the page. If this happens, see if you can figure out why. (It’s most likely because the <mu-history> is not getting initialized as a custom element.)

Do not proceed unless you are certain that the page is not reloading. Ask me or our TA to look at it in lab if you are not sure.

Serving your SPA from server
The Vite development server assumes that your index.html is a single-page app. When you request a page that starts with /app, it’s still going to serve the same index.html file, because there isn’t an app/index.html file available.

By default, an HTTP server serving static files will not do this. You can try it out by requesting http://localhost:3000/app. It will respond with 404 (Not Found) status. So our new app and client-side router can only be loaded from http://localhost:3000/. Now, that first redirect to /app should not cause a page reload, so you may be able to navigate around just fine, but if you ever tried to use the browser’s refresh button, you would get a 404. This is not acceptable.

The same would happen if you saved a bookmark and tried to navigate to it later, or even in another tab or window. The ability to load any view within an app is known as deep linking.

Fortunately, there is any easy way to solve this problem in Express. What we need is an Express route that will match any URL that starts with /app always return our index.html. We can use the STATIC variable which we pass in to our server to find the index.html. Once we find it, we can (asynchronously) read it using the NodeJS fs/promises package, and then send the HTML as a response.

You’ll need to import both path and fs, so add these to your server/src/index.ts:

// packages/server/src/index.ts
import fs from "node:fs/promises";
import path from "path";
You may already have path imported from an earlier assignment.

Now, add an app.use statement. I usually put it just before the app.listen. Order is not terribly important here, as long as it’s before the listen.

// SPA Routes: /app/...
app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});
With app.use, we don’t need any wildcards in the path to make it match longer URLs, as we would if we used app.get.

If you haven’t already done so, you’ll want to have an easy way to switch between running Express serving proto vs app. You should be getting the value of staticDir from an environment variable, which is set from an NPM script. It’s useful to be able to start the server specifying either proto, app, or nothing for the frontend. (When using the Vite dev server, you don’t need Express to serve a frontend at all.) Here is a set of NPM script to do that:

/* in server/package.json */
  "scripts": {
    "dev": "nodemon",
    "build": "npx etsc",
    "start": "npm run build && npm run start:node",
    "start:api": "cross-env STATIC=./public npm run start",
    "start:app": "cross-env STATIC=../app/dist npm run start",
    "start:node": "node dist/index.js",
    "start:proto": "cross-env STATIC=../proto/dist npm run start",
    "check": "tsc --noEmit"
  },
I usually use npm run dev only when also running app with npm run dev, so I don’t worry whether nodemon is setting STATIC correctly.

Time to try it out!

npm run start:app
And then go to http://localhost:3000 in your browser. You will probably need to log in again because the JWT tokens time out in 24 hours, and they are not shared between the two ports, even on the same machine. (The technical way of saying this is that each origin has its own private localStorage.)