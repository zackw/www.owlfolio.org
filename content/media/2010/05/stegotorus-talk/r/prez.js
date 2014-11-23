/* This was written assuming the presence of a whole bunch of
   relatively new CSS and DOM features.  I attempted to write it
   portably otherwise, but I make no promises about its actually
   working in anything other than Firefox 16, which is what I used to
   deliver the presentation. */

var sizeThresh;
var baseTitle;

function elementInViewport(el)
{
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      top + height <= window.pageYOffset + window.innerHeight &&
      left + width <= window.pageXOffset + window.innerWidth
    );
}

// All state changes ultimately wind up here.
function hashchangeEvent(unused)
{
    var newhash = window.location.hash;
    var slides = document.getElementsByClassName("currentSlide");
    var cur;
    if (slides.length > 0)
        cur = slides[0];
    else
        cur = document.getElementsByTagName("section")[0];

    document.body.classList.remove("menu-mode");
    for (var i = 0; i < slides.length; i++)
        slides[i].classList.remove("currentSlide");

    if (newhash === "" || newhash === "#") {
        cur.classList.add("currentSlide");
        document.body.classList.add("menu-mode");
        document.title = baseTitle;
        if (!elementInViewport(cur))
            cur.scrollIntoView(true);
    } else {
        var target = document.getElementById(newhash.slice(1));
        while (target
               && target !== document
               && target.tagName !== "SECTION")
            target = target.parentNode;
        if (!target || target.tagName !== "SECTION") {
            target = cur;
        }
        target.classList.add("currentSlide");
        target.scrollIntoView(true);

        var subtitle = "";
        if (target.firstElementChild &&
            target.firstElementChild.tagName.slice(0,1) === "H" &&
            target.firstElementChild.tagName !== "HGROUP")
            subtitle = target.firstElementChild.textContent;
        if (subtitle !== "")
            subtitle = " " + subtitle;
        document.title = baseTitle + " ―" + subtitle;
    }
}

function selectSlide(target)
{
    window.history.pushState("", "", "#" + target.id);
    hashchangeEvent();
}

function nextSlide()
{
    var slides = document.getElementsByClassName("currentSlide");
    var cur = slides[0];
    var next = cur.getUserData("nextSlide");
    if (next)
        selectSlide(next);
}

function prevSlide()
{
    var slides = document.getElementsByClassName("currentSlide");
    var cur = slides[0];
    var prev = cur.getUserData("prevSlide");
    if (prev)
        selectSlide(prev);
}

function enterMenu()
{
    history.pushState("", "",
                      window.location.pathname + window.location.search);
    hashchangeEvent();
}

function clickEvent(event)
{
    if (document.body.classList.contains("menu-mode")) {
        selectSlide(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    return true;
}

function moveCandidate(from, to)
{
    if (from && to) {
        from.classList.remove("candidate");
        to.classList.add("candidate");
        if (!elementInViewport(to)) {
            to.scrollIntoView(from.getUserData("index") >
                              to.getUserData("index"));
        }
    }
}

function findNextRow(from, direction)
{
    var delta = direction * (sizeThresh.matches ? 4 : 3);
    var slides = document.getElementsByTagName("section");
    var index = from.getUserData("index");
    var target = index + delta;
    if (target < 0 || target >= slides.length)
        return false;
    return slides[target];
}

function keyEventMenu(event) {
    var cur;

    cur = document.getElementsByClassName("candidate")[0];
    if (!cur)
        cur = document.getElementsByClassName("currentSlide")[0];

    switch (event.keyCode) {
    case 13: /* return */
    case 32: /* space */
    case 77: /* M */
    case 109: /* m */
        selectSlide(cur);
        break;

    case 37: /* left arrow */
        moveCandidate(cur, cur.getUserData("prevSlide"));
        break;

    case 38: /* up arrow */
        moveCandidate(cur, findNextRow(cur, -1));
        break;

    case 39: /* right arrow */
        moveCandidate(cur, cur.getUserData("nextSlide"));
        break;

    case 40: /* down arrow */
        moveCandidate(cur, findNextRow(cur, +1));
        break;

    default:
        return true;
    }
    event.stopPropagation();
    event.preventDefault();
    return false;
}

function keyEvent(event)
{
    if (document.body.classList.contains("menu-mode"))
        return keyEventMenu(event);

    switch (event.keyCode) {
    case 13:  /* return */
    case 32:  /* space */
    case 34:  /* page down */
    case 39:  /* right arrow */
    case 40:  /* down arrow */
        nextSlide();
        break;

    case 8:   /* backspace */
    case 33:  /* page up */
    case 37:  /* left arrow */
    case 38:  /* up arrow */
        prevSlide();
        break;

    case 77:  /* M */
    case 109: /* m - defensive */
        enterMenu();
        break;

    default:
        return true;
    }
    event.stopPropagation();
    event.preventDefault();
    return false;
}

function rewriteSlideDOM(slide, index)
{
    var slideNoText = document.createTextNode("" + index);
    var slideNo = document.createElement("div");
    slideNo.className = "slideNumber";
    slideNo.appendChild(slideNoText);
    slide.appendChild(slideNo);

    if (slide.id === undefined || slide.id === null ||
        slide.id === "")
        slide.id = "slide-" + index;
}

function loadEvent()
{
    var slides = document.getElementsByTagName('section');
    var i;

    for (i = 0; i < slides.length; i++) {
        rewriteSlideDOM(slides[i], i+1);

        slides[i].setUserData("prevSlide",
                              (i == 0) ? null : slides[i-1],
                              null);

        slides[i].setUserData("nextSlide",
                              (i == slides.length)
                              ? null : slides[i+1],
                              null);

        slides[i].setUserData("index", i, null);
        slides[i].addEventListener("click", clickEvent, true);
    }
    window.addEventListener("keydown", keyEvent);

    window.addEventListener("hashchange", hashchangeEvent);
    window.addEventListener("popstate", hashchangeEvent);

    sizeThresh = window.matchMedia(
        "(min-width: 1022px) and (min-height: 766px)");
    sizeThresh.addListener(function() {
        if (!document.body.classList.contains("menu-mode"))
            document.getElementsByClassName("currentSlide")[0]
                .scrollIntoView(true);
    });

    baseTitle = document.title;
    hashchangeEvent();
}

document.addEventListener("DOMContentLoaded", loadEvent);


/* todo:
   menu
   goto
   hash
   slide numbers
   generic footer and header support?
*/