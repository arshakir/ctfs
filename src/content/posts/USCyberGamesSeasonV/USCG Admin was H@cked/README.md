---
title: USCG Admin was H@cked

published: 2025-06-18

description: Find the malicious startup application

tags: [windows, registry, forensics, hivexsh]

category: US Cyber Games Season V
---

# USCG Admin was H@cked
> One of the US Cyber Games administrators had their system hacked. There is a malicious startup Application set to run when a user logs in. Can you help find it?

## Files

We start of with a `registry.7z` and when we unzip it we get
```
default:  MS Windows registry file, NT/2000 or above
ntds.dit: Extensible storage engine DataBase, version 0x620, checksum 0xf9034e0d, page size 8192, DirtyShutdown, Windows version 6.0
SAM:      MS Windows registry file, NT/2000 or above
SECURITY: MS Windows registry file, NT/2000 or above
software: MS Windows registry file, NT/2000 or above
system:   MS Windows registry file, NT/2000 or above
Users:    directory
```

## Finding the start up application

Knowing it was the USCG user was hacked lets go to the USCG user directory

The only file in `Users/uscgadmin` is `NTUSER.DAT: MS Windows registry file, NT/2000 or above`

Now we use a tool called `hivexsh` which makes it easy to navigate windows registry files using usual commands like `ls` and `cd`

Lets navigate to the `Software\Microsoft\Windows\CurrentVersion\Run` directory using our usual `cd`

Now we list the contents of the registry folder using `lsval` and we get our flag

`" SVUSCG{uf0undme}"="C:\\Users\\uscgadmin\\Documents\\MSDCSC\\msdcsc.exe"`
