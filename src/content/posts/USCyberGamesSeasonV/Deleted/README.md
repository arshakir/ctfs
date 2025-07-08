---
title: Deleted

published: 2025-06-18

description: Recover the deleted file

tags: [file recovery, sleuthkit, forensics]

category: US Cyber Games Season V
---

# Deleted
> One of the US Cyber Games administrators deleted a File that they need for the season 5 that they need to give to Brad. Recover the deleted file from the image and provide us with the flag for this file that Brad and Jessica paid a Graphic Artist to create.

## File

One file: `SVUSCG.dd-001.001: DOS/MBR boot sector; partition 1 : ID=0x7, active, start-CHS (0x0,32,33), end-CHS (0x1e6,254,63), startsector 2048, 7829504 sectors`

## Recovering the file

We can use `sleuthkit` and its tools `fls` and `icat`

Looking at the `file` output we now that this is an `ntfs` file starting at `2048` so we use this in our `fls` command

```
fls -o 2048 -f ntfs SVUSCG.dd-001.001
r/r 4-128-1:    $AttrDef
r/r 8-128-2:    $BadClus
r/r 8-128-1:    $BadClus:$Bad
r/r 6-128-4:    $Bitmap
r/r 7-128-1:    $Boot
d/d 11-144-4:   $Extend
r/r 2-128-1:    $LogFile
r/r 0-128-6:    $MFT
r/r 1-128-1:    $MFTMirr
r/r 9-128-8:    $Secure:$SDS
r/r 9-144-11:   $Secure:$SDH
r/r 9-144-14:   $Secure:$SII
r/r 10-128-1:   $UpCase
r/r 10-128-4:   $UpCase:$Info
r/r 3-128-3:    $Volume
r/r 36-128-1:   autorun.inf
d/d 37-144-5:   boot
r/r 52-128-3:   bootmgr
d/d 1120-144-1: CFFG
d/d 53-144-1:   efi
d/d 1119-144-1: EFSTMPWP
r/r 1113-128-3: Email 2 Oct 1.pdf
r/r 1114-128-3: Memo Oct 5.pdf
r/r 1111-128-3: Perf Oct 20.pdf
r/r 1112-128-3: Resignation Oct 21.pdf
r/r 63-128-3:   setup.exe
d/d 64-144-6:   sources
r/r 1115-128-1: stuff.txt
d/d 997-144-1:  support
d/d 1116-144-1: System Volume Information
d/d 1104-144-1: upgrade
r/r 1110-128-1: VeraCrypt Setup 1.26.7.exe
-/r * 1136-128-3:       2025-06-04_11-48-36.jpg
V/V 1280:       $OrphanFiles
```

Based on the output the only file that was delted was `2025-06-04_11-48-36.jpg` so now we extract that using `icat -o 2048 -f ntfs SVUSCG.dd-001.001 1136-128-3 > file.jpg`

Now we just open `file.jpg` and our flag is right there

![file.jpg](file.jpg)
