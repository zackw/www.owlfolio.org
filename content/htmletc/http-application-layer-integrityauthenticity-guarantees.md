Title: HTTP application layer integrity/authenticity guarantees
Date: 2014-03-17 12:08
Slug: http-application-layer-integrityauthenticity-guarantees

**Note:** These are half-baked ideas I've been turning over in my
head, and should not be taken all that seriously.

Best available practice for mutually authenticated Web services (that
is, both the client and the server know who the other party is) goes
like this: TLS provides *channel* confidentiality and integrity to
both parties; an X.509 certificate (countersigned by some sort of CA)
offers evidence that the server is whom the client expects it to be;
all resources are served from `https://` URLs, thus the channel's
integrity guarantee can be taken to apply to the content; the client
identifies itself to the server with either a username and password,
or a third-party identity voucher (OAuth, OpenID, etc), which is
exchanged for a session cookie. Nobody can impersonate the server
without either subverting a CA or stealing the server's private key,
but all of the client's proffered credentials are *bearer tokens*:
anyone who can read them can impersonate the client to the server,
probably for an extended period. TLS's channel confidentiality assures
that no one in the middle can read the tokens, but there are an awful
lot of ways they can leak at the endpoints. Security-conscious sites
nowadays have been adding one-time passwords and/or
computer-identifying secondary cookies, but the combination of session
cookie and secondary cookie is still a bearer token (possibly you also
have to masquerade the client's IP address).

Here are some design requirements for a better scheme:

* Identify clients to servers using something that is not a bearer
  token: that is, even if client and server are communicating on an
  open (not confidential) channel, no eavesdropper gains sufficient
  information to impersonate client to server.
* Provide application-layer message authentication in both directions:
  that is, both receivers can verify that each *HTTP query and
  response* is what the sender sent, without relying on TLS's
  *channel* integrity assurance.
* The application layer MACs should be cryptographically bound to the
  TLS server certificate (server→client) and the long-term client
  identity (when available) (client→server).
* Neither party should be able to forge MACs in the name of their peer
  (i.e. server does not gain ability to impersonate client to a third
  party, and vice versa).
* The client should not implicitly identify itself to the server when
  the user thinks they're logged out.
* Must afford at least as much design flexibility to site authors as
  the status quo.
* Must gracefully degrade to the status quo when only one party
  supports the new system.
* Must minimize number of additional expensive cryptographic
  operations on the server.
* Must minimize server-held state.
* Must not make server administrators deal with X.509 more than they
  already do.
* Compromise of any key material that has to be held in online storage
  must not be a catastrophe.
* If we can build a foundation for getting away from the CA quagmire
  in here somewhere, that would be nice.
* If we can free sites from having to maintain databases of hashed
  passwords, that would be really nice.

The cryptographic primitives we need for this look something like:

* A dirt-cheap asymmetric (verifier cannot forge signatures) message
  authentication code.
* A mechanism for mutual agreement to session keys for the above MAC.
* A reasonably efficient zero-knowledge proof of identity which can be
  bootstrapped from existing credentials (e.g. username+password pairs).
* A way to bind one party's contribution to the session keys to other
  credentials, such as the TLS shared secret, long-term client identity,
  and server certificate.

And here are some preliminary notes on how the protocol might work:

* New HTTP query and response headers, sent only over TLS, declare
  client and server willingness to participate in the new scheme, and
  carry the first steps of the session key agreement protocol.
* More new HTTP query and response headers sign each query and
  response once keys are negotiated.
* The server always binds its half of the key agreement to its TLS
  identity (possibly via some intermediate key).
* Upon explicit login action, the session key is renegotiated with the
  client identity tied in as well, and the server is provided with a
  zero-knowledge proof of the client's long-term identity. This
  probably works via some combination of HTTP headers and new HTML
  form elements (`<input type="password" method="zkp">` perhaps?)
* Login provides the client with a *ticket* which can be used for an
  extended period as backup for new session key negotiations (thus
  providing a mechanism for automatic login for new sessions). The
  ticket must be useless without actual knowledge of the client's
  long-term identity. The server-side state associated with this
  ticket must not be confidential (i.e. learning it is useless to an
  attacker) and ideally should be no more than a list of serial
  numbers for currently-valid tickets for that user.
* Logout destroys the ticket by removing its serial number from the
  list.
* If the client side of the zero-knowledge proof can be carried out in
  JavaScript as a fallback, the server need not store passwords at
  all, only ZKP verifier information; in that circumstance it would
  issue bearer session cookies instead of a ticket + renegotiated
  sesson authentication keys. (This is strictly an improvement over
  the status quo, so the usual objections to crypto in JS do not
  apply.) Servers that want to maintain compatibility with old clients
  that don't support JavaScript can go on storing hashed passwords
  server-side.

I know all of this is *possible* except maybe the dirt-cheap
asymmetric MAC, but I don't know what cryptographers would pick for
the primitives. I'm also not sure what to do to make it interoperable
with OpenID etc.
