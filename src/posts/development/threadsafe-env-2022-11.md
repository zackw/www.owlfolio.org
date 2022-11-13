---
title: "Thread-safe Environment Variable Mutation: Working Draft 2022-15"
date: 2022-11-15 15:29:33
---

This is a draft proposal for changes to the POSIX specification for
environment variables (including both the various C library functions
for access to environment variables, and the underlying data
structure).  The goal is to make it possible for multithreaded
programs to modify “the environment” (the set of environment
variables, with their values) safely.

<!--more-->

## Background

> This proposal was inspired by the lengthy discussion of thread-related
> limitations of the environment variable API here:
> <https://internals.rust-lang.org/t/synchronized-ffi-access-to-posix-environment-variable-functions/15475>.
> An earlier version was posted at
> <https://research.owlfolio.org/scratchpad/threadsafe-env-v0.md>
> almost a year ago.

“The environment” is a set of key-value pairs (key and value are both
strings) supplied to each Unix process by its parent (via `execve`).
These typically contain small pieces of information related to the
user’s session and its configuration, such as the preferred UI
language and the search path for command-line programs.  The C library
provides functions for looking up the value of a key (`getenv`),
establishing a new key-value pair or changing the value associated
with an existing key (`putenv`, `setenv`), deleting a key
(`unsetenv`), and clearing the environment entirely (`clearenv`).  All
of these functions existed, in some form, long before the addition of
threading to the POSIX standards, and therefore thread safety was not
a concern in their design.

Modern C libraries include internal locking, sufficient to prevent the
global data structure that holds the environment from being corrupted
by concurrent operations, as long as all accesses go via the above
functions.  However, several race conditions still exist for a
multithreaded _application_ that modifies the environment.  The most
important of these is that `getenv` returns a pointer to a C-string
which is part of the live data structure.  A call to `putenv`,
`setenv`, `unsetenv`, or `clearenv` from another thread may modify or
deallocate that string, racing with _the application’s use of its
contents._ Some C libraries provide a `getenv_r` which addresses this
race by copying the string that `getenv` would return into a
caller-supplied buffer before releasing the internal lock.
Unfortunately, the only way the application can know how big to make
the buffer is by guessing and enlarging the buffer if the call fails.

Another important hole in the thread-safety of the existing API is the
global variable `environ`, which holds a pointer to the actual
underlying data structure.  This variable is accessible to
applications—it has to be, because normal usage is to supply it as the
third argument to `execve`—but the associated lock object is _not_
accessible, so any _use_ of this variable in a multithreaded program
(e.g. to iterate over the entire environment) could race with changes
to the environment by another thread.  (Note that one typically calls
`execve` in a child process that has just been created by `fork`,
which duplicates only the calling thread and makes the entire address
space copy-on-write; _in this context_, using `environ` as the third
argument to `execve` is safe.)

(As you might expect of an API that dates all the way back to Unix
Version 7, the data pointed to by `environ` is the simplest structure
that could possibly work: an unsorted array of pointers to C strings,
which are expected to be in the format `VAR=VALUE`, with a null
pointer for an end-of-list sentinel.)

The current state of affairs is that C library maintainers have
declared that any process that currently hosts more than one thread
must treat the environment as read-only or else risk catastrophic
malfunctions (e.g. corruption of the `malloc` arena).  This might not
_seem_ to be a serious problem, since the most common reason to _want_
to modify the environment is to tweak settings at startup time.
However, there is no way for one module of a large program (perhaps
assembled from many libraries, maintained by different groups of
people) to know whether some other module has already started some
threads.

Runtimes for languages more managed than C (e.g. Java) sometimes
choose to copy the entire environment into a data structure they
control on startup.  This allows them to provide thread safety for all
operations on environment variables from within the language, but it
means that changes are not visible to any code running in the same
process that is not written in the language (e.g. for Java,
third-party libraries used via the “native code” interface) and also
incurs extra startup costs.

