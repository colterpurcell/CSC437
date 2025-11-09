import { connect } from "./services/mongo";
import { ParkModel } from "./models/park-model";
import { PathModel } from "./models/path-model";
import { POIModel } from "./models/poi-model";
import { CampsiteModel } from "./models/campsite-model";

async function seed() {
  connect("natty");

  // Give mongoose a moment to connect
  await new Promise((r) => setTimeout(r, 500));

  await Promise.all([
    ParkModel.deleteMany({}),
    PathModel.deleteMany({}),
    POIModel.deleteMany({}),
    CampsiteModel.deleteMany({}),
  ]);

  const parks = [
    {
      parkid: "yose",
      name: "Yosemite National Park",
      description: "Granite cliffs, waterfalls, and giant sequoias.",
      location: "California",
      established: "1890",
      size: "748,436 acres",
      card: {
        title: "Yosemite",
        description: "Explore Yosemite",
        href: "/parks/yose/index.html",
        image:
          "https://i.natgeofe.com/n/f14f6c30-8d11-4e33-a5e9-05f1b50bdde3/yosemite-national-park-california_16x9.jpg?w=1200",
        imageAlt: "Yosemite Valley with granite cliffs and waterfalls",
      },
    },
    {
      parkid: "yell",
      name: "Yellowstone National Park",
      description: "Geysers, hot springs, and abundant wildlife.",
      location: "Wyoming, Montana, Idaho",
      established: "1872",
      size: "2,219,791 acres",
      card: {
        title: "Yellowstone",
        description: "Discover Yellowstone",
        href: "/parks/yell/index.html",
        image:
          "https://visitjacksonhole.com/wp-content/uploads/2023/04/Grand-Prismatic-Bison-Herd-2400x1596.jpg",
        imageAlt: "Yellowstone geysers and hot springs",
      },
    },
  ];

  const parkDocs = await ParkModel.insertMany(parks);

  const paths = [
    {
      pathid: "valley-loop",
      park: "yose",
      parkName: "Yosemite National Park",
      name: "Valley Loop Road",
      type: "road" as const,
      description: "Scenic loop around Yosemite Valley.",
      image:
        "https://d3owbckoeihl9o.cloudfront.net/images/10adv/wp-content/uploads/2022/03/US-CA-Yosemite-NP-Valley-Loop-Trail-2560x1444-1-1200x630.jpg",
      imageAlt:
        "Scenic valley loop road winding through Yosemite Valley with mountains in background",
      card: {
        title: "Valley Loop Road",
        description: "Drive the valley",
        href: "/parks/yose/index.html#paths",
        image:
          "https://d3owbckoeihl9o.cloudfront.net/images/10adv/wp-content/uploads/2022/03/US-CA-Yosemite-NP-Valley-Loop-Trail-2560x1444-1-1200x630.jpg",
        imageAlt: "Valley Loop Road scenic view",
      },
    },
    {
      pathid: "glacier-point-road",
      park: "yose",
      parkName: "Yosemite National Park",
      name: "Glacier Point Road",
      type: "road" as const,
      description:
        "Scenic mountain road to Glacier Point with stunning valley views.",
      image:
        "https://www.yosemite.com/wp-content/uploads/2023/04/glacier-point-1920x810-AdobeStock_119759036.webp",
      imageAlt:
        "Winding mountain road to Glacier Point with snow-capped peaks and dramatic cliffs",
      card: {
        title: "Glacier Point Road",
        description: "High country views",
        href: "/parks/yose/index.html#paths",
        image:
          "https://www.yosemite.com/wp-content/uploads/2023/04/glacier-point-1920x810-AdobeStock_119759036.webp",
        imageAlt: "Glacier Point Road mountain views",
      },
    },
    {
      pathid: "mist-trail",
      park: "yose",
      parkName: "Yosemite National Park",
      name: "Mist Trail",
      type: "trail" as const,
      description: "Iconic trail to Vernal Fall with stunning waterfalls and granite cliffs.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
      imageAlt:
        "Mist Trail leading to Vernal Fall with rainbow and waterfall mist",
      card: {
        title: "Mist Trail",
        description: "Waterfall hike",
        href: "/parks/yose/index.html#paths",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
        imageAlt: "Mist Trail waterfall views",
      },
    },
    {
      pathid: "grand-loop",
      park: "yell",
      parkName: "Yellowstone National Park",
      name: "Grand Loop Road",
      type: "road" as const,
      description: "Main scenic road through Yellowstone.",
      image:
        "https://images.squarespace-cdn.com/content/v1/627527b3cbb8af69cc61a944/1727801839580-P4P5L1SQ24R0EP61FW06/YELL-Grand-Loop-Road-Overview-Itinerary.jpg",
      imageAlt:
        "Grand Loop Road through Yellowstone with geysers, wildlife, and rolling hills",
      card: {
        title: "Grand Loop Road",
        description: "Tour Yellowstone",
        href: "/parks/yell/index.html#paths",
        image:
          "https://images.squarespace-cdn.com/content/v1/627527b3cbb8af69cc61a944/1727801839580-P4P5L1SQ24R0EP61FW06/YELL-Grand-Loop-Road-Overview-Itinerary.jpg",
        imageAlt: "Grand Loop Road Yellowstone scenery",
      },
    },
  ];

  const poi = [
    {
      poiid: "half-dome-trailhead",
      park: "yose",
      parkName: "Yosemite National Park",
      name: "Half Dome Trailhead",
      type: "trailhead",
      description: "Start of the Half Dome hike.",
      card: {
        title: "Half Dome TH",
        description: "Epic hike",
        href: "/parks/yose/index.html#poi",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Half_Dome_late_October_2024.jpg/1200px-Half_Dome_late_October_2024.jpg",
        imageAlt: "Half Dome trailhead in Yosemite",
      },
    },
    {
      poiid: "old-faithful",
      park: "yell",
      parkName: "Yellowstone National Park",
      name: "Old Faithful",
      type: "geyser",
      description: "Iconic geyser known for regular eruptions.",
      card: {
        title: "Old Faithful",
        description: "Famous geyser",
        href: "/parks/yell/index.html#poi",
        image:
          "https://travel.usnews.com/images/Danny_Lehmangeyser-old-faithful.jpg",
        imageAlt: "Old Faithful geyser erupting in Yellowstone",
      },
    },
  ];

  const campsites = [
    {
      siteid: "upper-pines-015",
      park: "yose",
      parkName: "Yosemite National Park",
      name: "Upper Pines Site 015",
      capacity: "6",
      location: "Yosemite Valley",
      description: "Shady site near Merced River.",
      connectedPaths: [
        {
          pathId: "valley-loop",
          pathName: "Valley Loop Road",
          pathType: "road",
        },
      ],
      nearbyPoi: [
        {
          poiId: "half-dome-trailhead",
          poiName: "Half Dome TH",
          poiType: "trailhead",
        },
      ],
      card: {
        title: "Upper Pines 015",
        description: "Reserve now",
        href: "/campsites/upper-pines-015.html",
        image:
          "https://www.nps.gov/common/uploads/structured_data/94E5AE0B-CB23-CB0C-8312DA1A84061A65.jpg",
        imageAlt: "Yosemite campsite with tents",
      },
    },
    {
      siteid: "lower-pines-001",
      park: "yose",
      parkName: "Yosemite National Park",
      name: "Lower Pines Site 001",
      capacity: "6",
      location: "Yosemite Valley",
      description:
        "Popular valley floor campground with easy access to trails.",
      connectedPaths: [
        {
          pathId: "valley-loop",
          pathName: "Valley Loop Road",
          pathType: "road",
        },
      ],
      nearbyPoi: [
        {
          poiId: "half-dome-trailhead",
          poiName: "Half Dome TH",
          poiType: "trailhead",
        },
      ],
      card: {
        title: "Lower Pines 001",
        description: "Valley access",
        href: "/campsites/lower-pines-001.html",
        image:
          "https://www.yosemite.com/wp-content/uploads/2023/04/Pines-campground.jpg",
        imageAlt: "Yosemite valley campsite",
      },
    },
    {
      siteid: "bridge-bay-001",
      park: "yell",
      parkName: "Yellowstone National Park",
      name: "Bridge Bay Site 001",
      capacity: "6",
      location: "Yellowstone Lake",
      description: "Close to the marina with lake views.",
      connectedPaths: [
        { pathId: "grand-loop", pathName: "Grand Loop Road", pathType: "road" },
      ],
      nearbyPoi: [
        { poiId: "old-faithful", poiName: "Old Faithful", poiType: "geyser" },
      ],
      card: {
        title: "Bridge Bay 001",
        description: "Reserve now",
        href: "/campsites/bridge-bay-001.html",
        image:
          "https://www.nps.gov/yell/planyourvisit/images/bb.jpg?maxwidth=1300&maxheight=1300&autorotate=false&format=webp",
        imageAlt: "Yellowstone lakeside campsite",
      },
    },
  ];

  await PathModel.insertMany(paths);
  await POIModel.insertMany(poi);
  await CampsiteModel.insertMany(campsites);

  console.log("Seeded parks:", parkDocs.length);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
