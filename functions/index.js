/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
"use strict";

const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const {logger} = require("firebase-functions/v1");
if (admin.apps.length === 0) {
    admin.initializeApp();
}

const PromisePool = require("es6-promise-pool");
const MAX_CONCURRENT = 3;
/**
 *
 * @param {admin.auth.UserRecord[]} [users] the current list of inactive users
 * @param {string} [nextPageToken]
 * @return {Promise<admin.auth.UserRecord[]>}
 */
async function getInactiveUsers(users = [], nextPageToken) {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    const inactiveUsers = result.users.filter(
        (user) =>
            Date.parse(
                user.metadata.lastRefreshTime || user.metadata.lastSignInTime,
            ) <
            Date.now() - 120 * 24 * 60 *60 * 1000,
    );

    users = users.concat(inactiveUsers);

    if (result.pageToken) {
        return getInactiveUsers(users, result.pageToken);
    }

    return users;
}


/**
 *
 * @param {admin.auth.UserRecord[]} inactiveUsers
 * @return {null | Promise<void>}
 */
function deleteInactiveUser(inactiveUsers) {
    if (inactiveUsers.length > 0) {
        const userToDelete = inactiveUsers.pop();

        admin.firestore().collection("users")
        .where("uid", "==", userToDelete.uid)
        .get().then((result) => {
            result.forEach((doc) => {
                admin.firestore().doc("users/" + doc.id).delete();
            });
        }).catch((error) => logger.error(error));

        return admin.auth().deleteUser(userToDelete.uid).then(() => {
            return logger.log(
                "Deleted user account",
                userToDelete.uid,
                "because of 120 days of inactivity",
            );
        }).catch((error) => {
            return logger.error(
                "Deletion of inacitve user account",
                userToDelete.uid,
                "failed:",
                error,
            );
        });
    } else {
        return null;
    }
}

exports.accountCleanup = onSchedule("every saturday 00:00", async (event) => {
    const inactiveUsers = await getInactiveUsers();
    const promisePool = new PromisePool(
        () => deleteInactiveUser(inactiveUsers), MAX_CONCURRENT);
    await promisePool.start();
    logger.log("user cleanup finished");
});