The goal of this proposal is to lay out a combination of new C library
functions, and changes to existing functions and rules, that will
enable programs to read and write environment variables in a
thread-safe manner, accommodating everything application programmers
might reasonably want to do.

## Design Constraints

I have written this proposal with the overarching goal of minimizing
required changes to application code.  In particular, programs that
`getenv` to access individual environment variables, but never modify
environment variables, should continue to work unmodified, and
programs that use `environ` _solely_ as an argument to `exec` and/or
`spawn` functions (`execve`, `execle`, `posix_spawnp`, etc.)  should
also continue to work unmodified.  To the maximum extent possible,
_single-threaded_ programs should also continue to work unmodified, no
matter what they do to the environment, or how they do it.

If possible, there should be no new startup costs for programs that do
not use the environment at all, whether single- or multithreaded.

## Changes to Existing APIs

We can get most of the way to a thread-safe environment by making
the following changes to the specifications of existing APIs:

1. Require `getenv`, `setenv`, `putenv`, `unsetenv`, and `clearenv` to be
   thread-safe, codifying the internal locks that already exist.
   They remain async-signal unsafe.

1. Declare it to be thread-*unsafe*, but otherwise legitimate, to
   inspect the data pointed to by `environ`.  That is, a program that
   directly accesses this data, but does not modify it, has
   well-defined behavior if and only if there is only one thread in
   the process at the time, or the program supplies its own locking
   which makes inspection mutually exclusive with calls to functions
   that modify the environment.

   Corollary: `execve(program, args, environ)` is safe on the child
   side of `fork`, but not necessarily otherwise.

1. Require the implementation to ensure that strings returned by
   `getenv` will remain allocated for the lifetime of the process, and
   will not change after `getenv` returns.

1. Forbid the application to modify the `environ` global, or any of
   the data it transitively points to, by any means other than the
   documented set of environment variable access APIs (including any
   implementation extensions).  Violation of this rule causes the
   program to have undefined behavior, as the C standard uses that
   term.  (POSIX already forbids direct modification of the data
   pointed to; the new requirement is to not modify the pointer itself.)

   This is the opposite side of the coin from change #3; without it,
   there is no way for the implementation to guarantee that strings
   returned by `getenv` will remain valid and immutable for the
   lifetime of the process.

   As a matter of quality of implementation (QoI), _single-threaded_
   programs (programs that _never_ create a second thread) that alter
   environment data directly should continue to work unmodified.

   Corollary: The application is now forbidden to modify or deallocate
   any string it has passed to `putenv`.  (I’m calling this out
   because the current specification of `putenv` explicitly says that
   modifications are _allowed_.)

   Corollary: The third argument to `main` is equal to `environ` upon
   program startup, therefore modification of the data it points to is
   also forbidden.  (I’m calling this out because it might not be
   obvious that both pointers point to the same data.)

## New APIs

The changes described in the previous section have two major
limitations.

First, any string returned by `getenv` must now remain allocated and
immutable for the lifetime of the process, which means that this loop

```c
    for (int i = 0; i < 1000; i++) {
        char buf[5];
        snprintf(buf, sizeof buf, "%d", i);
        setenv("VARIABLE", buf);
        use(getenv("VARIABLE"));
    }
```

must leak 999 copies of a string of the form `VARIABLE=nnn`.  This is
a rare usage pattern _except_ for shells, where the difference between
an environment variable and a shell-language variable may be blurred
or nonexistent.  Shells may well choose to manage their own data
structure for variables, but it would be nice to give them the
_option_ of using the C library’s built-ins without suffering an
unavoidable memory leak.  Also, language runtimes that need to copy
strings returned by `getenv` for their own reasons (e.g. to convert
from the locale’s encoding to UTF-8, or because their notion of a
“string” has to have its lifetime managed by a garbage collector)
should not have to keep the other copy around forever.

Second, there is no thread-safe way to iterate over all the
environment variables, and the new restrictions on `environ` mean
there is no longer any supported way to replace the entire set of
variables atomically.

