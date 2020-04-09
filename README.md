# LinkedUp

The project is marketed towards students, in our case specifically BCIT students, who have difficulty
expanding their network beyond their set and/or program. This application will allow student's to "link" and connect with other students on campus.

This small project demonstrates:

- Read and write to firestore, a non-sql database
- Use of firebase authentication and creation of a users collection in firestore
- Custom login and sign up experience with the ability to upload profile photo.
- Customized user experience after login/signup
- Showing profiles of other users.
- Use of navbar in boostrap
- The ability for a user to edit their profile.
- The ability to direct message another matched user.

## Getting Started

Simply register with an "@my.bcit.ca" email and start looking at potential connections to link up with.

## Built With

* [Bootstrap](https://getbootstrap.com) - Used as the Front-end framework
* [fontawesome-free](https://fontawesome.com) - Used for icons
* [jquery](https://jquery.com) - "The Write Less, Do More, JavaScript Library"
* [Magnific Popup](https://dimsemenov.com/plugins/magnific-popup/) - Used for the form styling.
* [Firebase](https://firebase.google.com) - Used as the backend storage and Database

Some other technologies that were used for this project:
- HTML, CSS
- JavaScript

## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── createprofile.html       # create profile HTML file, this is what is used to create a user profile
├── editprofile.html         # edit profile HTML file, this is what users see when they want to edit their profile
├── index.html               # index HTML file, main landing page for the app
├── login.html               # login HTML file, used to loging and register a user
├── main.html                # main HTML file, shown after logs in, displays other potential users to match with. 
├── messagelist.html         # messageList HTML file, used to show the current matches of the user/direct messages. 
├── messageuser.html         # messageUser HTML file, used to send message to another user. 
└── README.md

It has the following subfolders:
├── .firebase                # Folder for firebase
├── .git                     # Folder for git repo
├── css                      # Folder for css files
    /createprofile.css/editprofile.css
    /landing/creative.css
    /landing/creative.min.css
    /login.css
    /main.css
    /messagelist.css
    /messageuser.css
├── images                   # Folder for images
    /logo.svg                # Used for the logo of the site.
    /upload.png              # Used for the upload button of create and edit profile page.
    /placeholderimage.jpg    # Used as a placeholder image if user image is not found.
├── scripts                  # Folder for scripts
    /Landing/creative.js     # used for landing page external function
    /Landing/creative.min.js # used for landing page external function
    /dropzone/dropzone.js    # used for uploading image external function
    /editprofile.js          # used for editing profile page js function
    /firebase/firebaseAPI.js # used for to keep the firebase api for messages page
    /login.js                # used for the login page js function
    /main.js                 # used for main page js function
    /messagelist.js          # used for the message page js function
    /messageuser.js          # used for the direct message page js function
    /signup.js               # used for the sign up message page js function
    /sweetAlert/sweetalert2.all.min.js # used for the sweet alert js function
├── vendor                  # Folder for external vendor scripts used.
Firebase hosting files: 
├── .firebaserc              # Firebase file
├── firebase.json            # Firebase file
├── firestore.indexes.json   # Firebase file
├── firestore.rules          # Rules for read/write to firestore


```

## Authors

* **Rahim Askarzadeh** - [RADeveloping](https://github.com/RADeveloping)
* **William He** - [Bywfaru](https://github.com/Bywfaru)
* **Arash Tabrizi** - [Arash-Tabrizi](https://github.com/Arash-Tabrizi)
* **Jason Chi** - [jchiason](https://github.com/jchiason)
* **Lotfi A.** - [web1800](https://github.com/web1800)

See also the list of [contributors](https://github.com/RADeveloping/LinkedUp/contributors) who participated in this project.

## Acknowledgments

* (https://github.com/BlackrockDigital/startbootstrap-creative) - For The Landing Page
* (https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/) - For help with understanding the regex pattern used for validation
* (https://www.regextester.com/94044) - Validation of the regex
* (https://www.dropzonejs.com/#usage) - For the uploading user profile photo.
* (https://sweetalert2.github.io) - Used as an alternative alert.



