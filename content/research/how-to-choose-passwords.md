Title: How To Choose Passwords
Date: 2011-05-25 15:03
Slug: how-to-choose-passwords

When I talk to people who aren't security researchers about
[history sniffing](/research/interactive-sniffing/), they want to know
whether they should worry about it, and I say no: the only thing you
can do to protect yourself is use the latest version of your favorite
browser, which you should do anyway; besides, the interactive attacks
will probably never appear in the wild. But if I only ever talk about
computer security topics that are only relevant to researchers, I'm
not helping people as much as I could, and I'm scaring them about
things they can't control. So *this* post is about something you
*should* worry about, because it's under your direct control; lots of
people do it poorly and that does make them less safe online; and it's
easy to do well. That thing is choosing passwords.

You have probably heard that you shouldn't reuse the same password on
many different websites, and that your passwords should be long,
contain numbers and punctuation, and avoid dictionary words. But you
probably haven't heard anyone explain why, and you probably *have*
noticed that these two pieces of advice are hard to follow at the same
time, because long gibberish passwords are hard to remember even if
you only have one of them. I'm going to tell you why you should do
these things, and how to do them without too much grief.

## Don't use the same password on many different websites

No matter how good your password is, the bad guys might discover what
it is. For instance, if you log into an unencrypted website over an
unencrypted wireless network, anyone else on the same wireless network
can listen in on the radio traffic and discover your password. (It's
just like eavesdropping on a private conversation.) Or you might
accidentally type your password into a website that *looks* like the
real thing but is actually a
[fake created to trick you](https://en.wikipedia.org/wiki/Phishing).

Suppose the bad guys have discovered your password for a Web forum.
That's not a big deal, because someone impersonating you *on one
forum* probably isn't a big deal. You might have to apologize to some
people for letting some schmuck insult them while pretending to be
you.  But the bad guys know that people often use the same password on
many different websites, so they're going to try to log into your
email with that password, and your bank, and so on. If they
succeed---if you *did* use the same password---they might be able to
ruin your life, or at least steal some of your money. But if you
always use different passwords on different websites, the bad guys
have to discover the password you use for your bank (and nothing else)
in order to steal your money.

How do you manage to remember lots of different passwords, especially
when (as I'm about to explain) they all need to be long and
complicated?  The best way is to let the computer---specifically, your
browser's
[password manager](https://support.mozilla.org/en-US/kb/password-manager-remember-delete-change-passwords)---do
it for you. This may seem unsafe, but it's actually much safer than
using the same password for everything. The password manager cannot be
fooled by phishing sites, and it has no trouble remembering lots of
long complicated passwords. Yes, all the passwords are in a file on
your computer. But the only way the bad guys can get at that is by
physically stealing your computer, or installing
[spyware](https://en.wikipedia.org/wiki/Spyware) on it remotely. If
you keep your computer up to date with security patches, you don't
have to worry about spyware much. If your computer is in danger of
being physically stolen (e.g. it's a laptop) you should use the
[master password](https://support.mozilla.org/en-US/kb/use-master-password-protect-stored-logins)
mode of your browser's password manager, so that the file on your
computer is encrypted. Whether or not you have to worry about theft,
you should enable
[Sync](https://support.mozilla.org/en-US/kb/how-do-i-set-up-firefox-sync),
or equivalent feature, even if you have no other computer to sync
with; that way, if your computer *breaks*, there's still a backup of
all your passwords out there in the cloud (safely encrypted).

## Use long, complicated passwords

The other way the bad guys discover passwords is by breaking into
servers that store entire databases of them. If these databases have
been designed correctly, that doesn't tell them anything by itself,
because the passwords are hashed. Hashing deserves a little
explanation: suppose my password on some site is "12345"
([the kind of thing that an idiot would have on his luggage](http://www.imdb.com/title/tt0094012/quotes?qt0535097)). The
server doesn't store "12345" in its database, it stores
"827ccb0eea8a706c4c34a16891f84e7b", which is the result of running
"12345" through a
*[cryptographic hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function)*,
in this case [MD5](https://en.wikipedia.org/wiki/MD5). It's easy to
convert a password into its hash, but it's prohibitively hard to do
the reverse.  MD5 is old and no longer considered a good choice for
passwords (or anything, for that matter), but there is still no known
algorithm to take an arbitrary MD5 hash and reveal an input that
produces that hash, other than guess-and-check.

So the bad guys can't just read the passwords from a database once
they have it. But they can *guess* passwords, run the guesses through
MD5 (or whatever was used), and compare the results to the database
entries.  (They can guess passwords even if they haven't stolen a
database, by feeding the guesses to the site's login form---but that's
much slower and the site admins are likely to notice.) "12345" isn't a
good password because it's easy to guess---but so is *any* five-digit
number: a cheap laptop can calculate the MD5 of all 100,000 five-digit
(or smaller) numbers in less than a second. There are
[something like 250,000 words in English](http://www.oxforddictionaries.com/words/how-many-words-are-there-in-the-english-language)---that's
maybe five seconds' worth of work for the same laptop---so any word in
the dictionary is bad, too. You can buy
[a 40-million-entry word list](http://www.openwall.com/wordlists/) for
$30 that has not only all the words in 20 different languages, but
mangled versions of them (e.g.  "f0od")---that might take an hour or
two to process.

The longer and more complicated your password is, the harder it is to
guess; but that makes it harder to remember as well. Adding
punctuation and numbers doesn't help as much as one would like. There
are 95 characters that you can type on a US keyboard, so there are
95^8^, or about a quadrillion
([short scale](https://en.wikipedia.org/wiki/Long_and_short_scales))
possible eight-character passwords, if you use all those characters. A
quadrillion possibilities is out of the reach of a cheap laptop, but
it's a few weeks' effort for a small cluster of beefy computers---a
determined bad guy could do this for maybe $25,000.

The good news is, you *can* have passwords that can't be guessed this
way but are still easy to remember. The trick is to use *phrases*
rather than words. One random English word is 250,000
possibilities. Two random English words are 62.5 billion
possiblities---250,000 squared.  That's still not enough. But *ten*
random English words is 250,000^10^&nbsp;≈&nbsp;10^54^
possibilities, which is big enough that a modern supercomputer tasked
with the problem would still be guessing when the Sun burns out five
billion years from now.

You can't take just any phrase, though. The bad guys could easily try
every phrase in the
[Concise Oxford Dictionary of Quotations](http://ukcatalogue.oup.com/product/academic/reference/encyclopaedias/quotations/9780199567072.do),
because there are only 9000 of them. I haven't worked out the math,
but I think guessing every sentence in the complete works of
Shakespeare is doable. But nobody has a database of every sentence in
every work of literature that was written with the Latin alphabet. A
phrase taken from somewhere in the middle of an obscure but lengthy
book is a good choice.  Or you could follow this procedure:

1. Go to [Wikipedia](https://en.wikipedia.org/wiki/Main_Page) and
   click on "random article". (You can use any site with a "random
   article" feature for this step, if you'd rather.)
1. Copy the URL of the page you get, and paste it into [the Eater of
   Meaning](http://www.crummy.com/software/eater/). Leave the drop-down on
   "Eat word endings."
1. Choose ten consecutive words from the result. They don't have to all
   come from the same sentence.

Don't worry about finding a sentence that you can remember yourself,
because you're going to have the password manager do it (unless you're
trying to pick the master password).

Some sites have limits on the length of their passwords. This is bad,
and you should complain; but until they fix it, just use the first
*letter* of each word in your ten-word phrase, with some numbers and
punctuation if they insist on numbers and punctuation. That kind of
password is theoretically crackable, as I said earlier, but it's
likely to be better than lots of other passwords in the database. So
if the bad guys get the database, they will crack so many *other*
people's passwords before they get to yours that they don't feel they
have to bother cracking yours. (It's kind of like the joke about how
fast you need to run away from a lion.)

If there's no limit on the length of the password, but the site still
insists on numbers and/or punctuation, put them in between the words;
that's easier to type.