These restrictions can only be lifted by introducing new APIs.
I believe the minimal set of additions is one opaque type and six
functions, as described below.  Their names are tentative.

```c
/** Retrieve the value of an environment variable named NAME.
 *
 * If the variable is found, returns a pointer to a string of the
 * form NAME=value.  (Caller must skip over the `NAME=` part to get
 * at the value.)  If not found, returns NULL.
 *
 * Unlike getenv(), the string returned by this function is *not*
 * permanently allocated.  However, it will remain allocated at least
 * until it is passed to env_release(), putenv(), or (transitively)
 * env_replace_all().  Caller may not modify the string.
 */
const char *env_lookup(const char *name);

/** Release a reference to an environment string.
 *
 * It is incorrect to use this function on a string that was not
 * returned by either env_lookup() or env_next() (see below).
 *
 * It is also incorrect to use this function more than once per time a
 * string was returned (that is, for any given char* there must be
 * exactly one call to env_release() per env_lookup()/env_next()).
 *
 * If you pass a string that was returned by env_lookup() or
 * env_next() to putenv() or (transitively) env_replace_all(),
 * that implicitly causes a call to env_release() for that string.
 */
void env_release(const char *var);
```

These functions replace `getenv` for programs that frequently modify
the environment.  This version of the loop shown earlier

```c
    for (int i = 0; i < 1000; i++) {
        char buf[5];
        snprintf(buf, sizeof buf, "%d", i);
        setenv("VARIABLE", buf);

        const char *v = env_lookup("VARIABLE");
        use(v + sizeof "VARIABLE=" - 1);
        env_release(v);
   }
```

does not leak memory.  This is also useful for language runtimes that need
to copy strings returned by `setenv` for their own reasons, e.g. Rust

```rust
pub fn var_os<K: AsRef<OsStr>>(key: K) -> Option<OsString> {
    let kraw = key.as_ref().as_bytes();
    let klen = kraw.len();
    let k = CString::new(kraw).ok()?;
    unsafe {
        let s = libc::env_lookup(k.as_ptr());
        if s.is_null() {
            return None;
        }
        // this copies the string
        let v = OsStringExt::from_vec(
            CStr::from_ptr(s + klen + 1).to_bytes().to_vec());
        libc::env_release(s);
        Some(v)
    }
}
```

Strings returned by `env_lookup` can also be released by passing them
to `putenv`; this facilitates _temporary_ modifications to the
environment.

```c
    char *old_TZ = env_lookup("TZ");
    setenv("TZ", "Pacific/Samoa");
    do_something_with_localtime();
    putenv(old_TZ);
```

Of course the _effect_ of this is global, and therefore it may not be
a sensible thing to do in a multithreaded program.

```c
/** Replace the entire environment, atomically.
 *
 *  The `envp` argument must be an array of `VAR=value` strings,
 *  terminated by a NULL pointer, same as the third argument to
 *  `execve`.  Additionally, `envp` must point to memory allocated by
 *  `malloc`, and each of the `VAR=value` strings must be either a
 *  string previously returned by `env_lookup` or `env_next` and not
 *  yet passed to `env_release`, or a fresh allocation made by
 *  `malloc`.  The C library takes ownership of all the allocations
 *  reachable from `envp`, and performs the equivalent of `env_release`
 *  for all strings brought over from the old environment.
 */
void env_replace_all(const char **envp);
```

This function replaces assignment to `environ`.

