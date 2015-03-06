// Load MathJax as a polyfill if there are any <math> elements on the page.
(function (d, w) {
    "use strict";
    var s;
    if (d.getElementsByTagName("math").length) {
        w.MathJax = {
            config: ["MML_HTMLorMML.js"],
            extensions: ["MatchWebFonts.js"],
            "HTML-CSS": {
                preferredFont: "STIX",
                webFont: "STIX-Web",
                imageFont: null
            },
            MathMenu: { showLocale: false },
            // This is the only way to remove SVG from the renderer submenu.
            AuthorInit: function () {
                w.MathJax.Hub.Register.StartupHook("MathMenu Ready",
                    function () {
                        w.MathJax.Menu.menu.Find("Math Settings",
                                                 "Math Renderer",
                                                 "SVG").hidden = true;
                });
            }
        };
        s = d.createElement("script");
        s.async = true;
        s.src = "//hacks.owlfolio.org/s/MathJax.48b594af/MathJax.js";
        d.body.appendChild(s);
    }
})(document, window);
