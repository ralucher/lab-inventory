# Lucena Lab Inventory

A shared inventory for the lab: antibodies, chemicals, enzymes and kits, oligos, plasmids, strains, supplies and equipment, with stock counts and a reorder board.

- **Page:** a single `index.html`, hosted on GitHub Pages.
- **Data:** Google Firebase (Firestore). No lab data is stored in this repository.
- **Access:** people sign in with an email link or a Google account. Only the emails listed in the Firestore security rules can see or change anything.

## One-time setup (Firebase console, project `lucena-alcaide-lab`)

1. **Register the web app.** Project settings (gear icon) → *General* → *Your apps* → click the `</>` (Web) icon → name it "Lab inventory" → *Register app*. Don't tick Firebase Hosting. Copy `apiKey` and `appId` from the config it shows into `firebase-config.js`.
2. **Create the database.** *Build → Firestore Database → Create database* → location `eur3 (europe)` → start in **production mode**.
3. **Set the security rules.** *Firestore Database → Rules* → replace everything with your private `firestore.rules` (the copy with the real email addresses, kept outside this repository) → *Publish*.
4. **Turn on sign-in.** *Build → Authentication → Get started → Sign-in method*:
   - *Email/Password* → enable it **and** enable *Email link (passwordless sign-in)* → Save.
   - *Google* → enable → choose a support email → Save.
5. **Allow the GitHub Pages address.** *Authentication → Settings → Authorized domains → Add domain* → `ralucher.github.io`.

## Adding or removing a lab member

Edit the email list in the rules (*Firestore Database → Rules*) and click *Publish*. Emails must be lowercase. The change applies within a minute.

## Email when someone requests an order

A small Google Apps Script (`notify/Code.gs`) emails ralucher@gmail.com from that Gmail account each time a new order request is submitted. It only sends for real requests made by people on the lab's list.

1. Signed in as ralucher@gmail.com, go to https://script.google.com → **New project**. Name it "Lab inventory emails".
2. Replace the editor's contents with `notify/Code.gs` and save.
3. Choose the function **authorize** in the toolbar → **Run** → allow the permissions (send email, connect to an external service).
4. **Deploy → New deployment** → type **Web app** → *Execute as:* **Me** → *Who has access:* **Anyone** → **Deploy**. Copy the *Web app URL* (it ends in `/exec`).
5. Paste that URL into `notifyUrl` in `firebase-config.js` and push.

If you edit the script later, use **Deploy → Manage deployments → Edit → Version: New version** so the URL stays the same.

## Backups

In the app, **Backup → Download backup** saves everything as one JSON file. **Restore from file** writes a backup back into the database. Keep backup files private; don't commit them to this repository.

## Costs

The lab's usage fits in Firebase's free *Spark* plan (50,000 reads and 20,000 writes per day). The app never needs a paid plan.
