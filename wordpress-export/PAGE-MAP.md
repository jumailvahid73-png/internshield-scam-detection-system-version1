# Orient Tech -- WordPress / Elementor Setup

## 1. Install WordPress + Elementor
1. Set up hosting and install WordPress at your **site root** (not a subfolder) --
   the asset links below assume that.
2. In WP Admin, go to **Settings > Permalinks** and choose **"Post name"**. This is
   required for the product page URLs (`/products/cantilever-racking/`) to work.
3. Install and activate the free **Elementor** plugin (Plugins > Add New > search
   "Elementor").

## 2. Install the Orient Tech assets plugin
1. Zip the `plugin/orient-tech-assets` folder (or use the zip provided alongside
   this export).
2. In WP Admin: **Plugins > Add New > Upload Plugin**, choose the zip, install,
   then **Activate**. This plugin only loads CSS/JS/fonts/images -- it does not
   add any pages itself.

## 3. Create the pages
For each row below: **Pages > Add New**, set the exact **Page Slug** (Permalink) and
**Parent** shown, set the template to **Elementor Canvas** (Elementor's blank
full-width template -- this avoids your theme's own header/footer doubling up
with the one built into these fragments), then edit with Elementor and drag in
a single **HTML widget**. Paste the entire contents of the matching file from
`pages/` into that widget and update.

| Page | Fragment file | Slug / Parent | Resulting URL |
|---|---|---|---|
| Home | `pages/home.html` | Slug: `home` -- then set **Settings > Reading > Your homepage displays > A static page** to this page | `/` |
| About Us | `pages/about.html` | Slug: `about` | `/about/` |
| Products (listing) | `pages/products.html` | Slug: `products` | `/products/` |
| Contact | `pages/contact.html` | Slug: `contact` | `/contact/` |
| Adjustable Warehouse Storage Pallet Racks | `products/adjustable-warehouse-storage-pallet-racks.html` | Page slug: `adjustable-warehouse-storage-pallet-racks`, Parent: **Products** | `/products/adjustable-warehouse-storage-pallet-racks/` |
| Automatic Storage and Retrieval System | `products/automatic-storage-and-retrieval-system.html` | Page slug: `automatic-storage-and-retrieval-system`, Parent: **Products** | `/products/automatic-storage-and-retrieval-system/` |
| Cantilever Racking | `products/cantilever-racking.html` | Page slug: `cantilever-racking`, Parent: **Products** | `/products/cantilever-racking/` |
| Conventional Warehouse Selective Pallet Racking | `products/conventional-warehouse-selective-pallet-racking.html` | Page slug: `conventional-warehouse-selective-pallet-racking`, Parent: **Products** | `/products/conventional-warehouse-selective-pallet-racking/` |
| Double Sided Cantilever Rack | `products/double-sided-cantilever-rack.html` | Page slug: `double-sided-cantilever-rack`, Parent: **Products** | `/products/double-sided-cantilever-rack/` |
| Drive In Racking | `products/drive-in-racking.html` | Page slug: `drive-in-racking`, Parent: **Products** | `/products/drive-in-racking/` |
| Drive In Racking System Design | `products/drive-in-racking-system-design.html` | Page slug: `drive-in-racking-system-design`, Parent: **Products** | `/products/drive-in-racking-system-design/` |
| Drive Through Racking System | `products/drive-through-racking-system.html` | Page slug: `drive-through-racking-system`, Parent: **Products** | `/products/drive-through-racking-system/` |
| Electric Mobile Shelving | `products/electric-mobile-shelving.html` | Page slug: `electric-mobile-shelving`, Parent: **Products** | `/products/electric-mobile-shelving/` |
| Filing Cabinet | `products/filing-cabinet.html` | Page slug: `filing-cabinet`, Parent: **Products** | `/products/filing-cabinet/` |
| Foldable Wire Mesh Container | `products/foldable-wire-mesh-container.html` | Page slug: `foldable-wire-mesh-container`, Parent: **Products** | `/products/foldable-wire-mesh-container/` |
| G+2 Mezzanine | `products/g-plus-2-mezzanine.html` | Page slug: `g-plus-2-mezzanine`, Parent: **Products** | `/products/g-plus-2-mezzanine/` |
| Galvanized Wire Mesh Cage | `products/galvanized-wire-mesh-cage.html` | Page slug: `galvanized-wire-mesh-cage`, Parent: **Products** | `/products/galvanized-wire-mesh-cage/` |
| Heavy Duty Drive In Rack | `products/heavy-duty-drive-in-rack.html` | Page slug: `heavy-duty-drive-in-rack`, Parent: **Products** | `/products/heavy-duty-drive-in-rack/` |
| Heavy Duty Pallet Rack System | `products/heavy-duty-pallet-rack-system.html` | Page slug: `heavy-duty-pallet-rack-system`, Parent: **Products** | `/products/heavy-duty-pallet-rack-system/` |
| Heavy Duty Pallet Racking Shelving | `products/heavy-duty-pallet-racking-shelving.html` | Page slug: `heavy-duty-pallet-racking-shelving`, Parent: **Products** | `/products/heavy-duty-pallet-racking-shelving/` |

**Important**: create the **Products** listing page first, since all 16 product
pages must have it set as their **Parent** (Page Attributes panel) for the
`/products/<slug>/` URLs to resolve correctly.

## 4. Notes
- The floating WhatsApp button, mobile nav menu, scroll animations and stat
  counters all come from `assets/js/main.js`, enqueued sitewide by the plugin --
  no extra setup needed once it's active.
- The contact form on the Contact page hands off to WhatsApp with the visitor's
  details pre-filled; it does not require a mail server or form plugin.
- If you ever change WordPress's install location to a subfolder, the image
  paths (`/wp-content/plugins/orient-tech-assets/assets/img/...`) and page
  links (`/about/`, `/products/...`) will need the subfolder prefixed -- ping
  me and I'll regenerate the export for that path.