```c
/** Iterator over the environment. */
typedef struct { /* unspecified */ } ENV_ITER;

/** Begin an iteration over environment variables.
 *
 * This function behaves as-if it takes an atomic snapshot of the
 * environment.  That is, concurrent modifications to the environment
 * during an iteration will *not* be visible through the iteration.
 * It is unspecified whether such modifications are visible to
 * getenv() or env_lookup() on *any* thread.
 *
 * It is implementation-defined whether the object returned by this
 * function can be used from a different thread than the one that
 * called this function.
 *
 * A thread that is iterating over all environment variables may not
 * call any function that modifies the environment.  Violations of
 * this rule do not cause undefined behavior but may cause deadlock.
 */
ENV_ITER *env_iter(void);

/** Each time this function is called, it returns a string of the form
 *  VAR=value, representing one environment variable, and advances the
 *  iteration to the next one.  It returns NULL when all of the
 *  environment variables have been returned.
 *
 *  Each of the strings returned by this function must be released
 *  (by passing it to `env_release`, `putenv`, or `env_replace_all`)
 *  when the caller is done with it.  Note that calls to `putenv` and/or
 *  `env_replace_all` must be deferred until after the iteration is complete.
 */
const char *env_next(ENV_ITER *iter);

/** End an iteration over environment variables.
 *  The iterator object need not have been advanced over all of the variables.
 */
void env_iter_close(ENV_ITER *iter);
```

These functions provide a thread-safe way to iterate over the
environment. They are modeled on opendir/readdir/closedir.

## Implementation notes

This section describes one possible way to implement the proposed
changes.

The C library internally maintains a reader-writer lock that protects
the array pointed to by `environ`.  All of the above functions take
this lock in the appropriate sense.

The C library also maintains a table of ancillary data for each
environment variable.  It is protected by the same lock as the
`environ` array, and created on the first call to any
environment-variable access function. The ancillary data includes,
perhaps among other things, a reference count which is incremented by
`env_lookup` and `env_next` and decremented by `env_release`.  This
reference count has a special sentinel value (probably represented as
`(T)-1` for some type T) which means _either_ that the `VAR=value`
string for that variable has not been changed from what it was on
program startup (and therefore the string is in the “information
block” created by `execve`, rather than the `malloc` heap) _or_ that
the variable has been read by a call to `getenv` and therefore the
`VAR=value` string can no longer be deallocated.

The ancillary table maintains entries for strings that have been
removed from the environment, until their reference counts drop to
zero.  This means it has to be indexed by the address of the
`VAR=value` string, rather than by offset in the `environ` array.

`setenv` and `putenv` can change an existing `VAR=val` string, if and
only if its reference count is 1 (i.e. the string is in the `malloc`
heap _and_ the only live reference is from the `environ` array).
Otherwise `setenv` creates a new `VAR=val` string on the heap and
replaces the old entry in `environ` with it, and `putenv` swaps in the
string it was given.

`environ` itself is copied into `malloc` space on the first call to
any function that modifies environment variables, and possibly also by
any function that _reads_ environment variables (e.g. so that it can
be sorted).

`env_iter` _may_ take a read lock and hold it until the matching call
to `env_iter_close`.  An implementation that does this will be subject
to all the dire caveats listed in the spec for `env_iter`:

 * The `ENV_ITER` object is tied to the thread that called `env_iter`.
 * Modifications to the environment, concurrent with an iteration, are
   not visible to _any_ thread until the iteration finishes (because
   the modification call will block until it can acquire a write lock).
 * An attempt to modify the environment, from a thread that is
   iterating over it, will deadlock.

An alternative implementation is for `env_iter` to copy the `environ`
array to private storage (inside the `ENV_ITER` object), and increment
all the reference counts on individual strings, before returning.
This design would permit it to return _without_ holding a read lock,
and thus avoid all of the above issues, but it will have higher
overhead, particularly in the case where iterations are frequently
cancelled before completion.

Optionally, as a safety measure, have the OS kernel make the
“information block” created by `execve` be read-only.  This means that
several of the scenarios described as undefined behavior, above, will
lead to prompt memory protection exceptions as long as the variable
being tampered with has not been changed since process startup.  Note
that this would also affect the command line arguments and the ELF
auxiliary vector, with potential negative fallout; in particular, GNU
`getopt` may permute the elements of `argv`, which would crash, and it
would no longer be possible to erase the value of the `AT_RANDOM` auxv
entry after using it. (Probably `AT_RANDOM` should just be removed,
since everyone has `getrandom(2)` or equivalent now.  I’m not sure
what to do about `getopt`.)
