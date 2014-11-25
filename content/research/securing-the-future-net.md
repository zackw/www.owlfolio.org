Title: Securing the future net
Date: 2011-04-06 17:26
Slug: securing-the-future-net

Today I had the fortune to attend a group discussion ambitiously
entitled "Future of Internet Security" at Mozilla. What this was
*mostly* about was, given that a [recent incident][] has severely
shaken everyone's confidence in the [PKIX][] (PDF, say sorry)
mechanism that everyone currently uses to decide that a secure website
is who it says it is, what can we do about it? I'm not going to
attempt to summarize the discussion; instead I'm going to point at the
[Etherpad log][], then plow boldly forward with my own
(incontrovertibly correct, of course) opinion on the way forward, on
the assumption that everyone who reads this will already be familiar
enough with the context to know what I'm talking
about. **[EDIT 8 April:** A [video record of the discussion][] is now available.**]**

I will quote in full the "principles" with which the discussion was
kicked off, though (really they're more like constraints on solutions
acceptable to all parties).

> * Performance - large sites will not adopt solutions which bulk up
>   the amount of data required to be exchanged to establish an secure
>   connection.
> * Independence/Availability - large sites will not accept tying the
>   uptime of their site to the uptime of infrastructure over which they
>   have no control (e.g. an OCSP responder)
> * Accessibility/Usability - solutions should not put the cost of
>   security, either in terms of single sites or large deployments, out of
>   the reach of ordinary people
> * Simplicity - solutions should be simple to deploy, or capable of
>   being made simple.
> * Privacy - ideally, web users should not have to reveal their
>   browsing habits to a third party.
> * Fail-closed - new mechanisms should allow us to treat mechanism
>   and policy failures as hard failures (not doing so is why revocation is
>   ineffective) (however this is trading off security for availability,
>   which has historically proven almost impossible).
> * Disclosure - the structure of the system should be knowable by
>   all parties, and users must know the identities of who they are trusting

I should probably emphasize that this is a "walk, do not run, to the
exits" situation. The status quo is dire, but we can afford to take
the time to come up with a solution that solves the problem
thoroughly; we do not need an emergency stopgap. Despite that, I think
the short-term solution will be different from the long-term solution.

In the short term, the solution with the most traction, and IMO the
best chance of actually helping, is [DANE][], an IETF draft standard
for putting TLS server keys in the DNS. This can (at least on paper)
completely replace the common "DV" certificates issued by traditional
certificate authorities. However, to offer real security improvements
relative to the status quo, I assert that the final version of the
spec needs to:

* Require clients to fail closed on any sort of validation failure. The
  current text of the spec does say this, but not clearly and not with
  enough [RFC2119][] "MUST"s.
* Provide *exclusion* ("trust no server keys but these", possibly also
  "trust no CA but these") rather than *inclusion* ("you should trust
  this server key"). The current text of the spec can be read either
  way. A vocal minority of the DANE working group wants inclusion. It
  is my considered opinion that inclusion is *completely
  useless*---all it does is add the DNS root signing key to the
  existing pool of trusted CAs, which doesn't solve the untrustworthy
  CA problem.
* Require the use of DNSSEC. It has recently been suggested that a
  signed DNS zone is not necessary for exclusion, but then a
  DNS-tampering attacker can deny service by injecting a bogus DANE
  record, which will deter deployment. (It doesn't matter that a
  DNS-tampering attacker can also deny service by messing up the A
  records; this is a *new* risk, which scares people more than an
  existing risk.)
* Clearly indicate that it does not provide EV-level validation,
  leaving a business model for traditional CAs to retreat to.

In the longer term, I think we're going to want to move to some sort
of content-based addressing. DANE gets rid of the CA mess, but it
substitutes the DNS as a single point of failure. Here's a half-baked
scheme that we could start rolling out real soon for URIs that don't
need to be user comprehensible:

    <!-- jQuery 1.5.2 -->
    <script src="h:sha1,b8dcaa1c866905c0bdb0b70c8e564ff1c3fe27ad"></script>

The browser somehow knows how to expand `h:` URIs to something it can
go ask a server on the net for. What the server produces MUST be
discarded if it does not have the specified hash (and the browser can
go try some *other* server). We don't need to worry about where the
browser got the content or whether it was transferred under
encryption---if it's not what was wanted, it'll fail the hash check.
Still to be worked out: how to do the expansion without reintroducing
that single point of failure; how to disseminate these URIs; how to
fit dynamic content into the scheme; under what circumstances `h:`
URIs should, or should not, be considered same-origin with the
requesting page.

[recent incident]: https://www.eff.org/deeplinks/2011/03/iranian-hackers-obtain-fraudulent-https
[PKIX]: http://www.cs.auckland.ac.nz/~pgut001/pubs/pkitutorial.pdf
[Etherpad log]: http://etherpad.mozilla.com:9000/ep/pad/view/ro.IWd3P/rev.6007
[video record of the discussion]: http://videos-cdn.mozilla.net/serv/air_mozilla/future-of-internet-security.ogg
[DANE]: http://tools.ietf.org/html/draft-ietf-dane-protocol
[RFC2119]: http://tools.ietf.org/html/rfc2119
