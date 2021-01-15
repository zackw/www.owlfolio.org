---
title: Operating system selection for $PROJECT, mid-2015
date: 2015-07-07 18:08
slug: os-for-project-x-2015
...

Presented without context, for amusement purposes only, a page from my
notes:

<table>
<style scoped>
th, td { font-size: 80%; }
td { text-align: left; padding-left: 15px; }
</style>
<thead>
<tr><th></th><th>FreeBSD</th><th>NetBSD</th><th>Linux</th>
</thead>
<tbody>
<tr><th>Per-process default route</th>
<td>Poorly documented,<br>possibly incomplete</td>
<td>Probably not</td>
<td>Poorly documented,<br><a href="https://bugzilla.kernel.org/show_bug.cgi?id=97811">buggy</a></td>
<tr><th>Can compile <a href="http://phantomjs.org/">PhantomJS</a></th>
<td>Probably</td><td>Probably</td><td>Yes</td></tr>
<tr><th>Jails</th><td>Yes</td>
<td>No</td>
<td>Not really</td></tr>
<tr><th><a href="http://xenproject.org/">Xen</a> paravirtual
guest</th><td><a href="https://wiki.freebsd.org/FreeBSD/Xen">Incomplete</a></td>
<td>Yes</td>
<td>Yes</td></tr>
<tr><th>System call tracing</th>
<td>truss</td>
<td>None?</td>
<td>strace</td></tr>
<tr><th>pipe2</th><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><th>closefrom</th><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><th>sysctl</th><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><th>getauxval</th><td>No</td><td>No</td><td>Yes</td></tr>
<tr><th>signalfd</th><td>No</td><td>No</td><td>Yes</td></tr>
<tr><th>execvpe</th><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><th>Reference documentation</th>
<td>Acceptable (<a href="https://en.wiktionary.org/wiki/your_mileage_may_vary">YMMV</a><sup>1</sup>)</td>
<td>Acceptable (YMMV)</td>
<td>Major gaps</td></tr>
<tr><th>Tutorial documentation</th>
<td>Terrible</td>
<td>Terrible</td>
<td>Terrible</td></tr>
<tr><th>Package management</th>
<td>Broken as designed</td>
<td>Broken as designed</td>
<td>Good</td></tr>
<tr><th>System maintenance automation</th>
<td>I can't find any</td>
<td>I can't find any</td>
<td>Acceptable</td></tr>
<tr><th>QA reputation</th>
<td>Excellent</td>
<td>Good</td>
<td>Good</td></tr>
<tr><th>Security reputation</th>
<td>Good</td>
<td>Good</td>
<td>Debatable</td></tr>
<tr><th>Development community</th>
<td>Unknown to me</td>
<td>Unknown to me</td>
<td>Full of assholes</td></tr>
</table>

<sup>1</sup> It makes sense to me, but then, I taught myself Unix
system programming and administration by reading the SunOS 4 manpages.
