---
title: Making OSX Emacs less broken
date: 2012-07-14 08:50
---

If you find that Emacs on OSX fails to pick up the same `$PATH`
setting that you get in command line shells, instead defaulting to an
impoverished default that doesn't include (for instance) anything
installed via MacPorts:

```lisp
(add-hook 'after-init-hook
         #'(lambda ()
             (setenv "PATH"
               (with-temp-buffer
                 (call-process "/bin/bash"
                               nil
                               (list (current-buffer) nil)
                               nil
                               "-l" "-c" "printf %s \"$PATH\"")
                 (buffer-string)))))
```

I am only embarrassed that I put up with the brokenness for as long as
I did.
