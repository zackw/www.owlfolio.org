Title: Using GPG2 with a read-only .gnupg directory
Date: 2016-04-18 11:46:14
Slug: readonly-gpg2

Another bulletin funded by the I Just Blew An Entire Morning On This
Foundation:

Suppose you want to encrypt and sign files using [`gpg`][gpg], but
without giving it ownership or write access to its own keystore.  For
instance, this might be necessary if the `gpg` process is going to be
run from a low-privilege CGI user and you don't have root privileges
on the webserver.  This is relatively straightforward with the
"classic" version 1, although there's an error message that's harmless
but impossible to suppress, but version 2 made some architectural
changes that make it harder, and does not document the necessary
tricks.  Below the fold, how you do it.

<!--more-->

First, create the signing key, and import and countersign the public
key to which files will be encrypted.  I'm going to assume you already
know how to do that.  Using the same version of `gpg` that the
low-privilege user will use, encrypt and sign a test message; this is
important not only to make sure that everything works in a "normal"
configuration, but because it may create files you need later.  After
doing this, the contents of your `.gnupg` directory should look like this:

    $ find .gnupg -ls
    7013415  19 drwx------ 3 you   you      10 Apr 18 14:24 .gnupg
    7013416  19 -rw------- 1 you   you    9186 Apr 18 11:58 .gnupg/gpg.conf
    7013684   3 -rw------- 1 you   you     600 Apr 18 13:11 .gnupg/random_seed
    7013425   4 -rw------- 1 you   you    1360 Apr 18 12:08 .gnupg/trustdb.gpg
    7014778   3 drwx------ 2 you   you       4 Apr 18 12:38 .gnupg/private-keys-v1.d
    7014785   4 -rw------- 1 you   you    1376 Apr 18 12:38 .gnupg/private-keys-v1.d/BADC0FFEE0DDF00DBADC0FFEE0DDF00DBADC0FFE.key
    7014781   4 -rw------- 1 you   you     978 Apr 18 13:11 .gnupg/private-keys-v1.d/B01DFACECAB005EB01DFACECAB005EB01DFACECA.key
    7013788   9 -rw------- 1 you   you    3740 Apr 18 12:08 .gnupg/pubring.gpg~
    7013797   9 -rw------- 1 you   you    3740 Apr 18 12:08 .gnupg/pubring.gpg
    7013777   6 -rw------- 1 you   you    2509 Apr 18 12:07 .gnupg/secring.gpg
    7014786   1 -rw-rw-r-- 1 you   you       0 Apr 18 12:38 .gnupg/.gpg-v21-migrated

(Sizes and inode numbers and so on will vary, of course.)  Copy this
directory over to where the low-privilege user can get at it.  Delete
`pubring.gpg~`, `random_seed`, and `gpg.conf` from the copy.  Adjust
permissions and group ownership so that the low-privilege user can
read, but not write, everything:

    $ find gnupg-web -ls
    7015000  19 drwxr-x--- 3 you   web      10 Apr 18 14:24 gnupg-web
    7015001   4 -rw-r----- 1 you   web    1360 Apr 18 12:08 gnupg-web/trustdb.gpg
    7015002   3 drwxr-x--- 2 you   web       4 Apr 18 12:38 gnupg-web/private-keys-v1.d
    7015003   4 -rw-r----- 1 you   web    1376 Apr 18 12:38 gnupg-web/private-keys-v1.d/BADC0FFEE0DDF00DBADC0FFEE0DDF00DBADC0FFE.key
    7015004   4 -rw-r----- 1 you   web     978 Apr 18 13:11 gnupg-web/private-keys-v1.d/B01DFACECAB005EB01DFACECAB005EB01DFACECA.key
    7015006   9 -rw-r----- 1 you   web    3740 Apr 18 12:08 gnupg-web/pubring.gpg
    7015007   6 -rw-r----- 1 you   web    2509 Apr 18 12:07 gnupg-web/secring.gpg
    7015008   1 -rw-r----- 1 you   web       0 Apr 18 12:38 gnupg-web/.gpg-v21-migrated

