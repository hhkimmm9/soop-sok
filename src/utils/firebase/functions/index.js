/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require('firebase-functions/v2/https');
 * const {onDocumentWritten} = require('firebase-functions/v2/firestore');
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require('firebase-functions/v2/https');
// const logger = require('firebase-functions/logger');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info('Hello logs!', {structuredData: true});
//   response.send('Hello from Firebase!');
// });

const functions = require("firebase-functions")
const admin = require("firebase-admin")
// const { v4: uuidv4 } = require('uuid');

admin.initializeApp()

const db = admin.firestore()

async function updateBanner() {
  try {
    // banners 컬렉션에서 각 cid 별로 그룹화하여 배너를 랜덤하게 선택합니다.
    const bannersByCid = {}
    const snapshot = await db.collection("banners").get()
    snapshot.forEach((doc) => {
      const banner = { id: doc.id, ...doc.data() }
      const cid = banner.cid
      if (!bannersByCid[cid]) {
        bannersByCid[cid] = [banner]
      } else {
        bannersByCid[cid].push(banner)
      }
    })

    // 각 cid 그룹에서 랜덤하게 선택된 배너를 업데이트하고, 나머지 배너를 삭제합니다.
    const batch = db.batch()
    for (const cid in bannersByCid) {
      const banners = bannersByCid[cid]
      if (banners.length > 0) {
        // 랜덤하게 선택된 document를 선택합니다.
        const randomIndex = Math.floor(Math.random() * banners.length)
        const selectedBanner = banners[randomIndex]
        // 선택된 document의 selected 속성을 true로 업데이트합니다.
        const selectedDocRef = db.collection("banners").doc(selectedBanner.id)
        batch.update(selectedDocRef, { selected: true })
        // 선택된 document 이외의 모든 document를 삭제합니다.
        banners.forEach((banner) => {
          if (banner.id !== selectedBanner.id) {
            const docRef = db.collection("banners").doc(banner.id)
            batch.delete(docRef)
          }
        })
      }
    }

    await batch.commit()

    console.log(
      "Selected banner updated and other banners deleted successfully.",
    )
  } catch (error) {
    console.error("Error updating banner:", error)
  }
}

exports.scheduledFunction = functions.pubsub
  .schedule("every 30 minutes")
  .onRun((context) => {
    console.log("This will be run every hour!", context)
    updateBanner()
    return null
  })
