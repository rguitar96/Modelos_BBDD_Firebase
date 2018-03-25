/**
 * Writes the user's data to the database.
 */
// [START basic_write]
function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('usuarios/' + userId).set({
        nombre: name,
        correo: email,
        imagen: imageUrl
    });
}
// [END basic_write]

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
 *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
 */
function initApp() {
    // Result from Redirect auth flow.
    // [START getidptoken]
    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // [START_EXCLUDE]
            document.getElementById('quickstart-oauthtoken').textContent = token;
        } else {
            document.getElementById('quickstart-oauthtoken').textContent = 'null';
            // [END_EXCLUDE]
        }
        // The signed-in user info.
        var user = result.user;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
        } else {
            console.error(error);
        }
        // [END_EXCLUDE]
    });
    // [END getidptoken]

    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;

            //comprueba si existe un usuario con ese id
            firebase.database().ref('/usuarios/' + uid).once('value').then(function (snapshot) {
                var existe = (snapshot.val() !== null);
                if (!existe) { //el usuario no existe
                    //Inserta los datos del usuario
                    writeUserData(uid, displayName, email, photoURL);
                } else {
                    esAdmin = snapshot.val().admin;
                    if (esAdmin !== null) {
                        var child = document.getElementById("login-element");
                        child.parentNode.removeChild(child);
                        // Create the event
                        var event = new CustomEvent("eventlogin", {"detail": {"usuario": "admin"}});
                        document.dispatchEvent(event);
                    } else {
                        var event = new CustomEvent("eventlogin", {"datail": {"usuario": "usuario"}});
                        document.dispatchEvent(event);
                    }
                }

            });
            // [START_EXCLUDE]
            //document.getElementById('login').textContent = 'Sign out';
            var event = new CustomEvent("eventlogin", {"detail": {"usuario": "anonimo"}});
            document.dispatchEvent(event);
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('login').textContent = 'Sign in with Google';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
        document.getElementById('login').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]

    // document.getElementById('login').addEventListener('click', toggleSignIn, false);
}

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
/*function onAuthStateChanged(user) {
    // We ignore token refresh events.
    if (user && currentUID === user.uid) {
        return;
    }

    cleanupUi();
    if (user) {
        currentUID = user.uid;
        splashPage.style.display = 'none';
        writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        startDatabaseQueries();
    } else {
        // Set currentUID to null.
        currentUID = null;
        // Display the splash page where you can sign-in.
        splashPage.style.display = '';
    }
}

window.addEventListener('load', function () {
    // Bind Sign in button.
    signInButton.addEventListener('click', function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    });

    // Bind Sign out button.
    signOutButton.addEventListener('click', function () {
        firebase.auth().signOut();
    });

    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(onAuthStateChanged);

    // Saves message on form submit.
    messageForm.onsubmit = function (e) {
        e.preventDefault();
        var text = messageInput.value;
        var title = titleInput.value;
        if (text && title) {
            newPostForCurrentUser(title, text).then(function () {
                myPostsMenuButton.click();
            });
            messageInput.value = '';
            titleInput.value = '';
        }
    };

    // Bind menu buttons.
    recentMenuButton.onclick = function () {
        showSection(recentPostsSection, recentMenuButton);
    };
    myPostsMenuButton.onclick = function () {
        showSection(userPostsSection, myPostsMenuButton);
    };
    myTopPostsMenuButton.onclick = function () {
        showSection(topUserPostsSection, myTopPostsMenuButton);
    };
    addButton.onclick = function () {
        showSection(addPost);
        messageInput.value = '';
        titleInput.value = '';
    };
    recentMenuButton.onclick();
}, false);*/