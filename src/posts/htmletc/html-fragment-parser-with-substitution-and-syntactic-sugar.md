---
title: HTML Fragment Parser with Substitution and Syntactic Sugar
date: 2012-06-22 19:05
slug: html-fragment-parser-with-substitution-and-syntactic-sugar
---

This is a little off my usual beaten path, but what the heck.

This is two related proposals: one for a new DOM feature,
`document.parseDocumentFragment`, and one for JS syntactic sugar for
that feature.  It is a response to Ian Hickson's
[E4H Strawman](http://www.hixie.ch/specs/e4h/strawman), and is
partially inspired by the
[general quasi-literal proposal](https://web.archive.org/web/20120712171534/http://wiki.ecmascript.org/doku.php?id=harmony:quasis)
for
[ES-Harmony](https://web.archive.org/web/20120508010303/http://wiki.ecmascript.org/doku.php?id=harmony:harmony).

Compared to Hixie's proposal, this avoids embedding a subset of the
HTML grammar in the JS grammar, while at the same time being more
likely to conform with author expectations, since the HTML actually
gets parsed by the HTML parser.  It should have at least equivalent
expressivity and power.

## Motivating Example

```js
function addUserBox(userlist, username, icon, attrs) {
  var section = h`<section class="user" {attrs}>
                    <h1>{username}</h1>
                  </section>`;
  if (icon)
    section.append(h`<img src="{icon}" alt="">`);
  userlist.append(section);
}
```

<!--more-->

## `document.parseDocumentFragment`

This is a new method on the DOM
[Document](http://www.w3.org/TR/DOM-Level-2-Core/core.html#i-Document)
interface:

```webidl
DocumentFragment parseDocumentFragment(in DOMString htmlText,
                                       optional object substitutions)
                     throws DOMException;
```

The `htmlText` is parsed as-if by the
[HTML fragment parsing algorithm](https://html.spec.whatwg.org/multipage/syntax.html#parsing-html-fragments),
with no context element; the resulting sequence of DOM nodes is
collected into a `DocumentFragment`, which is returned.

The `substitutions` argument cannot be described in WebIDL as far as I
can tell.  It must be a dictionary, but it can have any number of
arbitrarily-named keys and arbitrary values, except that all keys must
be valid JavaScript identifiers.  The values in the dictionary are
constrained as described below.

If the `substitutions` argument is supplied, then the
[HTML5 tokenizer](https://html.spec.whatwg.org/multipage/syntax.html#tokenization)
uses it as follows:

* A _substitution reference_ consists syntactically of an
  U+007B LEFT CURLY BRACKET (`{`) character, followed immediately by a
  valid JavaScript identifier, followed immediately by an U+007D RIGHT
  CURLY BRACKET (`}`) character.  A _live_ substitution reference is a
  substitution reference for which the `substitutions` dictionary
  contains a key which is character-by-character identical to the
  JavaScript identifier, and the _corresponding value_ for that
  substitution reference is the dictionary value corresponding to
  that key.

* In all tokenizer states, a substitution reference which is _not_
  live (i.e. which has no corresponding value in the `substitutions`
  dictionary) is processed as its constituent sequence of characters
  would have been in the absence of this specification.

* If the tokenizer is in _data state_ and it encounters a live
  substitution reference, then:

  * If the corresponding value is a DOMString, then it is inserted
    into the document in place of the substitution reference, as-if
    the tokenizer had emitted its contents as a sequence of character
    tokens.

  * If the corresponding value is a DOM Node of any kind, then it is
    inserted into the document in place of the substitution reference,
    as-if by `appendChild` (_not_ as-if by the parser's tree
    construction stage) applied to the _current node_.  The _current
    node_ pointer remains the same.

  * Otherwise, a DOMException is thrown.

* If the tokenizer is in _RCDATA state_, _RAWTEXT state_, or
  _script data state_, and it encounters a live substitution
  reference, then: if the corresponding value is a DOMString, then it
  is inserted into the document in place of the substitution
  reference, as-if the tokenizer had emitted its contents as a
  sequence of character tokens; otherwise, a DOMException is thrown.

* If the _complete text_ of any _quoted_ attribute value is a single
  live substitution reference, then: if the corresponding value is a
  DOMString, then the tokenizer changes the value of that attribute to
  be the contents of the DOMString; otherwise, a DOMException is
  thrown.

* If the tokenizer is in _before attribute name state_ and it
  encounters a live substitution reference: if the corresponding value
  is a dictionary, then each key-value pair in that dictionary becomes
  an attribute name and value for the new tag token under
  construction; otherwise, a DOMException is thrown.

In the latter two cases, if the replacement would cause any attribute
to take on an invalid value, it is handled in the same way that it
would be if DOM manipulation had been used to set that attribute to
that value.

### Rationale

In some implementations, DOM method invocation is so expensive that
constructing even a relatively short document fragment with
`create<node>` and `appendChild` is slower than setting `innerHTML`.
Therefore, whatever new syntactic sugar we invent for HTML fragment
literals needs to expand to a _single_ library call rather than a
sequence of operations.  This in turn requires a mechanism for
carrying out substitutions within the HTML parser. I have deliberately
written this up as an abstract set of new tokenizer rules rather than
a detailed change proposal; the latter would have to be written in the
same prose-algorithmese as the tokenizer spec itself, and that would
obscure what is being proposed.  I have been as liberal as I dare
about which tokenizer states can make use of substitutions, but it is
unclear what many of them are for, so I may have missed some places
where substitutions should be allowed.

The substitution mechanism should automatically quote all
syntactically significant characters; I *believe* that emitting string
contents "as a sequence of character tokens" is the correct way to do
this within the HTML5 parser algorithm.  Note that I do allow
insertion of arbitrary text into inline `<script>` and `<style>`
elements and a few others (RCDATA/RAWTEXT/script data states); this
can't change where the element *ends* but it could conceivably change
the meaning of a script or style sheet in an unsafe way.

We do not want to have to call _back_ into the JS interpreter to
evaluate substitutions, as this can be just as expensive as
JS-to-native method invocation, so we accept only strings in most
contexts.  However, it may be useful to be able to supply entire
document fragments as substituents in a quoting-safe way, and the
obvious tactic is to allow Nodes as substituents in data state.

## <code>h\`...\`</code> syntactic sugar

The JS parser scans each `h`-prefixed backquoted string for
occurrences of U+007B LEFT CURLY BRACKET not immediately preceded by
an odd number of U+005C REVERSE SOLIDUS characters.  From each such
LEFT CURLY BRACKET, it scans forward for a subsequent U+007D RIGHT
CURLY BRACKET at the same nesting level, counting parentheses (U+0028,
U+0029) and square brackets (U+005B, U+005D) as well as curly brackets
for nesting.  It is a syntax error if the grouping characters are
misnested.

The text in between the matching curly brackets is extracted and
parsed according to the standard JavaScript `Expression` production
(note that this production is _not_ used to determine the end of the
extraction).  It is a semantic error if the expression can be
determined to have side effects at compile time.  The parser
substitutes a gensym for each extracted expression; it SHOULD (in the
RFC2119 sense) merge the expressions into equivalence classes and use
the same gensym for all occurrences of the same equivalence class.

The overall literal is then replaced by a call to
`document.parseDocumentFragment` whose `htmlText` argument is the
backquoted string after `{...}` replacement, and whose `substitutions`
argument is a dictionary whose keys are the gensyms and whose values
are the results of evaluating the extracted expressions.  Each
expression, after evaluation, is processed through an abstract
operation which I shall call `[[primToString]]`.  This converts all
_primitive_ and _boxed primitive_ JavaScript types to string as-if by
the standard `ToString` abstract operation, but leaves objects of any
other type alone.

Thus, the "motivating example" above might get rewritten as

```js
function addUserBox(userlist, username, icon, attrs) {
  var section = document.parseDocumentFragment(
      '<section class="user" {A}>
         <h1>{B}</h1>
       </section>', { "A": [[primToString]](username),
                      "B": [[primToString]](attrs) });
  if (icon)
    section.append(document.parseDocumentFragment(
        '<img src="{A}" alt="">', { "A": [[primToString]](icon) });
  userlist.append(section);
}
```

Note that there is no need to protect the gensyms against collisions
with other identifiers in the program, since they will only be used
for lookup in the `substitutions` dictionary, and by construction,
nothing else will.

### Rationale

This syntactic sugar is similar to, but not the same as, the sugar
proposed for
[general JavaScript quasi-literals](https://web.archive.org/web/20120712171534/http://wiki.ecmascript.org/doku.php?id=harmony:quasis).
The key differences are that our substitutions use `{...}` instead of
`${...}`, and we simply match curly brackets rather than using
`Expression` to determine the end of the substitution.  I believe both
are in keeping with the way similar things have been done in e.g. PHP
and Python.

The `[[primToString]]` conversion improves the readability of simple
cases, e.g. one may write

```js
h`Two and two are {2+2}`
```

instead of

```js
h`Two and two are {(2+2).toString()}`
```

while staying out of the way of authors who need to substitute
attribute dictionaries or Nodes.

The `h` prefix is maybe too short; if it's to be longer, `html` would
be the logical choice.