Now you need to create a new `gpg.conf` file in this directory, with a
bunch of special options:

    $ cat > gnupg-web/gpg.conf <<!
    # modern sane defaults
    charset utf-8
    openpgp
    # fully noninteractive mode
    quiet
    batch
    no-tty
    no-greeting
    #no-secmem-warning # uncomment if necessary
    # no implicit writes to the keystore directory
    lock-never
    no-auto-check-trustdb
    no-random-seed-file
    !
    $ chgrp web gnupg-web/gpg.conf
    $ chmod 640 gnupg-web/gpg.conf

This setup plus an appropriate command-line invocation is sufficient
to make GPG version 1 happy:

    $ echo test message |
      gpg1 --homedir `pwd`/gnupg-web --no-permission-warning \
           --encrypt --sign --recipient ABAD1DEA > test.gpg

but if you try it with version 2 you will get an error message:

    gpg: can't connect to the agent: IPC connect call failed

Agent, you say? Why do we need an agent?  Isn't that just to avoid
having to type one's passphrase all the time?  Apparently version 2 is
doing a modest amount of [privilege separation][], and *always* uses
an agent internally to handle secret keys.  That's the architectural
change I mentioned earlier.  And this means it wants to create a
socket in the keystore directory, which it can't.  (50 demerits for
not reporting the error properly.  This kind of error message should
*always* name the system call that failed (it's not `connect` in this
case!), all the filename(s) involved, and the decoded system error
code.)

To fix this, you can't just create the socket yourself and give it
appropriate permissions, because `gpg` expects to be able to delete and
recreate it.  You need to move the socket to a writable directory ...
but how do we do that?  The manpage smugly informs us that the
command-line option that *used* to move the agent socket around no
longer does anything.  There is still a way, but it isn't documented
anywhere I can find; I got the trick from [this blog post][] and he
doesn't say where he found it.  Create a subdirectory that the
low-privilege user *can* write to, and place a "redirection file"
where gpg expects to find the socket:

    $ mkdir gnupg-web/agent
    $ chmod 775 gnupg-web/agent
    $ chgrp web gnupg-web/agent
    $ printf '%%Assuan%%\nsocket=%s/gnupg-web/agent/S.gpg-agent\n' \
        "$(pwd)" > gnupg-web/S.gpg-agent
    $ chmod 640 gnupg-web/S.gpg-agent
    $ chgrp web gnupg-web/S.gpg-agent

Having done all this, your `gnupg-web` directory should look like
this:

    $ find gnupg-web -ls
    7015000  19 drwxr-x--- 3 you   web      10 Apr 18 14:24 gnupg-web
    7015001   4 -rw-r----- 1 you   web    1360 Apr 18 12:08 gnupg-web/trustdb.gpg
    7015002   3 drwxr-x--- 2 you   web       4 Apr 18 12:38 gnupg-web/private-keys-v1.d
    7015003   4 -rw-r----- 1 you   web    1376 Apr 18 12:38 gnupg-web/private-keys-v1.d/BADC0FFEE0DDF00DBADC0FFEE0DDF00DBADC0FFE.key
    7015004   4 -rw-r----- 1 you   web     978 Apr 18 13:11 gnupg-web/private-keys-v1.d/B01DFACECAB005EB01DFACECAB005EB01DFACECA.key
    7015006   9 -rw-r----- 1 you   web    3740 Apr 18 12:08 gnupg-web/pubring.gpg
    7015007   6 -rw-r----- 1 you   web    2509 Apr 18 12:07 gnupg-web/secring.gpg
    7015008   1 -rw-r----- 1 you   web       0 Apr 18 12:38 gnupg-web/.gpg-v21-migrated
    7015009   2 -rw-r----- 1 you   web     124 Apr 18 13:22 gnupg2/gpg.conf
    7018010   1 drwxrwxr-x 2 you   web       2 Apr 18 13:23 gnupg2/agent
    7018011   2 -rw-r----- 1 you   web      68 Apr 18 13:24 gnupg2/S.gpg-agent

and the command-line invocation shown above should work when executed
as the low-privilege user.

[gpg]: https://www.gnupg.org/
[privilege separation]: https://en.wikipedia.org/wiki/Privilege_separation
[this blog post]: https://michaelheap.com/gpg-cant-connect-to-the-agent-ipc-connect-call-failed/
