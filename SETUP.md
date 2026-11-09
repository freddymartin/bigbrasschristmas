# 🎺 Big Brass Christmas — Organizer Setup Guide

This website is built with **100% static HTML, CSS, and JavaScript**—meaning there are no build tools to install, no databases to pay for, and you can host it for **$0/month** anywhere.

---

## 1. Where to Edit Your Facebook Group Link & Logo

Open [`app.js`](./app.js) and look right at the top inside `SITE_CONFIG`:

```js
const SITE_CONFIG = {
  // 1. Paste your official Performers Facebook Group URL here:
  FACEBOOK_GROUP_URL: "https://www.facebook.com/groups/1791469391126811",

  // 2. When your logo file is ready, drop it into the `files/` folder
  //    and put its relative path here (e.g. "files/logo.png"):
  CUSTOM_LOGO_PATH: "",

  // 3. Optional Google Apps Script URL for shared Google Sheet tracking:
  GOOGLE_SCRIPT_URL: "",
  ...
};
```

- **Custom Logo:** Until you set `CUSTOM_LOGO_PATH`, the site displays a custom illustrated **Golden Tuba wearing a Santa Hat** (matching your 2026 flyer!) that plays a low-brass note and shoots musical notes when clicked.

---

## 2. How to Track Attendees & Collect Performer Emails Without a Backend (Free Google Sheet)

Right out of the box, the **Attendee Counter** and **Performer Signup Form** work immediately in browser preview mode.

To save every click and every performer's email address into a **live Google Sheet** that also updates the live counters for all visitors:

### Step A: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a new spreadsheet named **`Big Brass Christmas 2026`**.
2. Rename the first tab at the bottom to **`Performers`** and add headers in Row 1:
   `Timestamp` | `Name` | `Instrument` | `Email` | `Notes`
3. Click the **`+`** button at the bottom-left to add a second tab named **`Attendees`** and add headers in Row 1:
   `Timestamp` | `PartySize` | `Note`

### Step B: Paste This 35-Line Script
1. In your Google Sheet top menu, click **Extensions → Apps Script**.
2. Delete any code in the editor and paste the following:

```javascript
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const perfSheet = ss.getSheetByName("Performers");
  const attSheet = ss.getSheetByName("Attendees");

  // Count total performers & tally each low brass section from Column C (Instrument)
  const perfLastRow = perfSheet.getLastRow();
  const performers = Math.max(0, perfLastRow - 1);
  const sections = { tubas: 0, euphs: 0, bones: 0 };

  if (perfLastRow > 1) {
    const instValues = perfSheet.getRange(2, 3, perfLastRow - 1, 1).getValues();
    instValues.forEach((row) => {
      const inst = String(row[0] || "").toLowerCase();
      if (inst.includes("tuba") || inst.includes("sousa")) {
        sections.tubas += 1;
      } else if (inst.includes("euph") || inst.includes("bari")) {
        sections.euphs += 1;
      } else if (inst.includes("trombone") || inst.includes("bone")) {
        sections.bones += 1;
      }
    });
  }

  // Sum party sizes in Column B of Attendees tab
  let attendees = 0;
  const attLastRow = attSheet.getLastRow();
  if (attLastRow > 1) {
    const values = attSheet.getRange(2, 2, attLastRow - 1, 1).getValues();
    attendees = values.reduce((sum, row) => sum + (Number(row[0]) || 1), 0);
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      attendees,
      performers,
      sections,
      tubas: sections.tubas,
      euphs: sections.euphs,
      bones: sections.bones
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);
  const now = new Date();

  if (data.type === "performer") {
    ss.getSheetByName("Performers").appendRow([
      now,
      data.name || "",
      data.instrument || "",
      data.email || "",
      data.notes || ""
    ]);
  } else if (data.type === "attendee") {
    ss.getSheetByName("Attendees").appendRow([
      now,
      Number(data.partySize) || 1,
      data.note || ""
    ]);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Step C: Deploy & Paste the URL
1. Click **Deploy → New deployment** (top right).
2. Click the gear icon next to *Select type* and choose **Web app**.
3. Set **Execute as:** *Me* and **Who has access:** *Anyone*.
4. Click **Deploy**, copy the **Web app URL**, and paste it into `GOOGLE_SCRIPT_URL` in [`app.js`](./app.js)!

---

## 3. Easiest Free Ways to Host `bigbrasschristmas.com`

Because this site is just static files (`index.html`, `styles.css`, `app.js`, and the `files/` folder), you can host it for free in under 2 minutes:

1. **Netlify Drop (Simplest — Drag & Drop):**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `bigbrasschristmas` folder onto the page. It goes live immediately and you can connect `bigbrasschristmas.com` for free.
2. **GitHub Pages / Cloudflare Pages:**
   - Push this folder to a GitHub repository and enable GitHub Pages (or connect it to Cloudflare Pages) for free custom domain hosting + automatic SSL.

