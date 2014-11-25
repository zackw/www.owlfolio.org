Title: Better SSL error screens
Date: 2010-02-16 13:11
Slug: ssl-errors

Right now, when you visit a website that uses encryption in Firefox
and there's anything at all wrong with the encrypted connection, you
get this screen:

[![The current SSL warning screen, which is generic and uninformative unless you know how to read SSL certificates already](http://owl-folio.nfshost.com/media/2010/05/mockup-current-300x169.png
"Current SSL warning")](http://owl-folio.nfshost.com/media/2010/05/mockup-current.html)

This is a big block of jargon which doesn't do anything to tell the
user how big the risk actually is, or help them distinguish a minor
problem from a major one. If you click on "technical details" you get
a little bit more information about what went wrong, but it still
doesn't make any effort to give advice.

The Firefox UI team has been talking about using [Herdict][] or a
similar service to [improve network error screens][net-error],
especially the [site not found screen][site-not-found]. I think we
could get a lot of mileage out of that for SSL errors as well. We
should also make use of the user's history with the site, and pay
attention to what exactly is wrong with the credential. Here are some
examples.

[![Proposed warning screen for a website with a self-signed certificate](http://owl-folio.nfshost.com/media/2010/05/mockup-selfsigned-300x210.png
"Self-signed certificate")](http://owl-folio.nfshost.com/media/2010/05/mockup-selfsigned.html)

The only problem with self-signed certificates is they *haven't* been
signed by a trusted third party. The connection is secure, but you
might not be talking to who you think you are. In the first section,
we emphasize that the concern here is with identity, and we use
Herdict information to deduce that this is probably *not* a hijacked
site, because lots of people get the same credential. ("The same
credential" means *exactly* the same, not just some self-signed cert,
but we needn't bother people with that unless they want to see the
details.)

In the "What should I do?" section, we give some examples of things
that might be unsafe to trust this site with, but we **go ahead and
let them visit the site**, automatically storing the self-signed cert
and marking it valid for this site only. We implement [bug 251407][],
so we can promise to notify the user if the site's credentials change
in the future.

I've front-loaded the information that used to be in the "technical
details" section, so it has been replaced with "Inspect the
Credentials". If you open that area up, it shows the certificate, but
in a more user-friendly way than the existing certificate dialog box
does. Especially important here is to reveal the interesting parts
immediately, highlight suspicious things, and deemphasize the jargon
and the long hexadecimal numbers.

"I understand the risks" is still there, but in this case, it's for
people who didn't read the rest of the page. It's meant to make people
stop, slow down, and reread. If you click on it you get another link
to the page.

[![Proposed warning screen when connection tampering has been detected](http://owl-folio.nfshost.com/media/2010/05/mockup-tampering-300x204.png
"Connection tampering detected")](http://owl-folio.nfshost.com/media/2010/05/mockup-tampering.html)

There are exploits in the wild that take over your WiFi hub, or your
cable modem. Once they've done that, they are in a position to tamper
with all your Internet traffic. I ran into one of these for reals last
week; I was in a café and getting certificate errors on *every* secure
site I tried to visit, including Mozilla's mail server. (The theory is
that you'll just click through the error messages because you want to
get your email, or whatever; one of the staff at the café did just
that when I complained.) Here's where Herdict could really come in
handy: if *you* are getting certificate errors but nobody else is, we
can deduce a problem near your computer.

Again, the first section tries to be clear and specific about the
problem: we suspect that someone is tampering with your Internet
connection, and here is why. The second section underlines how big a
deal this is: "Do not log into any site or buy anything online." It
then suggests a test: visit another secure website and see if the
problem persists. This scenario should put the whole browser into a
paranoid mode, where it will not load saved passwords and continues to
try to work out whether there's something wrong with the local router.
Ultimately, we should advise people in this boat to factory-reset
their WiFi hub and/or contact their ISP for help, but we should take
care to be certain in our diagnosis first.

In this scenario, the "I understand the risks" section gives you
access to the certificate-exception dialogs, as it does now.

[![Proposed warning screen for a website whose server may have been hijacked](http://owl-folio.nfshost.com/media/2010/05/mockup-hijack-300x204.png
"Hijacked server")](http://owl-folio.nfshost.com/media/2010/05/mockup-hijack.html)

Finally, here's what it looks like in the comparatively rare scenario
that SSL certificates were originally intended to defend against: the
server has been hijacked (but the attackers do not have access to the
cert). We can tell from browser history that the cert has changed, and
we can tell from Herdict that it has changed for everyone. We tell the
user not to visit *this* website, and again, suggest trying another
secure site. (We need to take care to distinguish this case from an
expired or legitimately changed cert.)

[Herdict]: http://www.herdict.org/web/
[net-error]: http://jboriss.wordpress.com/2010/01/04/herdict-and-its-tasty-anonymized-aggregated-data/
[site-not-found]: http://www.toolness.com/wp/?p=772
[bug 251407]: https://bugzilla.mozilla.org/show_bug.cgi?id=251407

