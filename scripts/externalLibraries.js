// DO NOT MODIFY THIS FILE //

function includeJS(scriptFileName) {
	var scriptTag = document.createElement('script');
	scriptTag.type = 'text/javascript';
	scriptTag.src = scriptFileName;
	document.head.appendChild(scriptTag);
}

function includeJSBootStrap(scriptFileName, integrity) {
	var scriptTag = document.createElement('script');
	scriptTag.type = 'text/javascript';
    scriptTag.src = scriptFileName;
    scriptTag.integrity = integrity;
    scriptTag.crossOrigin = "anonymous"
	document.head.appendChild(scriptTag);
}

function includeCSS(cssFileName){

    var cssTag = document.createElement('link');
    cssTag.type = 'text/css';
    cssTag.rel = "stylesheet";
	cssTag.href = cssFileName;
	document.head.appendChild(cssTag);
}

function includeCSSBootStrap(cssFileName, integrity){

    var cssTag = document.createElement('link');
    cssTag.type = 'text/css';
    cssTag.rel = "stylesheet";
    cssTag.href = cssFileName;
    cssTag.integrity = integrity;
    cssTag.crossOrigin = "anonymous";
	document.head.appendChild(cssTag);
}


function createMeta(name, content) {
    var metaTag = document.createElement('meta');
    metaTag.name = name;
    metaTag.content = content;
	document.head.appendChild(metaTag);
}

createMeta("viewport", "width=device-width, initial-scale=1, shrink-to-fit=no");
createMeta("linkedUp boilerplate code", "LinkedUp");
createMeta("author", "LinkedUp");

includeJSBootStrap("https://code.jquery.com/jquery-3.4.1.slim.min.js", "sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n");
includeJSBootStrap("https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js", "sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo");
includeJSBootStrap("https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js", "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6");

includeJS("https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js");
includeJS("https://www.gstatic.com/firebasejs/7.10.0/firebase-analytics.js");
includeJS("https://www.gstatic.com/firebasejs/7.10.0/firebase-auth.js");
includeJS("https://www.gstatic.com/firebasejs/7.10.0/firebase-firestore.jss");
includeJS("https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js")

includeCSSBootStrap("https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", "sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh");
includeCSS("https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css");
includeCSS("css/style.css");

// DO NOT MODIFY THIS FILE //
