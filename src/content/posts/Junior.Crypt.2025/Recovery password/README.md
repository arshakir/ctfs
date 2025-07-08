---
title: Recovery password

published: 2025-07-02

description: Keepass Exploit

tags: [forensics, CVE, keepass]

category: Junior.Crypt.2025
---

# Recovery password

## Files
```sh
❯ file *
Database.kdbx: Keepass password database 2.x KDBX
KeePass.DMP:   Mini DuMP crash report, 17 streams, Wed Jun 25 19:36:00 2025, 0x621826 type
```

We start off with two files one being a keepass database and a mini dump crash report

Looking at the keepass dump itself theres not a lot we can find but if we do some googling to find any tools we find [CVE-2023-32784](https://nvd.nist.gov/vuln/detail/CVE-2023-32784)
This CVE basically makes it possbile for us to recover the master password from the dump we got

## Getting master password

We can use a tool like [this](https://github.com/matro7sh/keepass-dump-masterkey) to get it give us the master passwd. Only problem is that it can't give us the first character

::github{repo="matro7sh/keepass-dump-masterkey"}

Lets take the most likely password we found at the top `Possible password: ●3St_f0r_z3r0-d4y_HunT1Ng` and now all we need to do is find the first char

Now we can just brute force this with `keepass2john` and then john the ripper or hashcat

```sh
❯ hashcat -m 13400 -a 3 output_john.txt "?a3St_f0r_z3r0-d4y_HunT1Ng" --show
$keepass$*2*60000*222*4c2aa3628c92eb4236ece5b1fb0c64036703970d0330163636159c331e534f3d*233bf522e4ddbd00457411979ccc7bb26bc19ab3cff6cffc41cd2387f43f8730*64167f5bc4846d9c825628cda00b8d3e*d9109f2d7549ee4669e1d52fa603f58c9bc6b3afdd64cc7cd8dc947f97c5c230*16b51569a10bcfb74ecd28b36b28b43ad8bdc54b13bb187ca17e04cf82f71a3d:z3St_f0r_z3r0-d4y_HunT1Ng
```

Our master password is: `z3St_f0r_z3r0-d4y_HunT1Ng`

## Getting the flag

So now we have the master password we can open the database with keepass and unlock all the passwords

One of the passwords is `grodno{T001_uP_0r_Dr00L_D0wn}` which is our flag yippee
